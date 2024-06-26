package com.ssafy.cherish.memo.controller;

import com.ssafy.cherish.memo.model.dto.MemoDto;
import com.ssafy.cherish.memo.model.service.MemoService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.Jar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/memo")
@Slf4j
public class MemoController {

    @Autowired
    private MemoService memoService;

    @PostMapping
    @Operation(summary = "메모 작성", description = "캘린더에서 날짜에 맞는 메모를 작성한다.")
    public ResponseEntity<?> writeMemo (@RequestBody MemoDto memoDto) {
        log.debug("writeMemo 호출 : {}", memoDto);

        try {

            MemoDto memo = memoService.getMemo(memoDto.getDate(), memoDto.getCoupleId());

            if(memoDto.getContent().trim().isEmpty()) {
                if(memo != null)
                    memoService.deleteMemo(memoDto);
                return new ResponseEntity<Void>(HttpStatus.CREATED);
            }

            if(memo == null) {
                memoService.writeMemo(memoDto);
            } else {
                memoService.modifyMemo(memoDto);
            }

            return new ResponseEntity<Void>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<String>("Error : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{coupleId}/{date}")
    @Operation(summary = "메모 조회", description = "날짜와 커플 아이디에 맞는 메모를 조회한다.")
    public ResponseEntity<?> getMemo (@PathVariable("date") String date, @PathVariable("coupleId") int coupleId) {
        log.debug("getMemo 호출 : {}, {}", coupleId, date);
        Map<String, Object> map = new HashMap<>();

        try {
            MemoDto memoDto = memoService.getMemo(date, coupleId);
            map.put("memo", memoDto);

            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

//    @PutMapping
//    @Operation(summary = "메모 수정", description = "캘린더에서 수정하고 싶은 메모의 내용을 수정한다.")
//    public ResponseEntity<?> modifyMemo (@RequestBody MemoDto memoDto) {
//        log.debug("modifyMemo 호출 : {}", memoDto);
//
//        try {
//            memoService.modifyMemo(memoDto);
//            return new ResponseEntity<>(HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<String>("Error : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

//    @DeleteMapping
//    @Operation(summary = "메모 삭제", description = "날짜와 커플 아이디에 맞는 메모를 삭제한다.")
//    public ResponseEntity<?> deleteMemo (@RequestBody MemoDto memoDto) {
//        log.debug("deleteMemo 호출 : {}", memoDto);
//
//        try {
//            memoService.deleteMemo(memoDto);
//            return ResponseEntity.ok().build();
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }
//
//    }

}
