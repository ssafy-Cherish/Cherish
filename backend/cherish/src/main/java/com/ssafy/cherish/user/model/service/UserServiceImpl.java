package com.ssafy.cherish.user.model.service;

import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import com.ssafy.cherish.user.model.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public void join(UserDto userDto) throws Exception {
        userMapper.join(userDto);
    }

    @Override
    public void coupleFirstJoin(UserDto userDto) throws Exception {
        userMapper.coupleFirstJoin(userDto);
    }

    @Override
    public void coupleSecondJoin(UserDto userDto) throws Exception {
        userMapper.coupleSecondJoin(userDto);
    }

    @Override
    public UserDto userInfo(long kakaoId) throws Exception {
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

    @Override
    public void createCouple(CoupleDto coupleDto) {
        userMapper.createCouple(coupleDto);
    }

    @Override
    public CoupleDto findByCode(String code) {
        return userMapper.findByCode(code);
    }

    @Override
    public List<String> getBirthdays(int coupleId) {
        return userMapper.getBirthdays(coupleId);
    }


    // 이 밑에 있는 친구들은 jwt 적용을 할 때 필요한 친구입니다.
//    @Override
//    public UserDto login(long kakaoId) throws Exception {
//        return userMapper.login(kakaoId);
//    }
//
//    @Override
//    public void saveToken(long kakaoId, String accessToken) throws Exception {
//        Map<String, Object> map = new HashMap<String, Object>();
//        map.put("kakao_id", kakaoId);
//        map.put("access token", accessToken);
//
//        userMapper.saveToken(map);
//    }
//
//    @Override
//    public Object getToken(long kakaoId) throws Exception {
//        return userMapper.getToken(kakaoId);
//    }
//
//    @Override
//    public void deleteToken(long kakaoId) throws Exception {
//        Map<String, Object> map = new HashMap<String, Object>();
//        map.put("kakaoId", kakaoId);
//        map.put("accessToken", null);
//
//        userMapper.deleteToken(map);
//    }


}
