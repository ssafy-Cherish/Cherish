package com.ssafy.cherish.clip.model.mapper;

import com.ssafy.cherish.clip.model.dto.VideoDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Mapper
public interface VideoMapper {
    // 체리보관함(먼슬리비디오) 파일 정보 저장
    void saveVideo(Map<String,Object> map) throws SQLException;

    // 체리보관함의 월별 키워드 동영상 리스트로 반환
    List<VideoDto> getVideoList (Map<String, Object> map) throws SQLException;

}
