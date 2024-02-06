package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface UserService {

    void join (UserDto userDto) throws Exception;
    void coupleFirstJoin (UserDto userDto) throws Exception;
    void coupleSecondJoin (UserDto userDto) throws Exception;
    UserDto userInfo(long kakaoId) throws Exception;
    CoupleDto coupleInfo (int id) throws Exception;
    UserDto findByKakaoId (long kakaoId) throws Exception;
    void modifyUser (UserDto userDto) throws Exception;
    void modifyCouple (CoupleDto coupleDto) throws Exception;
    boolean hasCode (String code) throws Exception;

    void createCouple(CoupleDto coupleDto);

    int findByCode(String code);

    List<String> getBirthdays(int coupleId);

    // 이 밑에 있는 친구들은 jwt 적용을 할 때 필요한 친구입니다.
//    UserDto login (long kakaoId) throws Exception;
//    void saveToken (long kakaoId, String accessToken) throws Exception;
//    Object getToken (long kakaoId) throws Exception;
//    void deleteToken (long kakaoId) throws Exception;

}
