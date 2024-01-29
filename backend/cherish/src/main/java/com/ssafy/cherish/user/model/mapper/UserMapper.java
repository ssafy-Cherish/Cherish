package com.ssafy.cherish.user.model.mapper;


import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;

@Mapper
public interface UserMapper {

    // 그냥 회원가입으로 변경
    void join (UserDto userDto) throws SQLException;

    // 첫 번째 유저 회원가입
    void firstJoin (UserDto userDto) throws SQLException;

    // 두 번째 유저 회원가입
    void secondJoin (UserDto userDto) throws SQLException;

    // 첫 번째 유저 회원가입 시 커플 테이블 생성
    void coupleFirstJoin (CoupleDto coupleDto) throws SQLException;

    // 두 번째 유저 회원가입 시 커플 테이블 업데이트
    void coupleSecondJoin (CoupleDto coupleDto) throws SQLException;

    //회원 정보 조회
    UserDto userInfo(int kakaoId) throws SQLException;


}
