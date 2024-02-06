package com.ssafy.cherish.user.controller;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import com.ssafy.cherish.user.model.service.UserService;
//import com.ssafy.cherish.utils.JWTUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

//    @Autowired
//    private JWTUtil jwtUtil;

    private final KakaoAPI kakaoApi = new KakaoAPI();
    public static final String AUTHORIZATION = "Authorization";

    @GetMapping("/login")
    @Operation(summary = "카카오 로그인", description="카카오 정보를 받아와 db에 있는지 확인하고 없다면 회원가입 있다면 로그인")
    public ResponseEntity<?> userLogin (HttpServletRequest res) {
        String accessToken = res.getHeader(AUTHORIZATION);
        HttpStatus status;

        if (accessToken == null) {
            status = HttpStatus.BAD_REQUEST;
            return  new ResponseEntity<>(status);
        }

        log.debug("카카오 로그인 호출 : {}", accessToken);
        Map<String, Object> resultMap = new HashMap<>();

        try {

//        // 1번 인증코드 요청 전달
//        String accessToken = kakaoApi.getAccessToken(code);
            // 2번 인증코드로 토큰 전달
            HashMap<String, Object> userIn = kakaoApi.getUserInfo(accessToken);

            System.out.println("login info : " + userIn.toString());

            long kakaoId = (long) userIn.get("kakaoId");
            log.debug("kakaoId : {}", kakaoId);

            if (findByKakaoId(kakaoId)) {
                // db가 있다면, 즉 회원가입이 되어 있다면 로그인 성공으로 해야하는거 아닌가 그럼 바로 메인으로 보내줘 ? -> 고민해보겠습니다,,,,
                // 우선 login이라고 써 놨는데 메인화면이 나오면 바꿔 주겠읍니다 ..
                // 있으면 coupleDto를 던져줄까?

                // 나 뭐 보내줘 -> couple_id 보내주께, coupled
                UserDto userDto = userService.userInfo(kakaoId);
                CoupleDto coupleDto = userService.coupleInfo(userDto.getCoupleId());
                List<Map<String, String>> userInfos = userService.getUserInfos(userDto.getCoupleId());
                resultMap.put("kakao_id", kakaoId);
                resultMap.put("user_id", userDto.getId());
                resultMap.put("nickname", userDto.getNickname());
                resultMap.put("userInfos", userInfos);
                resultMap.put("coupleDto", coupleDto);
                resultMap.put("verified", true);
                status = HttpStatus.OK;

                return new ResponseEntity<Map<String, Object>>(resultMap, status);
            } else {
                // db가 없다면, 즉 아직 회원이 아니라면 회원가입
                // 먼저 카카오 아이디를 등록한 후에 보내는 것도 방법일지도?? 라는 생각을 하게 되었습니다
                // 하지만 그러면 id값을 보내야 하겠조 ??? 흠 어떻게 하는게 좋을까요
                // 이게 redirect로 보내는게 맞읋까 흠흠흠 고민고밈이가 되네요
                // 401로 보내고
                // 200으로 보내기 OK

                resultMap.put("verified", false);
                status = HttpStatus.OK;

                return new ResponseEntity<Map<String, Object>>(resultMap, status);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<>(status);
        }
    }


//    @PostMapping("/login/{kakaoId}")
//    @Operation(summary = "로그인", description = "kakaoId를 통한 로그인 처리")
//    public ResponseEntity<?> login (@PathVariable("kakaoId") long kakaoId) {
//        log.debug("login 호출 : {}", kakaoId);
//        Map<String, Object> resultMap = new HashMap<String, Object>();
//        HttpStatus status;
//
//        try {
//            log.debug("111111111111");
//            UserDto loginUser = userService.login(kakaoId);
//            log.debug("222222222222");
//            String accessToken = jwtUtil.createAccessToken(loginUser.getKakaoId());
//            log.debug("access token : {}", accessToken);
//
//            userService.saveToken(loginUser.getKakaoId(), accessToken);
//
//            resultMap.put("accessToken", accessToken);
//
//            status = HttpStatus.CREATED;
//        } catch (Exception e) {
//            log.debug("login 에러 발생 : {}", e);
//            status = HttpStatus.UNAUTHORIZED;
//        }
//
//        return new ResponseEntity<Map<String, Object>>(resultMap, status);
//    }


//    @GetMapping("/logout/{kakaoId}")
//    @Operation(summary = "로그아웃", description = "회원 정보를 담은 token을 제거함")
//    public ResponseEntity<?> logout (long kakaoId) {
//        log.debug("logout 호출 : {}", kakaoId);
//        Map<String, Object> resultMap = new HashMap<String, Object>();
//        HttpStatus status;
//
//        try {
//            userService.deleteToken(kakaoId);
//            status = HttpStatus.OK;
//        } catch (Exception e) {
//            log.debug("logout 에러 발생 : {}", e);
//            resultMap.put("message", e.getMessage());
//            status = HttpStatus.UNAUTHORIZED;
//        }
//        return new ResponseEntity<Map<String, Object>>(resultMap, status);
//    }


    // 카카오 아이디를 조회해서 user table에 있을 경우 true, 없을 경우 false를 반환
    // 우선 여기는 수정할지 말지 다시 고민해봐야 할 것 같아용~ 02/02
    public boolean findByKakaoId (long kakaoId) {
        log.debug("findKakaoId 호출 : {}", kakaoId);

        try {
            UserDto userDto = userService.findByKakaoId(kakaoId);

            if (userDto == null) {
                return false;
            } else {
                return true;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }


    @PostMapping("/join")
    @Operation(summary = "회원가입", description="code값에 따라 첫 번째 또는 두 번째 유저로 구분해 회원가입 진행")
    public ResponseEntity<?> join (@RequestBody HashMap<String, String> map, HttpServletRequest res) {
        log.debug("join 호출 : {}", map);
        HttpStatus status = HttpStatus.OK;
        String accessToken = res.getHeader(AUTHORIZATION);

        if (accessToken == null) {
            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<>(status);
        }

        try {
            CoupleDto coupleDto = new CoupleDto();

            // 커플 테이블 정보 생성 또는 가져오는 단계

            // 코드가 없다면 생성
            if (!map.containsKey("code")) {
                coupleDto.setCode(createCode());
                coupleDto.setAnniversary(map.get("anniversary"));
                userService.createCouple(coupleDto);
            }
            // 코드가 있다면 code로 id 가져오기
            else {
                coupleDto = userService.findByCode(map.get("code"));
                if(coupleDto.getUser1() != null && coupleDto.getUser2() != null) {
                    throw new Exception("Invalid Code");
                }
            }

            // join 단계
            HashMap<String, Object> userIn = kakaoApi.getUserInfo(accessToken);

            System.out.println("login info : " + userIn.toString());

            long kakaoId = (long)userIn.get("kakaoId");
            log.debug("kakaoId : {}", kakaoId);

            UserDto userDto = new UserDto();
            userDto.setKakaoId(kakaoId);
            userDto.setNickname(map.get("nickname"));
            userDto.setBirthday(map.get("birthday"));
            userDto.setEmail(map.get("email"));
            userDto.setCoupleId(coupleDto.getId());

            userService.join(userDto);

            // 첫 번째 회원가입일 경우의 update
            if (coupleDto.getUser1() == null) {
                userService.coupleFirstJoin(userDto);
            }
            // 두 번째 회원가입일 경우의 update
            else if (coupleDto.getUser2() == null){
                userService.coupleSecondJoin(userDto);
            }

        } catch (Exception e) {
            log.error("회원가입 에러 : {}", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        // 여기서 code값을 받았는지 안 받았는지를 통해 firstJoin과 secondJoin을 나누어야 함

        // 엑세스 토큰을 보내줘 -> kakaoId를 찾아 ->
        // 첫 번째 join : code 생성 후 저장
        // userDto를 보내줄 때, code값이 null이면 첫join, 아니면 두join

//        try {
//            userDto.setKakaoId(kakaoId);
//            int num = userDto.getId();
//            userService.join(userDto);
//
//            if (coupleDto.getCode() == null) {
//                coupleDto.setUser1(num);
//                // 첫 번째 유저는 인증 코드가 없기 때문에 코드를 보내 줌
//                coupleDto.setCode(createCode());
//                userService.coupleFirstJoin(coupleDto);
//            } else {
//                coupleDto.setUser2(num);
//                userService.coupleSecondJoin(coupleDto);
//            }
//            status = HttpStatus.CREATED;
//        } catch (Exception e) {
//            log.error("회원가입 에러 : {}", e.getMessage());
//            status = HttpStatus.INTERNAL_SERVER_ERROR;
//        }

        return new ResponseEntity<>(status);
    }

    @DeleteMapping("/delete/{userId}")
    @Operation(summary = "유저 정보 삭제", description="user 테이블의 id를 가져와 알맞은 유저의 정보를 가져옴")
    public  ResponseEntity<?> deleteUser (@PathVariable Integer userId, HttpServletRequest req) {

        String accessToken = req.getHeader(AUTHORIZATION);
        HttpStatus status = HttpStatus.OK;

        if (accessToken == null) {
            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<>(status);
        }

        HashMap<String, Object> userIn = kakaoApi.getUserInfo(accessToken);

        System.out.println("login info : " + userIn.toString());

        long kakaoId = (long)userIn.get("kakaoId");
        log.debug("kakaoId : {}", kakaoId);
        
        try {
            UserDto userDto = new UserDto();
            userDto.setId(userId);
            userDto.setKakaoId(kakaoId);

            int value = userService.deleteUser(userDto);

            if(value == 0)
                status = HttpStatus.BAD_REQUEST;



        }catch (Exception e) {
            log.error("회원삭제 에러 : {}", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(status);
    }

    @GetMapping("/userInfo")
    @Operation(summary = "유저 정보 조회", description="user 테이블의 id를 가져와 알맞은 유저의 정보를 가져옴")
    public ResponseEntity<?> userInfo (@RequestParam("kakaoId") long kakaoId) {
        log.debug("userInfo 호출 : {}", kakaoId);
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status;

        try {
            resultMap.put("userDto", userService.userInfo(kakaoId));
            status = HttpStatus.OK;

            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        } catch (Exception e) {
            status = HttpStatus.UNAUTHORIZED;

            return new ResponseEntity<>(status);
        }
    }


    @GetMapping("/coupleInfo")
    @Operation(summary = "커플 정보 조회", description="couple 테이블의 id를 가져와 알맞은 유저의 정보를 가져옴")
    public ResponseEntity<?> coupleInfo (@RequestParam("id") int id) throws Exception {
        log.debug("coupleInfo 호출 : {}", id);

        return new ResponseEntity<CoupleDto>(userService.coupleInfo(id), HttpStatus.OK);
    }


    @PutMapping("/modifyUser")
    @Operation(summary = "유저 정보 수정", description="user 테이블의 정보를 수정함")
    public ResponseEntity<?> modifyUser (@RequestBody UserDto userDto) {
        log.debug("modifyUser 호출 : {}", userDto);

        try {
            userService.modifyUser(userDto);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/modifyCouple")
    @Operation(summary = "커플 정보 수정", description="couple 테이블의 정보를 수정함")
    public ResponseEntity<?> modifyCouple (@RequestBody CoupleDto coupleDto) {
        log.debug("modifyCouple 호출 : {}", coupleDto);

        try {
            userService.modifyCouple(coupleDto);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    // 인증코드 생성 함수
    public String createCode() throws Exception {
        Random random = new Random();
        String code; // 해시코드를 여기에 받을 예정
        
        while (true) {
            StringBuffer key = new StringBuffer();

            for (int i = 0; i < 12; i++) {
                // 0 ~ 2 사이의 값을 랜덤하게 받아서 idx에 넣음
                int idx = random.nextInt(3);

                // idx의 값에 따라 switch를 통해 0이면 소문자 알파벳, 1이면 대문자 알파벳, 2면 숫자를 넣음
                switch (idx) {
                    case 0:
                        // a(97) ~ z(122)
                        key.append((char) ((int) random.nextInt(26) + 97));
                        break;
                    case 1:
                        // A(65) ~ Z(90)
                        key.append((char) ((int) random.nextInt(26) + 65));
                        break;
                    case 2:
                        // 0 ~ 9
                        key.append((random.nextInt(9)));
                        break;
                }
            }

            code = key.toString();

            if (!userService.hasCode(code)) { // code가 DB에 없다면 break
                break;
            }

        }

        return code;
    }

}

