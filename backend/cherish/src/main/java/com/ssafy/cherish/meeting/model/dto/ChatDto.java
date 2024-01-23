package com.ssafy.cherish.meeting.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Schema(name = "채팅", description = "미팅으로 생성된 채팅 기록 클래스")
public class ChatDto {
    private int id;
    private int userId;
    private int meetingId;
    private String content;
    private String createdAt;
    private String deletedAt;
}
