package com.ssafy.cherish.clip.model.service;

import com.ssafy.cherish.clip.model.dto.VideoDto;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface VideoService {

    List<VideoDto> getVideoList (Map<String, Object> map) throws Exception;

    List<String> getYearMonth (int coupleId) throws Exception;

}
