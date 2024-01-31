package com.ssafy.cherish.memo.model.mapper;

import com.ssafy.cherish.memo.model.dto.MemoDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Mapper
public interface MemoMapper {
    // 일자별로 메모 내용 불러오기 (하루에 메모 여러개이면 에러 발생)
    MemoDto getMemoByDate(Map<String, Object> map) throws SQLException;
}
