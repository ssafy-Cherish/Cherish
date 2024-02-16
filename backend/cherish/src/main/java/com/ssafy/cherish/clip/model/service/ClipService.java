package com.ssafy.cherish.clip.model.service;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.dto.ClipVo;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface ClipService {
    // 입력 : 저장할 clip1, clip2, Map(user1,user2,meeting_id,keyword)
    void saveClip(ClipDto clipDto,String[] pathForMerge,int coupleId) throws Exception;

    void createClip(ClipDto clipDto) throws Exception;

    int clipCnt (int coupleId) throws Exception;

    int changePin(int clipId, boolean mode);

    List<ClipVo> getPinnedClip(int coupleId);

    void deleteClip(int id) throws Exception;
}
