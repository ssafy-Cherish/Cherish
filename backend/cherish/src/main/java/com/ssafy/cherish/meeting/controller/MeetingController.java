package com.ssafy.cherish.meeting.controller;

import com.ssafy.cherish.meeting.model.service.MeetingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/meeting")
@Slf4j
public class MeetingController {
    @Autowired
    private MeetingService meetingService;
    @PostMapping("/{coupleId}")
    @Operation(summary = "미팅 생성",description="영상통화를 시작하여 미팅 데이터 생성 및 시작 시간 입력")
    public ResponseEntity<Map<String,Object>> createMeeting(
            @PathVariable("coupleId")
            @Parameter(name="couple_id",description = "영상통화를 시작한 커플의 아이디")
            int coupleId)
    {
        Map<String,Object> res=new HashMap<>();
        log.debug("영상통화 시작 : {}",coupleId);
        try{
            int meetingId=meetingService.createMeeting(coupleId);
            res.put("meeting_id",meetingId);
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        }catch (Exception e)
        {
            log.debug("미팅 생성 중 에러 발생 : {}" , e.getMessage());
            res.put("msg",e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
