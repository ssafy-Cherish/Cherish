package com.ssafy.cherish.meeting.controller;

import com.ssafy.cherish.meeting.model.dto.ChatDto;
import com.ssafy.cherish.meeting.model.service.ChatService;
import com.ssafy.cherish.meeting.model.service.MeetingService;
import com.ssafy.cherish.memo.model.dto.MemoDto;
import com.ssafy.cherish.memo.model.service.MemoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/meeting/chat")
@Slf4j
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping
    @Operation(summary = "채팅 저장", description = "미팅 중 채팅을 저장한다.")
    public ResponseEntity<?> saveChat (@RequestBody ChatDto chatDto) {
        log.debug("saveChat 호출 : {}", chatDto);

        try {
            chatService.saveChat(chatDto);
            return new ResponseEntity<Void>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<String>("Error : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @Operation(summary = "채팅 조회", description = "특정 미팅의 채팅 기록을 가져옵니다.")
    public ResponseEntity<List<ChatDto>> getChat (
            @RequestParam
            @Parameter(name = "meetingId", description = "채팅 기록을 가져올 미팅 아이디") int meetingId) {
        log.debug("getChat 호출 : {}", meetingId);
        try {
            List<ChatDto> list = chatService.getChat(meetingId);
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
}
