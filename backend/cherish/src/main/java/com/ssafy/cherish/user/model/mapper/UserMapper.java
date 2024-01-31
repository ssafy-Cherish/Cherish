package com.ssafy.cherish.user.model.mapper;


import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;

@Mapper
public interface UserMapper {

    // 원래 유저를 나눠서 회원가입을 진행하려고 했지만 그냥 회원가입으로 변경
    // 먼저 insertKakaoId를 통해 user 테이블을 생성 후 이걸로 유저 회원가입을 할 것이다ㅏㅏㅏ 알겠는가
    void join (UserDto userDto) throws SQLException;

    // 첫 번째 유저 회원가입 시 커플 테이블 업데이트
    void coupleFirstJoin (CoupleDto coupleDto) throws SQLException;

    // 두 번째 유저 회원가입 시 커플 테이블 업데이트
    void coupleSecondJoin (CoupleDto coupleDto) throws SQLException;

    // 카카오 아이디를 받아 user 테이블 생성 -> 회원가입의 시작이라고 할 수 있죠 후후,,,
    void insertKakaoId (long kakaoId) throws SQLException;

    //회원 정보 조회
    UserDto userInfo (int id) throws SQLException;

    // 커플 정보 조회
    CoupleDto coupleInfo (int id) throws SQLException;

    // 카카오 아이디 찾기 -> 처음에 접속했을 때 유저 정보에 있는지 없는지 확인하는 것입니당 !! 알겠읍니까 휴먼?
    UserDto findByKakaoId (long kakaoId) throws SQLException;

    // 유저 정보 수정
    void modifyUser (UserDto userDto) throws SQLException;

    // 커플 정보 수정
    void modifyCouple (CoupleDto coupleDto) throws SQLException;


}
