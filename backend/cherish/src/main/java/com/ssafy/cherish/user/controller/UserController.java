package com.ssafy.cherish.user.controller;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import com.ssafy.cherish.user.model.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    public UserController (UserService userService) {
        this.userService = userService;
    }


    // 얘는 redirect를 통해서 로그인, 회원가입, 대기화면을 구분해서 보내주는 역할을 맡을 친구입니다.
    public ResponseEntity<?> userLogin () throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.CREATED;

        // kakao id를 가져오는 거 작성해야함
        int kakaoId = 1;

        // kakao id를 조회해 db가 있는지 확인
        UserDto userDto = userInfo(kakaoId);


        if (userDto == null) { // db가 없다면, 즉 아직 회원이 아니라면 회원가입
            return "/join";
        } else { // db가 있다면, 즉 회원가입이 되어 있다면 로그인
            return "login";
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    public UserDto userInfo (int kakaoId) throws Exception {
        UserDto userDto = userService.userInfo(kakaoId);

        return userDto;
    }

    @PostMapping("/join")
    public ResponseEntity<?> join (@RequestBody UserDto userDto, CoupleDto coupleDto) {
        log.debug("firstJoin : {}", userDto);
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.CREATED;

        // 여기서 code값을 받았는지 안 받았는지를 통해 firstJoin과 secondJoin을 나누어야 함
        // 어떻게 할지 고민해서 오늘 안에 해놔라;;;;;
        boolean codeChk = true;


        try {
            userService.join(userDto);
            int num = userDto.getId();

            if (codeChk) {
                userService.coupleFirstJoin(coupleDto);
            } else {
                userService.coupleSecondJoin(coupleDto);
            }

        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }


    // join 완성하면 없앨 친구 1
    @PostMapping("/firstJoin")
    public ResponseEntity<?> firstJoin (@RequestBody UserDto userDto, CoupleDto coupleDto) {
        log.debug("firstJoin : {}", userDto);
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.CREATED;

        try {
            userService.firstJoin(userDto);

            coupleDto.setUser1(userDto.getId());

//            userService.coupleFirstJoin(coupleDto);
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    // join 완성하면 없앨 친구 2
    @PostMapping("/secondJoin")
    public ResponseEntity<?> secondJoin (@RequestBody UserDto userDto, CoupleDto coupleDto) {
        log.debug("secondJoin : {}", userDto);
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.CREATED;

        try {
            userService.secondJoin(userDto);
            coupleDto.setUser2(userDto.getId());

//            userService.coupleSecondJoin(coupleDto);
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

}

