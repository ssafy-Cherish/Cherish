package com.ssafy.cherish.clip.model.service;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.dto.ClipVo;
import com.ssafy.cherish.clip.model.mapper.ClipMapper;
import com.ssafy.cherish.utils.SocketHandler;
import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.scheduling.annotation.Async;
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
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ClipServiceImpl implements ClipService {
    @Autowired
    private ClipMapper clipMapper;
    @Autowired
    private  AwsS3Service awsS3Service;

    private final SocketHandler socketHandler;
    @Autowired
    public ClipServiceImpl(SocketHandler socketHandler) {
        this.socketHandler = socketHandler;
    }
    @Value("${custom.path.ffmpeg}")
    private String ffmpegPath;

    @Override
    //파일 입출력이 잘못되었을 경우에도 전체 롤백이 됨
    @Transactional(rollbackFor = Exception.class)
    @Async
    public void saveClip(ClipDto clipDto,String[] pathForMerge,int coupleId) throws Exception {


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
        socketHandler.sendClipUrl(coupleId,clipURL);
    }


    void mergeCoupleClip(String leftVideoPath, String rightVideoPath, String uploadDir) throws IOException {

        FFmpeg ffmpeg = new FFmpeg(ffmpegPath + "ffmpeg");
        FFprobe ffprobe = new FFprobe(ffmpegPath + "ffprobe");
        FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);

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


        executor.createJob(builder).run();
    }

    @Override
    public void createClip(ClipDto clipDto) throws Exception {
        clipMapper.createClip(clipDto);
    }

    @Override
    public int clipCnt(int coupleId) throws Exception {
        return clipMapper.clipCnt(coupleId);
    }

    @Override
    public int changePin(int clipId, boolean mode) {
        return clipMapper.changePin(clipId, mode);
    }

    @Override
    public List<ClipVo> getPinnedClip(int coupleId) {
        return clipMapper.getPinnedClip(coupleId);
    }
}



