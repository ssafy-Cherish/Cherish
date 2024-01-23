package com.ssafy.cherish.meeting.model.dto;

import com.ssafy.cherish.chat.model.dto.ChatDto;
import com.ssafy.cherish.clip.model.dto.ClipDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(name = "MeetingDto : 영상통화(체리콜) 정보", description = "영상통화 정보")
public class MeetingDto {
    private int id;
    private int coupleId;
    private String length;
    private String createdAt;
    private String deletedAt;
    //이 meeting과 관련된 chat 객체 리스트
    private List<ChatDto> chats;
    ////이 meeting과 관련된 clip 객체 리스트
    private List<ClipDto> clips;

}
