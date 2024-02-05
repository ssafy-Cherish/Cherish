package com.ssafy.cherish.qna.model.mapper;

import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Mapper
public interface QnaMapper {

    // couple 테이블에 있는 question_cnt 가져오기
    int getQuestionCnt (int coupleId) throws SQLException;
    // 가져온 question_cnt로 question 테이블 가져오기
    QuestionDto getQuestion (int questionId) throws SQLException;
    // 사용자가 찍은 영상의 filepath값을 answer 테이블 생성 후 넣기
    void saveAnswer (AnswerDto answerDto) throws SQLException;
    // 커플 두 명이 모두 answer를 찍었는지 확인
    int chkAnswer (Map<String, Object> map) throws SQLException;
    // 특정 answer 영상 보기
    AnswerDto getAnswer (Map<String, Object> map) throws SQLException;
    // 영상을 찍은 질문 리스트 보여주기
    List<AnswerDto> getAnswerList (int coupleId) throws SQLException;

}
