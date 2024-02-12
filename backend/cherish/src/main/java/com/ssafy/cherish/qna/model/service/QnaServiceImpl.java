package com.ssafy.cherish.qna.model.service;

import com.ssafy.cherish.clip.model.service.AwsS3Service;
import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import com.ssafy.cherish.qna.model.mapper.QnaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class QnaServiceImpl implements QnaService {


    @Autowired
    AwsS3Service awsS3Service;
    @Autowired
    private QnaMapper qnaMapper;
    @Value("${custom.path.answer}")
    private String answerPath;

//    @Override
//    public int getQuestionCnt(int coupleId) throws Exception {
//        return qnaMapper.getQuestionCnt(coupleId);
//    }

    @Override
    public QuestionDto getQuestion(int coupleId) throws Exception {
        int questionId = qnaMapper.getQuestionCnt(coupleId);
        return qnaMapper.getQuestion(questionId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int saveAnswer(MultipartFile answer, AnswerDto answerDto) throws Exception {


        qnaMapper.createAnswer(answerDto);

        String filePath = awsS3Service.uploadFile(answer, answerDto.getId() + "_answer.webm");
        answerDto.setFilepath(filePath);

        return qnaMapper.updateAnswerPath(answerDto);
    }

    @Override
    public List<Map<String, Object>> getAnswer(int coupleId) throws Exception {
        return qnaMapper.getAnswer(coupleId);
    }

    @Override
    public List<Map<String, Object>> getAnswerList(int coupleId) throws Exception {
        return qnaMapper.getAnswerList(coupleId);
    }

    @Override
    public int getQnaCnt(int coupleId) throws Exception {
        return qnaMapper.getQnaCount(coupleId);
    }



//    S3 도입으로 필요없어짐
//    String setAnswerDir(AnswerDto answerDto) throws Exception {
//        String uploadDir = answerPath + answerDto.getId() + File.separator;
//        Path uploadPath = Paths.get(uploadDir);
//
//        if (!Files.exists(uploadPath)) {
//            Files.createDirectories(uploadPath);
//        }
//
//        String resPath = uploadDir + answerDto.getId() + "_" + answerDto.getQuestionId() + "_" + ".mp4";
//
//        return resPath;
//    }
}

