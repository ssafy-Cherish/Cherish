package com.ssafy.cherish.utils;

import com.ssafy.cherish.user.model.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.SQLException;

@EnableScheduling
@Component
@Slf4j
public class CoupleScheduler {

    @Autowired
    private UserMapper userMapper;

//         @Scheduled(cron = "0/10 * * * * *") // 10초마다 실행 (테스트용)
//    @Scheduled(cron="0 0 0 * * *")//매일 0시 0분 실행
    @Scheduled(cron="0 0 0/1 * * *")//매일 1시간마다 정각에 실행
    public void updateQuestionCnt()
    {
        log.debug("커플 Question Cnt Update");
        try {
            userMapper.updateQuestionCnt();
        }
        catch (SQLException e)
        {
            log.error("커플 Question Cnt Update 중 에러 발생 : {}", e.getMessage());
            e.printStackTrace();
        }
    }
}
