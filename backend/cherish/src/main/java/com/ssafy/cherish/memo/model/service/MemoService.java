package com.ssafy.cherish.memo.model.service;

import com.ssafy.cherish.memo.model.dto.MemoDto;

import java.sql.SQLException;

public interface MemoService {

    void writeMemo (MemoDto memoDto) throws Exception;
    MemoDto getMemo (String date, int coupleId) throws Exception;
    void modifyMemo (MemoDto memoDto) throws Exception;

}
