package com.ssafy.cherish.meeting.model.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "MeetingDto : 영상통화(체리콜) 정보",description = "영상통화 정보")
public class MeetingDto {
    private int id;
    private int coupleId;
    private String length;
    private String createdAt;
    private String deletedAt;
}
