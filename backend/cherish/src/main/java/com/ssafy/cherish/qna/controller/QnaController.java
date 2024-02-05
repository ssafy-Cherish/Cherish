package com.ssafy.cherish.qna.controller;

import com.ssafy.cherish.qna.model.dto.QuestionDto;
import com.ssafy.cherish.qna.model.service.QnaService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.rmi.MarshalledObject;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/qna")
@Slf4j
public class QnaController {
    @Autowired
    private QnaService qnaService;

    @GetMapping("/getQuestion")
    @Operation(summary = "오늘의 질문 불러오기", description = "현재 coupledto에 저장되어 있는 질문 번호와 맞는 질문을 불러온다.")
    public ResponseEntity<?> getQuestion (@RequestParam int coupleId) {
        log.debug("getQuestion 호출 : {}", coupleId);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {
            int id = qnaService.getQuestionCnt(coupleId);
            QuestionDto questionDto = qnaService.getQuestion(id);

            resultMap.put("qustionDto", questionDto);
            status = HttpStatus.OK;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        } catch (Exception e) {
            log.error("getQuestion 에러 : {}", e.getMessage());
            resultMap.put("getQuestion 에러", e.getMessage());
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }
    }



}
