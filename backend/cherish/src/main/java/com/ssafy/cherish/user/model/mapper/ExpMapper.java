package com.ssafy.cherish.user.model.mapper;

import com.ssafy.cherish.user.model.dto.ExpHistoryDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;

@Mapper
public interface ExpMapper {
    public void createExpHistory(ExpHistoryDto expHistoryDto) throws SQLException;

}
