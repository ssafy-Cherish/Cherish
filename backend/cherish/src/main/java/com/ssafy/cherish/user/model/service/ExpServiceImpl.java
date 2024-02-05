package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.ExpHistoryDto;
import com.ssafy.cherish.user.model.mapper.ExpMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpServiceImpl implements ExpService {
    @Autowired
    private ExpMapper expMapper;
    @Override
    public void createExpHistory(Map<String,Object> map) throws Exception {
        int coupleId=(int)map.get("coupleId");
        ArrayList<Map<String,Object>> historyList=(ArrayList<Map<String,Object>>) map.get("history");

        for (Map<String, Object> historyMap : historyList) {
            ExpHistoryDto historyDto = new ExpHistoryDto();
            historyDto.setCoupleId(coupleId);
            historyDto.setExp((int) historyMap.get("exp"));
            historyDto.setContent((String) historyMap.get("content"));
            // createdAt 설정 등 필요시 추가

            expMapper.createExpHistory(historyDto);
        }
    }

    @Override
    public Map<String,ArrayList> getExpHistory(int coupleId) throws Exception {
        List<ExpHistoryDto> list=expMapper.getExpHistory(coupleId);
        Map<String,ArrayList> map=new HashMap<>();

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

}
