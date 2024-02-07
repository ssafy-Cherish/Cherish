package com.ssafy.cherish.clip.model.service;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.mapper.ClipMapper;
import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@Slf4j
public class ClipServiceImpl implements ClipService {
    @Autowired
    private ClipMapper clipMapper;

    @Autowired
    private  AwsS3Service awsS3Service;

    @Value("${custom.path.ffmpeg}")
    private String ffmpegPath;
    @Value("${custom.path.clip}")
    private String clipPath;

    @Override
    //파일 입출력이 잘못되었을 경우에도 전체 롤백이 됨
    @Transactional(rollbackFor = Exception.class)
    public String saveClip(MultipartFile clip1, MultipartFile clip2, Map<String, Object> map) throws Exception {
        ClipDto clipDto = new ClipDto();

        clipDto.setMeetingId(Integer.parseInt((String) map.get("meeting_id")));
        clipDto.setKeyword((String) map.get("keyword"));

        clipMapper.createClip(clipDto);

        log.info("saveClip 중 생성된 filepath 빈 객체 : {}", clipDto.toString());

        // 클립 병합 시 필요한 경로 설정
        // String[] {leftVideoPath,rightVideoPath,resPath};
        String[] pathForMerge = setClipDir(clipDto);

        //클립 임시 저장
        clip1.transferTo(new File(pathForMerge[0]));
        clip2.transferTo(new File(pathForMerge[1]));

        //클립 병합
        mergeCoupleClip(pathForMerge[0], pathForMerge[1], pathForMerge[2]);


        //TODO : 지금은 임시로 multipartFile로 만드는데 file을 입력받는 awsS3Service.uploadFile 메서드를 받는 방식을 바꿔면 좋을듯

        FileInputStream input = new FileInputStream(new File(pathForMerge[2]));
        MultipartFile multipartFile = new MockMultipartFile("file",
                pathForMerge[3], "video/webm", StreamUtils.copyToByteArray(input));
        String clipURL=awsS3Service.uploadFile(multipartFile);
        input.close();
        // 임시 파일 삭제
        Files.deleteIfExists(Paths.get(pathForMerge[0]));
        Files.deleteIfExists(Paths.get(pathForMerge[1]));
        Files.deleteIfExists(Paths.get(pathForMerge[2]));


        //변경된 filepath clipDto 객체에 넣기
        clipDto.setFilepath(clipURL);

        log.info("saveClip 중 생성된 filepath 채워진 객체 : {}", clipDto.toString());
        clipMapper.updateClipPath(clipDto);
        return clipURL;
    }

    String[] setClipDir(ClipDto clipDto) throws Exception {
        // 클립 저장 경로 설정
        String uploadDir = clipPath + clipDto.getMeetingId() + File.separator;
        Path uploadPath = Paths.get(uploadDir);


        // 디렉토리가 없으면 생성
        if (!Files.exists(uploadPath)) {
            //여기서 IOException 발생 가능성 있음
            Files.createDirectories(uploadPath); // 디렉토리 생성
        }

        // 파일명 생성
        String leftVideoPath = uploadDir + clipDto.getId() + "_" + clipDto.getMeetingId() + "_" + clipDto.getKeyword() + "templeft.webm";
        String rightVideoPath = uploadDir + clipDto.getId() + "_" + clipDto.getMeetingId() + "_" + clipDto.getKeyword() + "tempright.webm";
        String resPath = uploadDir + clipDto.getId() + "_" + clipDto.getMeetingId() + "_" + clipDto.getKeyword() + ".webm";
        String resFile=clipDto.getId() + "_" + clipDto.getMeetingId() + "_" + clipDto.getKeyword() + ".webm";

        return new String[]{leftVideoPath, rightVideoPath, resPath,resFile};
    }

    void mergeCoupleClip(String leftVideoPath, String rightVideoPath, String uploadDir) throws IOException {

        FFmpeg ffmpeg = new FFmpeg(ffmpegPath + "ffmpeg");
        FFprobe ffprobe = new FFprobe(ffmpegPath + "ffprobe");

        //ffmpeg -i left.mp4 -i right.mp4 -filter_complex  -map "[v]" -map "[a]" -ac 2 output2.mp4
        FFmpegBuilder builder = new FFmpegBuilder()
                .overrideOutputFiles(true)
                .addInput(leftVideoPath)
                .addInput(rightVideoPath)
                .setComplexFilter("[0][1]scale2ref='oh*mdar':'if(lt(main_h,ih),ih,main_h)'[0s][1s]; " +
                        "[1s][0s]scale2ref='oh*mdar':'if(lt(main_h,ih),ih,main_h)'[1s][0s]; " +
                        "[0s][1s]hstack=inputs=2[v]; [0:a][1:a]amerge[a]")
                .addOutput(uploadDir)
                .addExtraArgs("-map", "[v]")
                .addExtraArgs("-map", "[a]")
                .addExtraArgs("-ac", "2")
                .done();

        log.debug("FFmpeg command: {}", builder.build());

        FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
        executor.createJob(builder).run();
    }

}



