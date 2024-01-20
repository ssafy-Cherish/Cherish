package com.ssafy.cherish.meeting.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;

@Mapper
public interface MeetingMapper {
    int createMeeting(int coupleId) throws SQLException;

    int getLastMeeting() throws SQLException;

    int setMeetingLength(int meetingId) throws SQLException;
}
