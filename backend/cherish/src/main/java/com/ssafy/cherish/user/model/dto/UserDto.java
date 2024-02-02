package com.ssafy.cherish.user.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema (name = "UserDto : 유저 정보", description = "유저 정보")
public class UserDto {

    private int id;
    private String idStr;
    private long kakaoId;
    private int coupleId;
    private String nickname;
    private String email;
    private String birthday;
    private String createdAt;
    private String updatedAt;
    private String deletedAt;
    private String accessToken;
    private String refreshToken;

}
