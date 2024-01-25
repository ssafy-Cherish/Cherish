package com.ssafy.cherish.user.model.mapper;


import com.ssafy.cherish.user.model.dto.CoupleDto;
import com.ssafy.cherish.user.model.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;

import java.sql.SQLException;

@Mapper
public interface UserMapper {

    void firstJoin (UserDto userDto) throws SQLException;
    void secondJoin (UserDto userDto) throws SQLException;
    void coupleFirstJoin (CoupleDto coupleDto) throws SQLException;
    void coupleSecondJoin (CoupleDto coupleDto) throws SQLException;

}
