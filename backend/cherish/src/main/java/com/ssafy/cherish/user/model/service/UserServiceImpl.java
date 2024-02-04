package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import com.ssafy.cherish.user.model.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public void join(UserDto userDto) throws Exception {
        userMapper.join(userDto);
    }

    @Override
    public void coupleFirstJoin(CoupleDto coupleDto) throws Exception {
        userMapper.coupleFirstJoin(coupleDto);
    }

    @Override
    public void coupleSecondJoin(CoupleDto coupleDto) throws Exception {
        userMapper.coupleSecondJoin(coupleDto);
    }

    @Override
    public void insertKakaoId(long kakaoId) throws SQLException {
        userMapper.insertKakaoId(kakaoId);
    }

    @Override
    public UserDto userInfo(int kakaoId) throws Exception {
        return userMapper.userInfo(kakaoId);
    }

    @Override
    public CoupleDto coupleInfo(int id) throws Exception {
        return userMapper.coupleInfo(id);
    }

    @Override
    public UserDto findByKakaoId(long kakaoId) throws Exception {
        return userMapper.findByKakaoId(kakaoId);
    }

    @Override
    public void modifyUser(UserDto userDto) throws Exception {
        userMapper.modifyUser(userDto);
    }

    @Override
    public void modifyCouple(CoupleDto coupleDto) throws Exception {
        userMapper.modifyCouple(coupleDto);
    }

    @Override
    public boolean hasCode(String code) throws Exception {
        CoupleDto coupleDto = userMapper.getCode(code);

        // 해당 코드와 맞는 Dto가 없으면 true를 return, 있다면 false를 return
        if (coupleDto == null) {
            return false;
        } else {
            return true;
        }
    }


}
