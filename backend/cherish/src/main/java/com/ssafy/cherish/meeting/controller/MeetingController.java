package com.ssafy.cherish.meeting.controller;

import com.ssafy.cherish.meeting.model.dto.MeetingDto;
import com.ssafy.cherish.meeting.model.service.MeetingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.mapping.ResultMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/meeting")
@Slf4j
public class MeetingController {
    @Autowired
    private MeetingService meetingService;

    @PostMapping("/{coupleId}")
    @Operation(summary = "미팅 생성", description = "체리콜을 시작하여 미팅 데이터 생성 및 시작 시간 입력")
    public ResponseEntity<Map<String, Object>> createMeeting(
            @PathVariable("coupleId")
            @Parameter(description = "영상통화를 시작한 커플의 아이디")
            int coupleId) {
        Map<String, Object> res = new HashMap<>();
        log.debug("영상통화 시작, coupleId : {}", coupleId);
        try {
            int meetingId = meetingService.createMeeting(coupleId);
            res.put("meeting_id", meetingId);
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (Exception e) {
            log.debug("미팅 생성 중 에러 발생 : {}", e.getMessage());
            res.put("msg", e.getMessage());
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{meetingId}")
    @Operation(summary = "영상 길이 설정", description = "영상통화가 종료되고 현재시각과 통화 시작 시간의 차를 기준으로 영상 길이 업데이트")
    public void setMeetingLength(
            @PathVariable("meetingId")
            @Parameter(description = "영상통화 길이를 설정할 미팅의 아이디")
            int meetingId
    ) {
        log.debug("영상통화 종료, meetingId : {}", meetingId);
        try {
            int changedRows = meetingService.setMeetingLength(meetingId);
            if (changedRows == 0) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "미팅이 존재하지 않습니다");
            }
        } catch (Exception e) {
            log.debug("미팅 시간 업데이트 중 에러 발생 : {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "미팅 길이 설정 중 에러 발생");
        }
    }

    @GetMapping("/month")
    @Operation(summary = "월별 체리콜 기록 조회", description = "연월을 기준으로 커플의 영상통화 기록있는 날짜를 조회")
    public ResponseEntity<List<String>> getMeetingsByMonth(
            @RequestParam
            @Parameter(description = "조회할 연월과 커플 아이디 e.g. 'coupleId': 1,'yearMonth':'2024-01'")
            Map<String, Object> map) {
        log.debug("체리콜 기록 월별 조회, coupleId : {}, yearMonth : {}", map.get("coupleId"), map.get("yearMonth"));
        try {
            List<String> list = meetingService.getMeetingsByMonth(map);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            log.debug("월별 미팅 조회 중 에러 발생 : {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/day")
    @Operation(summary = "일별 체리콜 기록 조회", description = "연월일을 기준으로 커플의 영상통화 기록,메모를 조회")
    public ResponseEntity<Map> getMeetingsByDate2(
            @RequestParam
            @Parameter(description = "커플 아이디와 생성 연월일 e.g. 'coupleId': 1, 'date':'2024-01-23'")
            Map<String, Object> map
    ) {
        log.debug("체리콜 기록 일별 조회, coupleId : {}, date : {}", map.get("coupleId"), map.get("date"));
        try {
            List<MeetingDto> res = meetingService.getMeetingsByDate(map);
            Map<String,Object> resultMap=new HashMap<>();
            resultMap.put("meeting",res);
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        } catch (Exception e) {
            log.debug("일별 미팅 조회 중 에러 발생 : {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
