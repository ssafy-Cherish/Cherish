-- DB 생성
CREATE DATABASE IF NOT EXISTS cherish;
use cherish;

-- 미팅 테이블
CREATE TABLE IF NOT EXISTS `meeting` (
  `id` INT NOT NULL COMMENT '미팅 아이디',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 채팅 테이블
CREATE TABLE IF NOT EXISTS `chat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kakao_id` BIGINT COMMENT '사용자를 구분할 카카오아이디',
  `nickname` VARCHAR(20) COMMENT '닉네임으로 유저 표시',
  `meeting_id` INT NOT NULL COMMENT '미팅 아이디',
  `content` VARCHAR(1000) NOT NULL COMMENT '메시지 내용',
  `created_at` DATETIME NOT NULL DEFAULT NOW() COMMENT '생성 시각',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`meeting_id`) REFERENCES `meeting`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
