package com.ssafy.cherish.meeting.model.service;

import com.ssafy.cherish.meeting.model.dto.MeetingDto;
import com.ssafy.cherish.meeting.model.mapper.MeetingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class MeetingServiceImpl implements MeetingService {
    @Autowired
    private MeetingMapper meetingMapper;

    public MeetingServiceImpl(MeetingMapper meetingMapper) {
        this.meetingMapper = meetingMapper;
    }

    @Override
    @Transactional
    public int createMeeting(int coupleId) throws Exception {
        if (meetingMapper.createMeeting(coupleId) == 1) {
            return meetingMapper.getLastMeeting();
        } else {
            throw new Exception("An error occurred during meeting creation");
        }

    }

    @Override
    public int setMeetingLength(int meetingId) throws Exception {
        return meetingMapper.setMeetingLength(meetingId);
    }

    @Override
    public List<MeetingDto> getMeetingsByMonth(Map<String, Object> map) throws Exception {
        List<MeetingDto> list = meetingMapper.getMeetingsByMonth(map);
        return list;
    }
}
