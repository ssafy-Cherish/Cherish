package com.ssafy.cherish.clip.controller;

import com.ssafy.cherish.clip.model.dto.VideoDto;
import com.ssafy.cherish.clip.model.service.VideoService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/video")
@Slf4j
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping("/getVideo")
    @Operation(summary = "월별 비디오 리스트", description = "coupleId와 keyword를 받아 월별 비디로 리스트를 반환")
    public ResponseEntity<?> getVideoList(@RequestParam("coupleId") int coupleId, @RequestParam("yearMonth") String yearMonth) {
        log.debug("getAnswerList 호출 : {}, {}", coupleId, yearMonth);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("coupleId", coupleId);
            map.put("yearMonth", yearMonth);
            List<VideoDto> list = videoService.getVideoList(map);

            resultMap.put("VideoDtoList", list);
            status = HttpStatus.OK;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        } catch (Exception e) {
            log.error("getVideoList 에러 : {}", e.getMessage());
            resultMap.put("getVideoList 에러", e.getMessage());
            status = HttpStatus.BAD_REQUEST;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }

    }


}
