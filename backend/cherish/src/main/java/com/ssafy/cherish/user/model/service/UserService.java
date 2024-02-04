package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;

import java.sql.SQLException;
import java.util.Map;

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
    boolean hasCode (String code) throws Exception;
    UserDto login (UserDto userDto) throws Exception;
    void saveToken (long kakaoId, String accessToken) throws Exception;
    Object getToken (long kakaoId) throws Exception;
    void deleteToken (long kakaoId) throws Exception;

}
