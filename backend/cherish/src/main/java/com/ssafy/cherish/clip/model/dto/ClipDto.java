package com.ssafy.cherish.clip.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "동영상 클립", description = "미팅을 통해 생성된 동영상 클립 클래스")
public class ClipDto {
    private int id;
    private int meetingId;
    private String keyword;
    private String filepath1;
    private String filepath2;
    private boolean isSelected;
    private boolean isPinned;
    private String createdAt;
}