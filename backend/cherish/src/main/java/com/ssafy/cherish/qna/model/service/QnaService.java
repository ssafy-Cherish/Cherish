package com.ssafy.cherish.qna.model.service;

import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface QnaService {

    int getQuestionCnt (int coupleId) throws SQLException;
    QuestionDto getQuestion (int questionId) throws SQLException;
    void saveAnswer (AnswerDto answerDto) throws SQLException;
    int chkAnswer (Map<String, Object> map) throws SQLException;
    AnswerDto getAnswer (Map<String, Object> map) throws SQLException;
    List<AnswerDto> getAnswerList (int coupleId) throws SQLException;

}
