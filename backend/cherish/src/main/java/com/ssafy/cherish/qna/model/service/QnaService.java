package com.ssafy.cherish.qna.model.service;

import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface QnaService {

//    int getQuestionCnt (int coupleId) throws Exception;
    QuestionDto getQuestion (int questionId) throws Exception;
//    int saveAnswer (MultipartFile answer, Map<String, Object> map) throws Exception;
    int saveAnswer (MultipartFile answer, AnswerDto answerDto) throws Exception;
    boolean chkAnswer (Map<String, Object> map) throws Exception;
    AnswerDto getAnswer (Map<String, Object> map) throws Exception;
    List<Map<String, Object>> getAnswerList (int coupleId) throws Exception;

}
