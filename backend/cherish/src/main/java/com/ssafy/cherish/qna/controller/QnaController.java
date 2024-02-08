package com.ssafy.cherish.qna.controller;

import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import com.ssafy.cherish.qna.model.service.QnaService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.rmi.MarshalledObject;
import java.util.HashMap;
import java.util.List;
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

            QuestionDto questionDto = qnaService.getQuestion(coupleId);

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "오늘의 질문 답변 등록하기", description = "오늘의 질문에 대한 대답 영상을 db에 저장한다.")
    public ResponseEntity<?> saveAnswer(@RequestPart("answer") MultipartFile answer, @RequestParam Map<String, Object> map) {
        log.debug("saveAnswer 호출 : {}", map.toString());
        HttpStatus status;

        try {
            int result = qnaService.saveAnswer(answer, map);

            if (result == 1) {
                status = HttpStatus.CREATED;
                return new ResponseEntity<>(status);
            } else {
                status = HttpStatus.OK;
                return new ResponseEntity<>(status);
            }

        } catch (Exception e) {
            log.error("saveAnswer 에러 : {}", e.getMessage());
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<>(status);
        }

    }

    @GetMapping("/getAnswer")
    @Operation(summary = "오늘의 질문의 답변 가져옴", description = "커플아이디와 질문번호에 맞는 answerDto를 가져온다.")
    public ResponseEntity<?> getAnswer (@RequestParam("questionId") int questionId, @RequestParam("coupleId") int coupleId) {
        log.debug("getAnswer 호출 : {}, {}", questionId, coupleId);
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {
            map.put("questionId", questionId);
            map.put("coupleId", coupleId);

            AnswerDto answerDto = qnaService.getAnswer(map);
            resultMap.put("answerDto", answerDto);
            status = HttpStatus.OK;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        } catch (Exception e) {
            log.error("getAnswer 에러 : {}", e.getMessage());
            resultMap.put("getAnswer 에러", e.getMessage());

            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }

    }

    @GetMapping("/getAnswerList")
    @Operation(summary = "오늘의 질문 답변 list 가져옴", description = "couple_id를 받아 해당 커플이 답변한 answerDto을 list로 가져온다")
    public ResponseEntity<?> getAnswerList (@RequestParam("coupleId") int coupleId) {
        log.debug("getAnswerList 호출 : {}");
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {
            List<AnswerDto> list = qnaService.getAnswerList(coupleId);
            resultMap.put("answerDto List", list);
            status = HttpStatus.OK;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        } catch (Exception e) {
            log.error("getAnswerList 에러 : {}", e.getMessage());
            resultMap.put("getAnswerList 에러", e.getMessage());
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }
    }

}
