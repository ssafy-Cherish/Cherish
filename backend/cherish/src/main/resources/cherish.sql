-- DB 생성
CREATE DATABASE IF NOT EXISTS cherish;
use cherish;

-- 회원 테이블
create table IF NOT EXISTS members (
	user_id varchar(40) NOT NULL,
    PRIMARY KEY (`user_id`)
);
insert into members (user_id)
values
('ssafy')
;