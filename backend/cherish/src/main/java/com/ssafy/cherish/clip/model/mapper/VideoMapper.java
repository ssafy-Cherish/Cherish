package com.ssafy.cherish.clip.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.Map;

@Mapper
public interface VideoMapper {
    // 체리보관함(먼슬리비디오) 파일 정보 저장
    void saveVideo(Map<String,Object> map) throws SQLException;
}
