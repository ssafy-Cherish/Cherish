package com.ssafy.cherish.meeting.model.service;

import com.ssafy.cherish.meeting.model.dto.MeetingDto;
import com.ssafy.cherish.meeting.model.mapper.MeetingMapper;
import com.ssafy.cherish.memo.model.mapper.MemoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MeetingServiceImpl implements MeetingService {
    @Autowired
    private MeetingMapper meetingMapper;
    @Autowired
    private MemoMapper memoMapper;

    @Override
    @Transactional(rollbackFor = {Exception.class})
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
    public List<String> getMeetingsByMonth(Map<String, Object> map) throws Exception {
        return meetingMapper.getMeetingsByMonth(map);
    }
    @Override
    @Transactional
    public List<MeetingDto> getMeetingsByDate(Map<String, Object> map) throws Exception {
        return meetingMapper.getMeetingsByDate(map);
    }
}
