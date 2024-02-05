package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.ExpHistoryDto;

import java.sql.SQLException;
import java.util.Map;

public interface ExpService {
    public void createExpHistory(Map<String,Object> map) throws Exception;

}
