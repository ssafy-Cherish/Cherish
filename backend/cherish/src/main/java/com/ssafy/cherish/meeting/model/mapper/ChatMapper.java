package com.ssafy.cherish.meeting.model.mapper;

import com.ssafy.cherish.meeting.model.dto.ChatDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;

@Mapper
public interface ChatMapper {

    // 채팅 저장하기
    void saveChat (ChatDto chatDto) throws SQLException;

    // 채팅 보여주기
    List<ChatDto> getChat (int meetingId) throws SQLException;

}
