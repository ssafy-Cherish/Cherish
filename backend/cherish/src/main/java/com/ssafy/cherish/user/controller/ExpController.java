package com.ssafy.cherish.user.controller;

import com.ssafy.cherish.user.model.service.ExpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("exp")
@Slf4j
public class ExpController {
    @Autowired
    private ExpService expService;

    @PostMapping
    @Operation(summary = "경험치 입력", description = "경험치 내역 추가")
    public ResponseEntity addExp(
            @RequestBody
            @Parameter(name = "커플아이디, 커플의 경험치 내역 리스트", description = "json으로 던진 커플아이디,커플 경험치 내역")
            Map<String, Object> map)
    {
        log.debug("커플 경험치 입력 : {}",map.toString());
        try {
            expService.createExpHistory(map);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            log.error("경험치 입력 중 error 발생 : {}",e.getMessage());
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
}
