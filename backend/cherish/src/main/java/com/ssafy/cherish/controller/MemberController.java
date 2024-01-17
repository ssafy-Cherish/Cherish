package com.ssafy.cherish.controller;

import java.util.HashMap;
import java.util.Map;

import com.ssafy.cherish.model.dto.MemberDto;
import com.ssafy.cherish.model.service.MemberService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

// 회원 컨트롤러
@RestController
@RequestMapping("/user")
@Slf4j
public class MemberController {

	@Autowired
	private MemberService memberService;

	// 회원가입
	@Parameter(name = "회원가입", description = "회원정보를 받아 회원가입 처리.")
	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> register(
			@RequestBody @Parameter(name = "회원가입 시 필요한 회원정보.", required = true) MemberDto memberDto) {
		log.debug("register user : {}", memberDto);
		Map<String, Object> resultMap = new HashMap<String, Object>();
		HttpStatus status = HttpStatus.ACCEPTED;
		try {
			memberService.joinMember(memberDto);
		} catch (Exception e) {
			log.debug("로그인 에러 발생 : {}", e);
			
			resultMap.put("message", "아이디 또는 패스워드를 확인해주세요.");
			status = HttpStatus.UNAUTHORIZED;
			resultMap.put("message", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Map<String, Object>>(resultMap, status);
	}

}
