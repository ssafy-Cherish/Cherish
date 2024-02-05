package com.ssafy.cherish.user.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema (name = "CoupleDto : 커플 정보", description = "커플 정보")
public class CoupleDto {

    private int id;
    private int user1;
    private int user2;
    private String code;
    private Boolean coupled;
    private String anniversary;
    private String createdAt;
    private int exp;
    private int questionCnt;

}
