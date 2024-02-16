package com.ssafy.cherish.qna.model.service;

import com.ssafy.cherish.clip.model.service.AwsS3Service;
import com.ssafy.cherish.qna.model.dto.AnswerDto;
import com.ssafy.cherish.qna.model.dto.QuestionDto;
import com.ssafy.cherish.qna.model.mapper.QnaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
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

        String filePath = awsS3Service.uploadFile(answer);
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

    @Override
    public List<List<Map<String, Object>>> answerList(int coupleId) throws Exception {
        List<List<Map<String, Object>>> ansList = new ArrayList<>();
        int cnt = qnaMapper.getQuestionCnt(coupleId);

        int count = getQnaCnt(coupleId);

        if (count == 0) {
            int id = qnaMapper.getQuestionCnt(coupleId);

            if (cnt > 1) {
                ansList.add(qnaMapper.getQ(id));
                for (int i = cnt-1; i >= 1; i--) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("coupleId", coupleId);
                    map.put("questionId", i);

                    ansList.add(qnaMapper.getAns(map));
                }
            } else {
                ansList.add(qnaMapper.getQ(id));
            }

        } else {
            for (int i = cnt; i >= 1; i--) {
                Map<String, Object> map = new HashMap<>();
                map.put("coupleId", coupleId);
                map.put("questionId", i);

                ansList.add(qnaMapper.getAns(map));
            }
        }

        return ansList;
    }

    @Override
    public List<Map<String, Object>> getQ(int questionId) throws Exception {
        return qnaMapper.getQ(questionId);
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

