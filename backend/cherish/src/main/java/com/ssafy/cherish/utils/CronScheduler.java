package com.ssafy.cherish.utils;

import com.ssafy.cherish.clip.model.dto.ClipVo;
import com.ssafy.cherish.clip.model.mapper.ClipMapper;
import com.ssafy.cherish.clip.model.mapper.VideoMapper;
import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@EnableScheduling
@Component
@Slf4j
public class CronScheduler {

    @Autowired
    private ClipMapper clipMapper;

    @Autowired
    private VideoMapper videoMapper;

    @Value("${custom.path.ffmpeg}")
    private String ffmpegPath;

    @Value("${custom.path.monthly-video}")
    private String monthlyVideoPath;

    //매월 1일로 바뀔때 실행됨
//    @Scheduled(cron = "0/10 * * * * *") // 10초마다 실행 (테스트용)
    @Scheduled(cron = "0 0 1 1 * *") // 매달 1일 새벽 1시에 실행
    public void saveMonthlyVideo() {
        // 모음집 기준 연월 = 이전 달
        Calendar c = Calendar.getInstance();
        c.add(Calendar.MONTH, -1);
        String yearMonth = String.format("%d-%02d-01", c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1);

        try {

            List<ClipVo> clipList = clipMapper.gatherClipsForMonth(yearMonth);

            int coupleId = 0;
            String keyword = "";
            Path mPath = Paths.get(monthlyVideoPath);
            StringBuilder content = new StringBuilder();

            // 파일명 중복을 줄이기 위한 현재시간 String
            String curTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmSSS"));

            if (!Files.exists(mPath)) {
                Files.createDirectories(mPath);
            }

            for (ClipVo clip : clipList) {
                System.out.println("couple : " + coupleId + "keyword : " + keyword + "clipList : " + clip.toString());
                if (clip.getCoupleId() != coupleId || !keyword.equals(clip.getKeyword())) {

                    if (!content.isEmpty()) {
                        String monthFileName = monthlyVideoPath + keyword + "_" + coupleId + "_" + curTime + ".txt";
                        writeFile(monthFileName, content.toString());

                        // 동영상 병합 메서드 호출
                        mergeMonthlyVideo(monthFileName);
                        // 병합 후 클립 리스트 텍스트 폴더 삭제
                        Files.deleteIfExists(Paths.get(monthFileName));

                        // 병합된 동영상 정보를 monthlyVideo 테이블에 입력
                        String filepath = monthFileName.replaceAll(".txt", ".mp4");
                        Map<String, Object> map = new HashMap<>();
                        map.put("keyword", keyword);
                        map.put("coupleId", coupleId);
                        map.put("yearMonth", yearMonth);
                        map.put("filepath", filepath);
                        videoMapper.saveVideo(map);

                        content = new StringBuilder();
                    }
                    coupleId = clip.getCoupleId();
                    keyword = clip.getKeyword();
                }

                // / file 'C:\Users\SSAFY\Documents\cherish_video\1\1\1.mp4' /형식의 텍스트 저장
                if (Files.exists(Paths.get(clip.getFilepath()))) {
                    content.append("file '").append(clip.getFilepath()).append("'\n");
                }
            }
            if (!content.isEmpty()) {
                String monthFileName = monthlyVideoPath + keyword + "_" + coupleId + "_" + curTime + ".txt";
                writeFile(monthFileName, content.toString());
                // 동영상 병합 메서드 호출
                mergeMonthlyVideo(monthFileName);
                // 병합 후 클립 리스트 텍스트 폴더 삭제
                Files.deleteIfExists(Paths.get(monthFileName));

                // 병합된 동영상 정보를 monthlyVideo 테이블에 입력
                String filepath = monthFileName.replaceAll(".txt", ".mp4");
                Map<String, Object> map = new HashMap<>();
                map.put("keyword", keyword);
                map.put("coupleId", coupleId);
                map.put("yearMonth", yearMonth);
                map.put("filepath", filepath);
                videoMapper.saveVideo(map);
            }

        } catch (IOException e) {
            log.error("파일 열기 중 에러 발생: {}", e.toString());
        } catch (SQLException e) {
            log.error("월별 커플 동영상 조회 중 에러 발생: {}", e.toString());
        }
    }

    private void mergeMonthlyVideo(String clipListFile) throws IOException {
        FFmpeg ffmpeg = new FFmpeg(ffmpegPath + "ffmpeg.exe");
        FFprobe ffprobe = new FFprobe(ffmpegPath + "ffprobe.exe");

        String outputFile = clipListFile.replaceAll(".txt", ".mp4");
        //ffmpeg -f concat -safe 0 -i mylist.txt -c copy output.mp4
        FFmpegBuilder builder = new FFmpegBuilder().overrideOutputFiles(true).addInput(clipListFile).addExtraArgs("-f", "concat").addExtraArgs("-safe", "0").addOutput(outputFile).done();

        log.debug("FFmpeg command: {}", builder.build());

        FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
        executor.createJob(builder).run();
    }

    private void writeFile(String filePath, String content) throws IOException {
        FileWriter fw = new FileWriter(filePath);
        fw.write(content);
        fw.close();
    }
}
