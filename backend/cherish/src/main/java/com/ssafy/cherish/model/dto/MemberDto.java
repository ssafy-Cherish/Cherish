package com.ssafy.cherish.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Tag(name = "MemberDto : 회원정보", description = "회원의 상세 정보를 나타낸다.")
public class MemberDto {

	@Schema(name = "아이디")
	private String userId;
	
}
