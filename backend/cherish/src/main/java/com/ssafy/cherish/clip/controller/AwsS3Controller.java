package com.ssafy.cherish.clip.controller;

import com.ssafy.cherish.clip.model.service.AwsS3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/aws")
@Slf4j
public class AwsS3Controller {
    @Autowired
    private AwsS3Service AwsS3Service;

    // S3 데이터 저장 테스트용
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "S3 저장", description = "S3에 데이터를 저장")
    public ResponseEntity<String> saveData(@RequestPart("data") MultipartFile data) {
        log.debug("저장할 데이터 : {}", data.toString());
        try {
            String res = AwsS3Service.uploadFile(data);
            return new ResponseEntity(res, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // S3 데이터 다운로드 테스트용
    @PostMapping(path = "/download")
    @Operation(summary = "S3 다운", description = "S3에서 데이터를 다운")
    public ResponseEntity<String> downloadData(
            @Parameter(name = "파일 다운로드에 필요한 정보 map", description = "fileName")
            @RequestParam Map<String, String> map) {
        log.debug("다운로드할 데이터 : {}", map.toString());
        try {
            String res = AwsS3Service.downloadFile(map.get("fileName"));
            return new ResponseEntity(res, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}