package com.ssafy.cherish.clip.controller;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.clip.model.service.ClipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/clip")
@Slf4j
public class ClipController {
    @Autowired
    private ClipService clipService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "클립 저장", description = "키워드가 포함된 두 명의 동영상 저장하기위해 파일 두개 입력받음")
    public ResponseEntity saveClip(
            @RequestPart("clip1") MultipartFile clip1,
            @RequestPart("clip2") MultipartFile clip2,
            @Parameter(name = "클립 파일 저장에 필요한 정보 map", description = "meeting_id,keyword")
            @RequestParam Map<String, Object> map
    ) {
        log.debug("클립 입력 : {}", map.toString());
        try {
            int res = clipService.saveClip(clip1, clip2, map);
            if (res == 1) {
                return new ResponseEntity(HttpStatus.CREATED);
            } else {
                return new ResponseEntity(HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity("동영상 처리 중 문제 발생 : "+e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}