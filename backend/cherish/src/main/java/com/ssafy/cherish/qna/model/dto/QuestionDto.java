package com.ssafy.cherish.qna.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "QuestionDto : 질문 정보", description = "오늘의 질문을 담고 있는 Dto")
public class QuestionDto {

    private int id;
    private String content;

}
