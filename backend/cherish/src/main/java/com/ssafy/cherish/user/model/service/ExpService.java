package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.ExpHistoryDto;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface ExpService {

    // 입력 : coupleId, exp, content
    public void createExpHistory(ExpHistoryDto historyDto) throws Exception;

    // 입력 : coupleId
    // 출력 : 경험치 기록이 있는 날짜를 key로 가진 경험치 기록 객체 리스트
    public Map<String, ArrayList> getExpHistory(int coupleId) throws Exception;

    int getExpLevel (int coupleId) throws Exception;

}
