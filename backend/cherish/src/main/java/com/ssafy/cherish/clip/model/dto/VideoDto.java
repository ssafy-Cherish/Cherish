package com.ssafy.cherish.clip.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "체리보관함 (월별 클립 모음)",description = "커플별로 한달동안 모은 동영상을 키워드별로 모은 동영상")
public class VideoDto {
    int id;
    int coupleId;
    String yearMonth;
    String keyword;
    String filepath;
}
