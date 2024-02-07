package com.ssafy.cherish.clip.model.service;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.Map;

public interface ClipService {
    // 입력 : 저장할 clip1, clip2, Map(user1,user2,meeting_id,keyword)
    // 출력 : 완성된 클립의 url
    String saveClip(ClipDto clipDto,String[] pathForMerge) throws Exception;

    void createClip(ClipDto clipDto) throws Exception;
}
