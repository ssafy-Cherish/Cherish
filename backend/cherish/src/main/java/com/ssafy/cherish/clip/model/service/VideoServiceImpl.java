package com.ssafy.cherish.clip.model.service;

import com.ssafy.cherish.clip.model.dto.VideoDto;
import com.ssafy.cherish.clip.model.mapper.VideoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VideoServiceImpl implements VideoService {

    @Autowired
    private VideoMapper videoMapper;

    @Override
    public List<VideoDto> getVideoList(Map<String, Object> map) throws Exception {
        return videoMapper.getVideoList(map);
    }

    @Override
    public List<String> getYearMonth(int coupleId) throws Exception {
        return videoMapper.getYearMonth(coupleId);
    }
}
