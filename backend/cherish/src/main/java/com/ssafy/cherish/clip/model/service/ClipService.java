package com.ssafy.cherish.clip.model.service;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.Map;

public interface ClipService {
    // 입력 : 저장할 clip1, clip2, Map(user1,user2,meeting_id,keyword)
    // 출력 : 저장된 행의 수 (1이 정상)
    int saveClip(MultipartFile clip1, MultipartFile clip2, Map<String, Object> map) throws Exception;
}
