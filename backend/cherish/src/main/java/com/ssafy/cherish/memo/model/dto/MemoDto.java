package com.ssafy.cherish.memo.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "메모", description = "다이어리 매일 입력할 수 있는 메모")
public class MemoDto {
    private int id;
    private int coupleId;
    private String content;
    private String createAt;
}
