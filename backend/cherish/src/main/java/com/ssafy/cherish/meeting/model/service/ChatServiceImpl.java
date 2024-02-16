package com.ssafy.cherish.meeting.model.service;

import com.ssafy.cherish.meeting.model.dto.ChatDto;
import com.ssafy.cherish.meeting.model.mapper.ChatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatMapper chatMapper;

    @Override
    public void saveChat(ChatDto chatDto) throws Exception {
        chatMapper.saveChat(chatDto);
    }

    @Override
    public List<ChatDto> getChat(int meetingId) throws Exception {
        return chatMapper.getChat(meetingId);
    }
}
