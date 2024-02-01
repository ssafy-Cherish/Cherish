package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;

import java.sql.SQLException;

public interface UserService {

    void join (UserDto userDto) throws Exception;
    void coupleFirstJoin (CoupleDto coupleDto) throws Exception;
    void coupleSecondJoin (CoupleDto coupleDto) throws Exception;
    void insertKakaoId (long kakaoId) throws SQLException;
    UserDto userInfo(int id) throws Exception;
    CoupleDto coupleInfo (int id) throws Exception;
    UserDto findByKakaoId (long kakaoId) throws Exception;
    void modifyUser (UserDto userDto) throws Exception;
    void modifyCouple (CoupleDto coupleDto) throws Exception;

}
