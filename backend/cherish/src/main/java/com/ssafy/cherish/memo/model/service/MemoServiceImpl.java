package com.ssafy.cherish.memo.model.service;

import com.ssafy.cherish.memo.model.dto.MemoDto;
import com.ssafy.cherish.memo.model.mapper.MemoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemoServiceImpl implements MemoService {

    @Autowired
    private MemoMapper memoMapper;

    @Override
    public void writeMemo (MemoDto memoDto) throws Exception {
        memoMapper.writeMemo(memoDto);
    }

    @Override
    public MemoDto getMemo (String date, String coupleId) throws Exception {
        return memoMapper.getMemo(date, coupleId);
    }

    @Override
    public void modifyMemo (MemoDto memoDto) throws Exception {
        memoMapper.modifyMemo(memoDto);
    }

    @Override
    public void deleteMemo (String date, String coupleId) throws Exception {
        memoMapper.deleteMemo(date, coupleId);
    }
}
