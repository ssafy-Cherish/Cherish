package com.ssafy.cherish.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ssafy.cherish.model.dto.MemberDto;
import com.ssafy.cherish.model.mappers.MemberMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService {

	@Autowired
	private MemberMapper memberMapper;

	@Override
	public int joinMember(MemberDto memberDto) {
		return memberMapper.joinMember(memberDto);
	}

}
