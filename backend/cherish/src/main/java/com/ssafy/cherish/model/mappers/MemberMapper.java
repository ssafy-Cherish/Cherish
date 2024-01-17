package com.ssafy.cherish.model.mappers;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.ssafy.cherish.model.dto.MemberDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {
	int joinMember(MemberDto memberDto);
}
