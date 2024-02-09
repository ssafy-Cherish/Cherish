package com.ssafy.cherish.clip.model.mapper;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.dto.ClipVo;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;

@Mapper
public interface ClipMapper {
    // meetingId와 keyword로 빈 클립 객체 생성하고 ai된 id된 포함한 채 반환
    void createClip(ClipDto clipDto) throws SQLException;

    // id로 찾은 행의 filepath들 update(저장)
    int updateClipPath(ClipDto clipDto) throws SQLException;

    // 입력받은 연월("2024-01-01")에 커플당,키워드당 조회했을때 5개 이상인 클립 리스트를 반환
    List<ClipVo> gatherClipsForMonth(String yearMonth) throws SQLException;

    // 입력받은 coupleId를 통해 해당 커플이 가지고 있는 clip의 총 개수를 반환
    int clipCnt (int coupleId) throws SQLException;


}
