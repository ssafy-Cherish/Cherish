package com.ssafy.cherish.user.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "경험치 내역", description = "커플별 경험치 누적 내역 및 획득 이유")
public class ExpHistoryDto {
    private int id;
    private int coupleId;
    private int exp;
    private String content;
    private String createdAt;
}
