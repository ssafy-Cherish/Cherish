package com.ssafy.cherish.meeting.model.service;

import com.ssafy.cherish.meeting.model.dto.MeetingDto;
import com.ssafy.cherish.meeting.model.mapper.MeetingMapper;
import com.ssafy.cherish.memo.model.mapper.MemoMapper;
import com.ssafy.cherish.user.model.dto.ExpHistoryDto;
import com.ssafy.cherish.user.model.mapper.ExpMapper;
import com.ssafy.cherish.user.model.service.ExpService;
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
    private ExpService expService;
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
    @Transactional
    public int setMeetingLength(int meetingId) throws Exception {

        int res=meetingMapper.setMeetingLength(meetingId);

        MeetingDto meetingDto=meetingMapper.getMeetingsById(meetingId);

        ExpHistoryDto historyDto=new ExpHistoryDto();
        String[] len=meetingDto.getLength().split(":");
        int time=(Integer.parseInt(len[0])*60+Integer.parseInt(len[1]))/10;
        if(time<=0)
        {
            return res;
        }
        historyDto.setCoupleId(meetingDto.getCoupleId());
        historyDto.setExp(time);
        historyDto.setContent(time*10+"분 이상 체리콜");

        expService.createExpHistory(historyDto);
        return res;
    }

    @Override
    public List<String> getMeetingsByMonth(Map<String, Object> map) throws Exception {
        return meetingMapper.getMeetingsByMonth(map);
    }

    @Override
    public List<MeetingDto> getMeetingsByDate(Map<String, Object> map) throws Exception {
        return meetingMapper.getMeetingsByDate(map);
    }

    @Override
    public String getSumOfMeetingTime(int coupleId) throws Exception {
        return meetingMapper.getSumOfMeetingTime(coupleId);
    }
}
