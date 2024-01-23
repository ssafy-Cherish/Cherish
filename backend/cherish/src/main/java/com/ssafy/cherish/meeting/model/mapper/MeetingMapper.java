package com.ssafy.cherish.meeting.model.mapper;

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

    // coupleId와 yearMonth(e.g.'2024-01')로 해당 월의 체리콜의 리스트 반환
    List<MeetingDto> getMeetingsByMonth(Map<String, Object> map) throws SQLException;
}
