package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.ExpHistoryDto;
import com.ssafy.cherish.user.model.mapper.ExpMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.*;

@Service
public class ExpServiceImpl implements ExpService {
    @Autowired
    private ExpMapper expMapper;
    @Override
    @Transactional
    public void createExpHistory(ExpHistoryDto historyDto) throws Exception {
        expMapper.createExpHistory(historyDto);
        expMapper.addCoupleExp(historyDto.getCoupleId());
    }

    @Override
    public Map<String,ArrayList> getExpHistory(int coupleId) throws Exception {
        List<ExpHistoryDto> list=expMapper.getExpHistory(coupleId);
        Map<String,ArrayList> map=new TreeMap<>(Comparator.reverseOrder());

        for(ExpHistoryDto exp:list) {
            if(!map.containsKey(exp.getCreatedAt()))
            {
                map.put(exp.getCreatedAt(),new ArrayList<>());
            }
            ArrayList<Object> curList = map.get(exp.getCreatedAt());
            curList.add(exp);
        }
        return map;
    }

    @Override
    public int getExpLevel(int coupleId) throws Exception {
        return expMapper.getExpLevel(coupleId);
    }

}
