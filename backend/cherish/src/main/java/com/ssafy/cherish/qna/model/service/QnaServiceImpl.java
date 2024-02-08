package com.ssafy.cherish.qna.model.service;

import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import com.ssafy.cherish.qna.model.mapper.QnaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class QnaServiceImpl implements QnaService {

    @Autowired
    private QnaMapper qnaMapper;
    @Value("${custom.path.answer}")
    private String answerPath;

    @Override
    public int getQuestionCnt(int coupleId) throws Exception {
        return qnaMapper.getQuestionCnt(coupleId);
    }

    @Override
    public QuestionDto getQuestion(int questionId) throws Exception {
        return qnaMapper.getQuestion(questionId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int saveAnswer(MultipartFile answer, Map<String, Object> map) throws Exception {
        AnswerDto answerDto = new AnswerDto();

        answerDto.setCoupleId(Integer.parseInt((String)map.get("coupleId")));
        answerDto.setNickname((String)map.get("nickname"));
        answerDto.setQuestionId(Integer.parseInt((String)map.get("questionId")));
        answerDto.setKakaoId(Long.parseLong((String)map.get("kakaoId")));

        qnaMapper.createAnswer(answerDto);

        String answerPath = setAnswerDir(answerDto);

        answerDto.setFilepath(answerPath);

        return qnaMapper.updateAnswerPath(answerDto);
    }

    @Override
    public boolean chkAnswer(Map<String, Object> map) throws Exception {
        int cnt = qnaMapper.chkAnswer(map);

        if (cnt == 2) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public AnswerDto getAnswer(Map<String, Object> map) throws Exception {
        return qnaMapper.getAnswer(map);
    }

    @Override
    public List<Map<String, Object>> getAnswerList(int coupleId) throws Exception {
        return qnaMapper.getAnswerList(coupleId);
    }

    String setAnswerDir (AnswerDto answerDto) throws Exception {
        String uploadDir = answerPath + answerDto.getId() + File.separator;
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String resPath = uploadDir + answerDto.getId() + "_" + answerDto.getQuestionId() + "_" + ".mp4";

        return resPath;
    }
}

