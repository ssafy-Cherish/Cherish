package com.ssafy.cherish.qna.controller;

import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import com.ssafy.cherish.qna.model.service.QnaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
    public ResponseEntity<?> getQuestion (@RequestParam @Parameter() int coupleId) {
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
    public ResponseEntity<?> saveAnswer(@RequestPart("answer") @Parameter(description = "답변 동영상 파일") MultipartFile answer,
                                        @RequestPart("answerDto") @Parameter(name="답변 정보", description = "kakaoId,nickname,coupleId,questionId") AnswerDto answerDto) {
        log.debug("saveAnswer 호출 : {}", answerDto.toString());
        HttpStatus status;

        try {
            int result = qnaService.saveAnswer(answer, answerDto);

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

            return new ResponseEntity<>(e.getMessage(),status);
        }

    }

    @GetMapping("/getAnswerList")
    @Operation(summary = "오늘의 질문 답변 list 가져옴", description = "couple_id를 받아 해당 커플이 답변한 answerDto을 list로 가져온다")
    public ResponseEntity<?> getAnswerList (@RequestParam("coupleId") int coupleId) {
        log.debug("getAnswerList 호출 : {}", coupleId);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {

            int cnt = qnaService.getQnaCnt(coupleId);

            if (cnt == 2) {
                resultMap.put("answerCnt", 2);
            } else if (cnt == 1) {
                resultMap.put("answerCnt", 1);
            } else {
                resultMap.put("answerCnt", 0);
            }

            List<Map<String, Object>> list = qnaService.getAnswerList(coupleId);
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

    @GetMapping("/getAnswer")
    @Operation(summary = "최신 오늘의 질문에 대한 answer 반환", description = "coupleId를 입력받아 현재 대답 상태와 answer를 반환")
    public ResponseEntity<?> getAnswer (int coupleId) {
        log.debug("getAnswer 호출 : {}", coupleId);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {
            int cnt = qnaService.getQnaCnt(coupleId);

            if (cnt == 2) {
                resultMap.put("answer", qnaService.getAnswer(coupleId));
                resultMap.put("answerCnt", 2);
            } else if (cnt == 1) {
                resultMap.put("answer", qnaService.getAnswer(coupleId));
                resultMap.put("answerCnt", 1);
            } else {
                resultMap.put("answerCnt", 0);
            }

            status = HttpStatus.OK;
            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        } catch (Exception e) {
            log.error("getAnswer 에러 : {}", e.getMessage());
            resultMap.put("getAnswer 에러", e.getMessage());
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }
    }

    @GetMapping("/getAns")
    @Operation(summary = "answerlist 호출", description = "coupleid를 입력하면 해당 커플이 가지고 있는 answerList를 반환하고 제일 최근 질문에 대해 몇 명이 답했는지를 같이 반환함")
    public ResponseEntity<?> getAns (@RequestParam("coupleId") int coupleId) {
        log.debug("test 호출 : {}", coupleId);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {
            resultMap.put("answercnt", qnaService.getQnaCnt(coupleId));
            resultMap.put("answerList", qnaService.answerList(coupleId));
            status = HttpStatus.OK;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        } catch (Exception e) {
            log.error("test 에러 : {}", e.getMessage());
            resultMap.put("test 에러", e.getMessage());
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }
    }

}
