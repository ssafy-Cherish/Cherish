package com.ssafy.cherish.meeting.model.service;

import java.sql.SQLException;

public interface MeetingService {
    int createMeeting(int coupleId) throws Exception;

    int setMeetingLength(int meetingId) throws Exception;
}
