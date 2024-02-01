package com.ssafy.cherish.memo.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "메모", description = "다이어리 내에서 일별로 입력되는 메모")
public class MemoDto {
    private int id;
    private int coupleId;
    private String content;
    private String createAt;
}
