package com.ssafy.cherish.meeting.model.service;

import com.ssafy.cherish.meeting.model.dto.ChatDto;

import java.util.List;

public interface ChatService {

    void saveChat (ChatDto chatDto) throws Exception;
    List<ChatDto> getChat (int meetingId) throws Exception;

}
