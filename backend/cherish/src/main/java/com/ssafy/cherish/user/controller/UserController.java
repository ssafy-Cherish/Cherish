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
//    ;';';';';';';';';'ㅣ;ㅣ;ㅣ;ㅣ;ㅣ;ㅣ;ㅣ[ㅔ[ㅔ[ㅔ[ㅔ[ㅔ;ㅣ;ㅣ;ㅣ;
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

}

