package com.ssafy.cherish.qna.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "AnswerDto : 답변 정보", description = "오늘의 질문에 대한 답변을 저장하는 Dto")
public class AnswerDto {

    private int id;
    private long kakaoId;
    private String nickname;
    private int coupleId;
    private int questionId;
    private String filepath;
    private String createdAt;

}
