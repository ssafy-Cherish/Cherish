package com.ssafy.cherish.user.model.mapper;

import com.ssafy.cherish.user.model.dto.ExpHistoryDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Mapper
public interface ExpMapper {
    // 경험치 기록 생성 (따로 id나 행 수 반환하지 않음)
    public void createExpHistory(ExpHistoryDto expHistoryDto) throws SQLException;
    // 커플의 한달 내 경험치 기록
    public List<ExpHistoryDto> getExpHistory(int coupleId) throws SQLException;
}
