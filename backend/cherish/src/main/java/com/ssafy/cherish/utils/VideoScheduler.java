package com.ssafy.cherish.utils;

import com.ssafy.cherish.clip.model.dto.ClipVo;
import com.ssafy.cherish.clip.model.mapper.ClipMapper;
import com.ssafy.cherish.clip.model.mapper.VideoMapper;
import com.ssafy.cherish.clip.model.service.AwsS3Service;
import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.*;

@EnableScheduling
@Component
@Slf4j
public class VideoScheduler {

    @Autowired
    private AwsS3Service awsS3Service;
    @Autowired
    private ClipMapper clipMapper;

    @Autowired
    private VideoMapper videoMapper;

    @Value("${custom.path.ffmpeg}")
    private String ffmpegPath;

    @Value("${custom.path.monthly-video}")
    private String monthlyVideoPath;

//     @Scheduled(cron = "0/10 * * * * *") // 10초마다 실행 (테스트용)

//    @Scheduled(cron = "0 0 1 1 * *") // 매달 1일 새벽 1시에 실행
    @Scheduled(cron="0 30 0/1 * * *")//매일 1시간마다 정각에 실행
    public void saveMonthlyVideo() {
        // 모음집 기준 연월 = 이전 달
        Calendar c = Calendar.getInstance();
        c.add(Calendar.MONTH, -1);
        //지난달
//        String yearMonth = String.format("%d%02d01", c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1);
         // 이번달
        String yearMonth = String.format("%d%02d01", c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 2);

        try {

            List<ClipVo> clipList = clipMapper.gatherClipsForMonth(yearMonth);

            Path mPath = Paths.get(monthlyVideoPath);

            if (!Files.exists(mPath)) {
                Files.createDirectories(mPath);
            }
            Map<String, StringBuilder> map=new HashMap<>();
            for (ClipVo clip : clipList) {
               String clipInfo = clip.getCoupleId() + "_" + clip.getKeyword();
               if(!map.containsKey(clipInfo))
               {
                  map.put(clipInfo,new StringBuilder());
               }
               StringBuilder txtContent = map.get(clipInfo);
               txtContent.append("file '").append(clip.getFilepath()).append("'\n");
            }

            for(Map.Entry<String,StringBuilder> entry: map.entrySet())
            {
                String clipInfo = entry.getKey();
                StringBuilder builder=entry.getValue();
                log.debug("text res : {}",builder);
                String monthFileName = monthlyVideoPath + clipInfo+"_"+yearMonth+"_video"+".txt";
                writeFile(monthFileName, builder.toString());

                // 병합된 동영상 정보를 monthlyVideo 테이블에 입력
                String filepath = mergeMonthlyVideo(monthFileName);
                
                Map<String, Object> video = new HashMap<>();
                int idx=clipInfo.indexOf('_');
                if(idx==-1)
                {
                    log.error("something went wrong during processing monthly video");
                    continue;
                }
                video.put("keyword", clipInfo.substring(clipInfo.indexOf('_')+1));
                video.put("coupleId", Integer.parseInt(clipInfo.substring(0,clipInfo.indexOf('_'))));
                video.put("yearMonth", yearMonth);
                video.put("filepath", filepath);
                videoMapper.saveVideo(video);
            }
        } catch (IOException e) {
            log.error("파일 열기 중 에러 발생: {}", e.toString());
        } catch (SQLException e) {
            log.error("월별 커플 동영상 조회 중 에러 발생: {}", e.toString());
        }
    }

    private String mergeMonthlyVideo(String clipListFile) throws IOException {
        FFmpeg ffmpeg = new FFmpeg(ffmpegPath + "ffmpeg.exe");
        FFprobe ffprobe = new FFprobe(ffmpegPath + "ffprobe.exe");

        String outputFile = clipListFile.replaceAll(".txt", ".webm");
        //ffmpeg -f concat -safe 0 -protocol_whitelist "file,http,https,tcp,tls" -i mylist.txt -c copy output.mp4
        FFmpegBuilder builder = new FFmpegBuilder()
                .overrideOutputFiles(true)
                .addInput(clipListFile)
                .addExtraArgs("-f", "concat")
                .addExtraArgs("-safe", "0")
                .addExtraArgs("-protocol_whitelist","\"file,http,https,tcp,tls\"")
                .addOutput(outputFile)
                .addExtraArgs("-s","1280x720")
                .done();

        log.debug("FFmpeg command: {}", builder.build());

        FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
        executor.createJob(builder).run();

        //s3에 결과 파일 올리기
        String originalFileName=outputFile.substring(clipListFile.lastIndexOf(File.separator)+1);
        FileInputStream input = new FileInputStream(new File(outputFile));
        MultipartFile multipartFile = new MockMultipartFile("file",
                originalFileName, "video/webm", StreamUtils.copyToByteArray(input));
        String clipURL=awsS3Service.uploadFile(multipartFile);
        input.close();

        //병합 후 파일들 삭제
        Files.deleteIfExists(Paths.get(outputFile));
        Files.deleteIfExists(Paths.get(clipListFile));
        return clipURL;
    }

    private void writeFile(String filePath, String content) throws IOException {
        FileWriter fw = new FileWriter(filePath);
        fw.write(content);
        fw.close();
    }
}
