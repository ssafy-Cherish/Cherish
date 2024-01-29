package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;

import java.sql.SQLException;

public interface UserService {

    void firstJoin (UserDto userDto) throws Exception;
    void secondJoin (UserDto userDto) throws Exception;
    void coupleFirstJoin (CoupleDto coupleDto) throws Exception;
    void coupleSecondJoin (CoupleDto coupleDto) throws Exception;
    UserDto userInfo(int kakaoId) throws Exception;
}
