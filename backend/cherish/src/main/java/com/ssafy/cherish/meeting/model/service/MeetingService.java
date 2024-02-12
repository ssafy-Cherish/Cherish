package com.ssafy.cherish.meeting.model.service;

import com.ssafy.cherish.meeting.model.dto.MeetingDto;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface MeetingService {

    // 입력 : 체리콜을 시작한 coupleId
    // 출력 : 생성된 meetingDto의 id (meetingId)
    int createMeeting(int coupleId) throws Exception;

    // 입력 : 변경할 meetingId
    // 출력 : 변경된 행의 수 (1이 정상)
    int setMeetingLength(int meetingId) throws Exception;

    // 입력 : coupleId, yearMonth
    // 출력 : 영상통화한 날짜 String List
    List<String> getMeetingsByMonth(Map<String, Object> map) throws Exception;

    // 입력 : coupleId, date
    // 출력 : (연결된 ChatDto List와 ClipDto List가 저장된 상태의 MeetingDto List)와 (해당일자 MemoDto)가 들어간 List
    List<MeetingDto> getMeetingsByDate(Map<String, Object> map) throws Exception;

}
