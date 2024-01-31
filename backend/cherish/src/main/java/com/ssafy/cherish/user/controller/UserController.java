package com.ssafy.cherish.user.controller;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import com.ssafy.cherish.user.model.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    private final KakaoAPI kakaoApi = new KakaoAPI();

    public UserController (UserService userService) {
        this.userService = userService;
    }


     // 얘는 redirect를 통해서 로그인, 회원가입, 대기화면을 구분해서 보내주는 역할을 맡을 친구입니다.
    // 우선 그렇게 생각하고 있는데 프론트랑 같이 해보면서 변경해봐야 할 것 같네요;;;
    // 생각해보면 join을 할 때 kakaoid를 먼저 넣어야 하는데 이게 고민인게 redirect를 하면
    @RequestMapping("/login")
    @Operation(summary = "카카오 로그인", description="카카오 정보를 받아와 db에 있는지 확인하고 없다면 회원가입 있다면 로그인을 할 수 있게 redirect")
    public String userLogin (@RequestParam("code") String code, HttpSession session) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.CREATED;

        log.debug("kakao code : {}", code);
        // 1번 인증코드 요청 전달
        String accessToken = kakaoApi.getAccessToken(code);
        // 2번 인증코드로 토큰 전달
        HashMap<String, Object> userIn = kakaoApi.getUserInfo(accessToken);

        System.out.println("login info : " + userIn.toString());

        long kakaoId = (long)userIn.get("kakaoId");
        log.debug("kakaoId : {}", kakaoId);

        if (findByKakaoId(kakaoId)) {
            // db가 있다면, 즉 회원가입이 되어 있다면 로그인 성공으로 해야하는거 아닌가 그럼 바로 메인으로 보내줘 ? -> 고민해보겠습니다,,,,
            // 우선 login이라고 써 놨는데 메인화면이 나오면 바꿔 주겠읍니다 ..
            return "redirect:/login";
        } else {
            // db가 없다면, 즉 아직 회원이 아니라면 회원가입
            // 먼저 카카오 아이디를 등록한 후에 보내는 것도 방법일지도?? 라는 생각을 하게 되었습니다
            // 하지만 그러면 id값을 보내야 하겠조 ??? 흠 어떻게 하는게 좋을까요
            // 이게 redirect로 보내는게 맞읋까 흠흠흠 고민고밈이가 되네요

            insertKakaoId(kakaoId);

            return "redirect:/join";
        }
    }

    // 카카오 아이디를 조회해서 user table에 있을 경우 true, 없을 경우 false를 반환
    public boolean findByKakaoId (long kakaoId) throws Exception {
        UserDto userDto = userService.findByKakaoId(kakaoId);

        if (userDto == null) {
            return false;
        } else {
            return true;
        }
    }

    @PostMapping("/join")
    @Operation(summary = "회원가입", description="code값에 따라 첫 번째 또는 두 번째 유저로 구분해 회원가입 진행")
    public ResponseEntity<?> join (@RequestBody UserDto userDto, @RequestBody CoupleDto coupleDto) {
        log.debug("join : {}", userDto);
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.CREATED;

        // 여기서 code값을 받았는지 안 받았는지를 통해 firstJoin과 secondJoin을 나누어야 함
        // 프론트에서 code가 있는지 없는지에 따라 codeChk를 true, false로 보내줌 => 그걸로 나눠줘야함
        // 우선 예시로 true로 설정해놓음
        boolean codeChk = true;

        try {
            userService.join(userDto);
            int num = userDto.getId();

            if (codeChk) {
                coupleDto.setUser1(num);
                userService.coupleFirstJoin(coupleDto);
            } else {
                coupleDto.setUser2(num);
                userService.coupleSecondJoin(coupleDto);
            }

        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    // 이것은 카카오 아이디를 user DB에 insert 해주는 코드입니당 !
    public void insertKakaoId (long kakaoId) throws Exception {
        userService.insertKakaoId(kakaoId);
    }

    @GetMapping("/userInfo/{id}")
    @Operation(summary = "유저 정보 조회", description="user 테이블의 id를 가져와 알맞은 유저의 정보를 가져옴")
    public ResponseEntity<?> userInfo (@PathVariable("id") int id) throws Exception {

        log.info("userInfo 호출 : " + id);

        return new ResponseEntity<UserDto>(userService.userInfo(id), HttpStatus.OK);
    }

    @GetMapping("/coupleInfo/{id}")
    @Operation(summary = "커플 정보 조회", description="couple 테이블의 id를 가져와 알맞은 유저의 정보를 가져옴")
    public ResponseEntity<?> coupleInfo (@PathVariable("id") int id) throws Exception {
        
        log.info("coupleInfo 호출 : " + id);

        return new ResponseEntity<CoupleDto>(userService.coupleInfo(id), HttpStatus.OK);
    }


}

