package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import com.ssafy.cherish.user.model.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    public UserServiceImpl (UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public void firstJoin (UserDto userDto) throws Exception {
        userMapper.firstJoin(userDto);
    }

    @Override
    public void secondJoin (UserDto userDto) throws Exception {
        userMapper.secondJoin(userDto);
    }

    @Override
    public void coupleFirstJoin(CoupleDto coupleDto) throws Exception {
        userMapper.coupleFirstJoin(coupleDto);
    }

    @Override
    public void coupleSecondJoin(CoupleDto coupleDto) throws Exception {
        userMapper.coupleSecondJoin(coupleDto);
    }


}
