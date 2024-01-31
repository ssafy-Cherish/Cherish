package com.ssafy.cherish.utils;

import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import net.bramp.ffmpeg.probe.FFmpegFormat;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
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
    //아래는 테스트용 (주석 빼면 10초에 한번씩 실행됨)
//    @Scheduled(cron = "0/10 * * * * *")
    public void mergeMonthlyVideo()
    {
        System.out.println("테스트");
        try {
            //TODO: AWS 환경에 맞게 변경해야함
            //window 기준, 로컬에 설치해야함
            String ffmpegPath="C:\\Program Files\\ffmpeg-6.1.1-essentials_build\\bin\\ffmpeg.exe";
            String ffprobePath="C:\\Program Files\\ffmpeg-6.1.1-essentials_build\\bin\\ffprobe.exe";
            //mac 기준
            //String ffmpegPath=System.getProperty("user.home")+"/ffmpeg/6.1.1_3/bin";

            FFmpeg ffmpeg = new FFmpeg(ffmpegPath);
            FFprobe ffprobe = new FFprobe(ffprobePath);

            FFmpegProbeResult videoProbe1=ffprobe.probe("C:/Users/SSAFY/Documents/cherish_video/1/1/1.mp4");


//            filepath 경로에 있는 list.txt에
//            / file 'C:\Users\SSAFY\Documents\cherish_video\1\1\1.mp4' /
//            형식의 텍스트 저장 필요

            String filepath="C:/Users/SSAFY/Documents/cherish_video/1/1/";
            //ffmpeg -f concat -safe 0 -i mylist.txt -c copy output.mp4
            FFmpegBuilder builder=new FFmpegBuilder()
                    .overrideOutputFiles(true)
                    .addInput("C:/Users/SSAFY/list.txt")
                    .addExtraArgs("-f","concat")
                    .addExtraArgs("-safe","0")
                    .addOutput(filepath+"output.mp4")
                    .done();

            log.debug("FFmpeg command: {}", builder.build());

            FFmpegExecutor executor = new FFmpegExecutor(ffmpeg,ffprobe);
            executor.createJob(builder).run();

        }catch (IOException e)
        {
            log.error(e.toString());
        }
    }

}
