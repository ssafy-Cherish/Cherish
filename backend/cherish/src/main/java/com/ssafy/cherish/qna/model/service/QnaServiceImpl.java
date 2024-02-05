package com.ssafy.cherish.qna.model.service;

import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import com.ssafy.cherish.qna.model.mapper.QnaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class QnaServiceImpl implements QnaService {

    @Autowired
    private QnaMapper qnaMapper;

    @Override
    public int getQuestionCnt(int coupleId) throws SQLException {
        return qnaMapper.getQuestionCnt(coupleId);
    }

    @Override
    public QuestionDto getQuestion(int questionId) throws SQLException {
        return qnaMapper.getQuestion(questionId);
    }

    @Override
    public void saveAnswer(AnswerDto answerDto) throws SQLException {
        qnaMapper.saveAnswer(answerDto);
    }

    @Override
    public int chkAnswer(Map<String, Object> map) throws SQLException {
        return qnaMapper.chkAnswer(map);
    }

    @Override
    public AnswerDto getAnswer(Map<String, Object> map) throws SQLException {
        return qnaMapper.getAnswer(map);
    }

    @Override
    public List<AnswerDto> getAnswerList(int coupleId) throws SQLException {
        return qnaMapper.getAnswerList(coupleId);
    }
}
