package com.ssafy.cherish.clip.model.service;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.mapper.ClipMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.Map;

@Service
@Slf4j
public class ClipServiceImpl implements ClipService {
    @Autowired
    private ClipMapper clipMapper;

    @Override
    //파일 입출력이 잘못되었을 경우에도 전체 롤백이 됨
    @Transactional(rollbackFor = Exception.class)
    public int saveClip(MultipartFile clip1, MultipartFile clip2, Map<String, Object> map) throws Exception {
        ClipDto clipDto = new ClipDto();

        clipDto.setMeetingId(Integer.parseInt((String) map.get("meeting_id")));
        clipDto.setKeyword((String) map.get("keyword"));
        clipMapper.createClip(clipDto);

        log.debug("saveClip 중 생성된 filepath 빈 객체 : {}", clipDto.toString());
        try {
            // 서버 로컬 경로
            //window 기준
            //String local = System.getProperty("user.home")+"/Documents/cherish_video
            //mac 기준
            String local = System.getProperty("user.home") + "/Documents/cherish_video";

            // 클립 저장 경로 설정
            String uploadDir = local + "/" + clipDto.getMeetingId() + "/" + clipDto.getId() + "/";
            Path uploadPath = Paths.get(uploadDir);

            // 디렉토리가 없으면 생성
            if (!Files.exists(uploadPath)) {
                //여기서 IOException 발생 가능성 있음
                Files.createDirectories(uploadPath); // 디렉토리 생성
            }

            //TODO: file의 파일형식, (파일명==user_id)인지 확인 필요

            // 파일별 경로 설정
            Path filePath1 = uploadPath.resolve(clip1.getOriginalFilename());
            Path filePath2 = uploadPath.resolve(clip2.getOriginalFilename());

            // 동영상 파일 저장
            Files.write(filePath1, clip1.getBytes()); // 파일을 저장
            Files.write(filePath2, clip2.getBytes()); // 파일을 저장

            //변경된 filepath clipDto 객체에 넣기
            clipDto.setFilepath1(filePath1.toString());
            clipDto.setFilepath2(filePath2.toString());

        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("파일 저장 실패 : 파일 경로에 권한이 없거나 파일명이 잘못되었습니다.");
        }
        log.debug("saveClip 중 생성된 filepath 채워진 객체 : {}", clipDto.toString());
        return clipMapper.updateClipPath(clipDto);
    }
}

