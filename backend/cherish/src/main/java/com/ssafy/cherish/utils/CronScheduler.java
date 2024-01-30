package com.ssafy.cherish.utils;

import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;

@EnableScheduling
@Component
@Slf4j
public class CronScheduler {
    //cron = 초,분,시,일,월,요일

    //매월 1일로 바뀔때 실행됨
    //@Scheduled(cron = "0 0 0 1 * *")
    //아래(테스트용)는 10분마다 실행됨
    @Scheduled(cron = "0/10 * * * * *")
    public void mergeMonthlyVideo()
    {
        System.out.println("테스트");
        try {
            //TODO: AWS 환경에 맞게 변경해야함
            //window 기준, 로컬에 설치해야함
            //String ffmpegPath="C:\\Program Files\\ffmpeg-6.1.1-essentials_build\\bin";
            //mac 기준
            String ffmpegPath=System.getProperty("user.home")+"/ffmpeg/6.1.1_3/bin";

            FFmpeg ffmpeg = new FFmpeg(ffmpegPath);
            FFprobe ffprobe = new FFprobe(ffmpegPath);

            String filepath=System.getProperty("user.home")+"/Documents/cherish_video/1/1/";

            //ffmpeg -f concat -safe 0 -i `text file input path` `out path`
            //ffmpeg -f concat -safe 0 -i mylist.txt -c copy output.wav
            FFmpegBuilder builder=new FFmpegBuilder()
                    .overrideOutputFiles(true)
                    .addInput(filepath+"1.mp4")
                    .addInput(filepath+"2.mp4")
                    .addExtraArgs("-f","concat")
                    .addExtraArgs("-safe","0")
                    .addOutput(filepath+"output.mp4")
                    .done();

            FFmpegExecutor executor = new FFmpegExecutor(ffmpeg,ffprobe);
            executor.createTwoPassJob(builder).run();

        }catch (IOException e)
        {
            log.error(e.toString());
        }
    }

}
