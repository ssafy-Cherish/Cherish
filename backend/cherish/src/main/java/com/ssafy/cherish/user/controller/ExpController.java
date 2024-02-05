package com.ssafy.cherish.user.controller;

import com.ssafy.cherish.user.model.service.ExpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    @GetMapping
    @Operation(summary = "커플 최근 한달 경험치",description = "커플 아이디를 입력하면 날짜별 최신순 경험치 기록 리스트 맵을 반환")
    public ResponseEntity<?> getExp(
            @RequestParam("coupleId")
            @Parameter(name = "커플아이디")
            int coupleId
    )
    {
        log.debug("커플 경험치 불러오기 coupleId : {}",coupleId);
        try {
            Map<String, ArrayList> map=expService.getExpHistory(coupleId);
            return new ResponseEntity<>(map,HttpStatus.OK);
        }
        catch (Exception e)
        {
            log.error("경험치 불러오기 중 error 발생 : {}",e.getMessage());
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
}
