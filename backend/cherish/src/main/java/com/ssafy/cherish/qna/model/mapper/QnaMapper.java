package com.ssafy.cherish.qna.model.mapper;

import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Mapper
public interface QnaMapper {

    int getQuestionCnt (int coupleId) throws SQLException;

    QuestionDto getQuestion (int questionId) throws SQLException;

    void saveAnswer (AnswerDto answerDto) throws SQLException;

    int chkAnswer (Map<String, Object> map) throws SQLException;

    AnswerDto getAnswer (Map<String, Object> map) throws SQLException;

    List<AnswerDto> getAnswerList (int coupleId) throws SQLException;

}
