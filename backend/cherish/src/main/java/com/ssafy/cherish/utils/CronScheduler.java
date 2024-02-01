package com.ssafy.cherish.utils;

import com.ssafy.cherish.clip.model.dto.ClipVo;
import com.ssafy.cherish.clip.model.mapper.ClipMapper;
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

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@EnableScheduling
@Component
@Slf4j
public class CronScheduler {

    @Autowired
    private ClipMapper clipMapper;

    @Value("${custom.path.ffmpeg}")
    private String ffmpegPath;

    @Value("${custom.path.monthly-video}")
    private String monthlyVideoPath;


    //매월 1일로 바뀔때 실행됨
    //@Scheduled(cron = "0 0 0 1 * *")
    //아래는 테스트용 (주석 빼면 10초에 한번씩 실행됨)
    @Scheduled(cron = "0/10 * * * * *")
    public void saveMonthlyVideo() {

        System.out.println(ffmpegPath+" "+monthlyVideoPath);
        try {

            List<ClipVo> clipList = clipMapper.gatherLastMonthClips();

            int coupleId = 0;
            String keyword = "";
            Path mPath =Paths.get(monthlyVideoPath);
            StringBuilder content= new StringBuilder();

            if(!Files.exists(mPath))
            {
                Files.createDirectories(mPath);
            }

            for (ClipVo clip : clipList) {
                if (clip.getCoupleId() != coupleId || !keyword.equals(clip.getKeyword())) {

                    if(!content.isEmpty())
                    {
                        Path monthFileName = Paths.get(monthlyVideoPath+keyword + "_" + coupleId + "_" + LocalDateTime.now().toString()+".txt");
                        Files.createFile(monthFileName);
                        FileWriter fw=new FileWriter(monthFileName.toFile());
                        fw.write(content.toString());
                        content=new StringBuilder();

                        // 동영상 병합 메서드 콜
                        mergeMonthlyVideo(monthFileName.toString());
                    }
                    coupleId= clip.getCoupleId();
                    keyword=clip.getKeyword();
                }
                // / file 'C:\Users\SSAFY\Documents\cherish_video\1\1\1.mp4' /형식의 텍스트 저장
                content.append("file '"+clip.getFilepath()+"'\n");
            }

            if(!content.isEmpty())
            {
                Path monthFileName = mPath.resolve(keyword + "_" + coupleId + "_" + LocalDateTime.now().toString()+".txt");
                Files.createFile(monthFileName);
                FileWriter fw=new FileWriter(monthFileName.toFile());
                fw.write(content.toString());
                // 동영상 병합 메서드 콜
                mergeMonthlyVideo(monthFileName.toString());
            }

        } catch (IOException e) {
            log.error("파일 열기 중 에러 발생: {}", e.toString());
        } catch (SQLException e) {
            log.error("월별 커플 동영상 조회 중 에러 발생: {}", e.toString());
        }
    }

    void mergeMonthlyVideo(String clipListFile) throws IOException
    {
        FFmpeg ffmpeg = new FFmpeg(ffmpegPath + "ffmpeg.exe");
        FFprobe ffprobe = new FFprobe(ffmpegPath + "ffprobe.exe");

        String[] tmp=clipListFile.split(File.separator);
        String outputFile=tmp[tmp.length-1].replaceAll(".txt",".mp4");
        //ffmpeg -f concat -safe 0 -i mylist.txt -c copy output.mp4
        FFmpegBuilder builder = new FFmpegBuilder()
                .overrideOutputFiles(true)
                .addInput(clipListFile)
                .addExtraArgs("-f", "concat")
                .addExtraArgs("-safe", "0")
                .addOutput(monthlyVideoPath + outputFile)
                .done();

        log.debug("FFmpeg command: {}", builder.build());

        FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
        executor.createJob(builder).run();

        //TODO: 병합된 동영상 정보를 monthlyVideo 테이블에 입력
    }

}
