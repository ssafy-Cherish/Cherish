package com.ssafy.cherish.meeting.model.mapper;

import com.ssafy.cherish.clip.model.dto.ClipDto;
import com.ssafy.cherish.meeting.model.dto.ChatDto;
import com.ssafy.cherish.meeting.model.dto.MeetingDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Mapper
public interface MeetingMapper {
    // 미팅 행 insert
    int createMeeting(int coupleId) throws SQLException;

    // createMeeting로 가장 최근에 생성된 행 id 반환
    int getLastMeeting() throws SQLException;

    // 미팅이 종료되었을 때 현재시간과 createdAt의 차로 체리콜 길이 저장하고 update된 행 수 반환
    int setMeetingLength(int meetingId) throws SQLException;

    // coupleId와 yearMonth(e.g.'2024-01')로 해당 월의 MeetingDto 리스트 반환
    List<MeetingDto> getMeetingsByMonth(Map<String, Object> map) throws SQLException;

    //coupleId와 date(e.g.'2024-01-23')로 해당 일의 MeetingDto 리스트 반환
    List<MeetingDto> getMeetingsByDate(Map<String, Object> map) throws SQLException;

    //getMeetingsByDate에서 조회된 meetingId로 해당 미팅의 ChatDto 리스트 반환
    List<ChatDto> getChatsByMeeting(int meetingId) throws SQLException;

    //getMeetingsByDate에서 조회된 meetingId로 해당 미팅의 ClipDto 리스트 반환
    List<ClipDto> getClipsByMeeting(int meetingId) throws SQLException;
}
