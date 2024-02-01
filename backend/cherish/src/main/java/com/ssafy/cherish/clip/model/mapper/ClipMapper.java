package com.ssafy.cherish.clip.model.mapper;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.dto.ClipVo;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;

@Mapper
public interface ClipMapper {
    //meetingId와 keyword로 빈 클립 객체 생성하고 ai된 id된 포함한 채 반환
    void createClip(ClipDto clipDto) throws SQLException;

    //id로 찾은 행의 filepath들 update(저장)
    int updateClipPath(ClipDto clipDto) throws SQLException;

    List<ClipVo> gatherLastMonthClips() throws SQLException;

}
