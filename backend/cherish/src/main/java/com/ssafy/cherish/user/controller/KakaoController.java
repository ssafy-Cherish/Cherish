//package com.ssafy.cherish.user.controller;
//
//import jakarta.servlet.http.HttpSession;
//
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.servlet.ModelAndView;
//
//import java.util.HashMap;
//
//    @RestController
//    public class KakaoController {
//
//        private final KakaoAPI kakaoApi = new KakaoAPI();
//
////        @RequestMapping(value="/login")
//        public ModelAndView login(@RequestParam("code") String code, HttpSession session) {
//            ModelAndView mav = new ModelAndView();
//            // 1번 인증코드 요청 전달
//            String accessToken = kakaoApi.getAccessToken(code);
//            // 2번 인증코드로 토큰 전달
//            HashMap<String, Object> userInfo = kakaoApi.getUserInfo(accessToken);
//
//            System.out.println("login info : " + userInfo.toString());
//
//            if(userInfo.get("email") != null) {
//                session.setAttribute("userId", userInfo.get("email"));
//                session.setAttribute("accessToken", accessToken);
//            }
//            mav.addObject("userId", userInfo.get("email"));
//            mav.setViewName("static/index");
//            return mav;
//        }
//
//        @RequestMapping(value="/logout")
//        public ModelAndView logout(HttpSession session) {
//            ModelAndView mav = new ModelAndView();
//
//            kakaoApi.kakaoLogout((String)session.getAttribute("accessToken"));
//            session.removeAttribute("accessToken");
//            session.removeAttribute("userId");
//            mav.setViewName("static/index");
//            return mav;
//        }
//
//}
