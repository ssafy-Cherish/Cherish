package com.ssafy.cherish.user.model.mapper;


import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface UserMapper {

    // 원래 유저를 나눠서 회원가입을 진행하려고 했지만 그냥 회원가입으로 변경
    // 먼저 insertKakaoId를 통해 user 테이블을 생성 후 이걸로 유저 회원가입을 할 것이다ㅏㅏㅏ 알겠는가
    void join (UserDto userDto) throws SQLException;

    // 첫 번째 유저 회원가입 시 커플 테이블 업데이트
    void coupleFirstJoin (UserDto userDto) throws SQLException;

    // 두 번째 유저 회원가입 시 커플 테이블 업데이트
    void coupleSecondJoin (UserDto userDto) throws SQLException;

    //회원 정보 조회
    UserDto userInfo (long kakaoId) throws SQLException;

    // 커플 정보 조회
    CoupleDto coupleInfo (int id) throws SQLException;

    // 카카오 아이디 찾기 -> 처음에 접속했을 때 유저 정보에 있는지 없는지 확인하는 것입니당 !! 알겠읍니까 휴먼?
    UserDto findByKakaoId (long kakaoId) throws SQLException;

    // 유저 정보 수정
    void modifyUser (UserDto userDto) throws SQLException;

    // 커플 정보 수정
    void modifyCouple (CoupleDto coupleDto) throws SQLException;

    // 커플 인증 코드 가져오기
    CoupleDto getCode (String code) throws SQLException;

    void createCouple(CoupleDto coupleDto);

    CoupleDto findByCode(String code);

    List<Map<String, String>> getUserInfos(int coupleId);

    int deleteUser(UserDto userDto);

    void setCoupleDeletedAt(int id);

    void initCoupleDeletedAt(int id);


    // 이 밑에 있는 친구들은 jwt 적용을 할 때 필요한 친구입니다.
//    // 유저 로그인
//    UserDto login (long kakaoId) throws SQLException;
//
//    // 토큰 저장
//    void saveToken (Map<String, Object> map) throws SQLException;
//
//    // 토큰 가져오기
//    Object getToken (long kakaoId) throws SQLException;
//
//    // 로그아웃 시 토큰 삭제
//    void deleteToken (Map<String, Object> map) throws SQLException;

}
