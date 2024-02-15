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
    List<Map<String, Object>> getAnswer (int coupleId) throws Exception;
    List<Map<String, Object>> getAnswerList (int coupleId) throws Exception;
    int getQnaCnt (int coupleId) throws Exception;

    List<List<Map<String, Object>>> answerList(int coupleId) throws Exception;
    List<Map<String, Object>> getQ (int questionId) throws Exception;

//    List<Map<String, Object>> getAns (Map<String, Object> map) throws Exception;
}
