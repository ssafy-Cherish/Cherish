-- DB 생성
CREATE DATABASE IF NOT EXISTS cherish;
use cherish;

-- foreign key 설정 끄기
SET FOREIGN_KEY_CHECKS=0;

-- 여러 행 수정 및 삭제 가능 설정
SET SQL_SAFE_UPDATES=0;

-- DDL 수행
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `couple`;
DROP TABLE IF EXISTS `meeting`;
DROP TABLE IF EXISTS `chat`;
DROP TABLE IF EXISTS `question`;
DROP TABLE IF EXISTS `answer`;
DROP TABLE IF EXISTS `memo`;
DROP TABLE IF EXISTS `clip`;
DROP TABLE IF EXISTS `exphistory`;
DROP TABLE IF EXISTS `monthlyvideo`;

CREATE TABLE `user` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `kakao_id` bigint UNIQUE NOT NULL COMMENT '유저 카카오 아이디',
  `couple_id` int NOT NULL COMMENT '커플 아이디',
  `nickname` varchar(20) DEFAULT null COMMENT '애칭',
  `email` varchar(100) DEFAULT null COMMENT '이메일',
  `birthday` datetime DEFAULT null COMMENT '생일',
  `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '생성 시각',
  `access_token` varchar(1000) DEFAULT null COMMENT '카카오 액세스 토큰',
  `refresh_token` varchar(1000) DEFAULT null COMMENT '카카오 리프레시 토큰'
);

CREATE TABLE `couple` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user1` int DEFAULT null,
  `user2` int DEFAULT null,
  `code` varchar(20) UNIQUE NOT NULL COMMENT '인증 코드',
  `coupled` Bool DEFAULT FALSE COMMENT '두 명 다 가입완료 여부',
  `anniversary` date DEFAULT null COMMENT '기념일(사귀기 시작한 날)',
  `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '생성 시각',
  `deleted_at` datetime DEFAULT NULL COMMENT '커플 한 명이라도 나간 시각',
  `exp` int DEFAULT 0 COMMENT '경험치 누적치',
  `question_cnt` int NOT NULL DEFAULT 1 COMMENT '커플이 지금까지 진행한 question index'
);

CREATE TABLE `meeting` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `couple_id` int NOT NULL,
  `length` time DEFAULT 0 COMMENT '통화 시간 길이',
  `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '생성 시각'
);

CREATE TABLE `chat` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `kakao_id` bigint COMMENT '사용자를 구분할 카카오아이디',
  `nickname` varchar(20) COMMENT '닉네임으로 유저 표시',
  `meeting_id` int NOT NULL COMMENT '미팅 아이디',
  `content` varchar(1000) NOT NULL COMMENT '메시지 내용',
  `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '생성 시각'
);

CREATE TABLE `clip` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `meeting_id` int NOT NULL COMMENT '미팅 아이디',
  `keyword` varchar(100) NOT NULL COMMENT '키워드',
  `filepath` varchar(200) DEFAULT null COMMENT '동영상 경로, clip/{couple_id}/{meeting_id}/',
  `is_selected` Bool DEFAULT FALSE COMMENT '임시 클립인지, 유저에게 선택된 영상인지',
  `is_pinned` Bool DEFAULT FALSE COMMENT '메인화면 캐러셀에 표시될 페이지인지 선택',
  `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '생성 시각'
);

CREATE TABLE `question` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) NOT NULL COMMENT '질문 내용'
);

CREATE TABLE `answer` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `kakao_id` bigint COMMENT '사용자를 구분할 카카오아이디',
  `nickname` varchar(20) COMMENT '닉네임으로 유저 표시',
  `couple_id` int NOT NULL COMMENT '답변한 커플 아이디',
  `question_id` int NOT NULL COMMENT '질문 아이디',
  `filepath` varchar(1000) COMMENT '답변 내용 영상 경로',
  `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '생성 시각'
);

CREATE TABLE `memo` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `couple_id` int NOT NULL COMMENT '커플 아이디',
  `date` datetime NOT NULL COMMENT '메모가 적힐 다이어리 일자',
  `content` varchar(1000) NOT NULL COMMENT '메시지 내용',
  `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '생성 시각'
);

CREATE TABLE `exphistory` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `couple_id` int NOT NULL COMMENT '커플 아이디',
  `exp` int DEFAULT 0 COMMENT '경험치 증가량',
  `content` varchar(200) NOT NULL COMMENT '경험치 획득 이유',
  `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '생성 시각'
);

CREATE TABLE `monthlyvideo` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `couple_id` int NOT NULL COMMENT '커플 아이디',
  `yearMonth` datetime COMMENT '연도, 월',
  `keyword` varchar(100) NOT NULL COMMENT '키워드',
  `filepath` varchar(1000) NOT NULL COMMENT '답변 내용 영상 경로'
);

-- foreign key 설정 켜기
SET FOREIGN_KEY_CHECKS=1;

CREATE UNIQUE INDEX `memo_index` ON `memo` (`couple_id`, `date`);

ALTER TABLE `user` ADD FOREIGN KEY (`couple_id`) REFERENCES `couple` (`id`);

ALTER TABLE `couple` ADD FOREIGN KEY (`user1`) REFERENCES `user` (`id`) ON DELETE SET NULL;

ALTER TABLE `couple` ADD FOREIGN KEY (`user2`) REFERENCES `user` (`id`) ON DELETE SET NULL;

ALTER TABLE `meeting` ADD FOREIGN KEY (`couple_id`) REFERENCES `couple` (`id`);

ALTER TABLE `chat` ADD FOREIGN KEY (`meeting_id`) REFERENCES `meeting` (`id`);

ALTER TABLE `clip` ADD FOREIGN KEY (`meeting_id`) REFERENCES `meeting` (`id`);

ALTER TABLE `answer` ADD FOREIGN KEY (`couple_id`) REFERENCES `couple` (`id`);

ALTER TABLE `answer` ADD FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

ALTER TABLE `memo` ADD FOREIGN KEY (`couple_id`) REFERENCES `couple` (`id`);

ALTER TABLE `exphistory` ADD FOREIGN KEY (`couple_id`) REFERENCES `couple` (`id`);

ALTER TABLE `monthlyvideo` ADD FOREIGN KEY (`couple_id`) REFERENCES `couple` (`id`);

-- DB 질문리스트
INSERT INTO question (content)
VALUES ("오늘이 두 분의 첫 만남이라면 당신을 어떻게 소개하실 건가요?"),
("그 사람을 처음 마주했을 때 당신의 감정은 어땠나요?"),
("그 사람을 생각하면 떠오르는 노래가 있나요?"),
("난 사실 너의 마음을 얻기 위해 -- 했어."),
("그 사람과 닮은 동물은 무엇인가요?"),
("당신은 상대방의 어떤 모습에 반하게 되었나요?"),
("당신이 가장 좋아하는 아이스크림은? 사소한 것도 궁금해요."),
("우리 운명인 것 같아! 두 사람의 닮은 점이 있다면?"),
("당신이 가장 좋아하는 스킨십은 무엇인가요?"),
("사랑에 빠지기 시작할 때 당신이 가장 두려워 하는 것은 무엇인가요?"),
("오늘이 당신의 마지막 날이라면 어떤 하루를 보내고 싶은가요?"),
("그 사람과 처음 대화를 나눈 날 어떤 이야기를 주고받았나요?"),
("집이 무너진다면, 가족들을 구한 후 가장 먼저 챙겨 나올 물건 3가지는?"),
("상대방과 함께 보고 싶은 당신의 인생 영화 top3를 알려주세요!"),
("일주일 동안 뽀뽀 금지령이 내려진다면?"),
("당신이 연애 상대를 택할 때 가장 중요하게 생각하는 것은 무엇인가요?"),
("오늘 같은 날씨에 함께 요리해서 먹고 싶은 음식은 무엇인가요?"),
("고백했던, 혹은 고백을 받았던 날 기분은 어땠나요?"),
("그 사람이 토라졌을 때 한방에 풀리게 하는 비법이 있다면?"),
("처음엔 네가 '이런' 사람 일 것이라 생각했어."),
("달라도 너무 달라! 우리 이것만큼은 정 반대인 것 같아."),
("당신이 가장 당신다워지는 순간은 언제인가요?"),
("그 사람은 어떤 목소리와 눈빛을 지니고 있는 사람인가요?"),
("당신이 발견한 그 사람의 귀여운 버릇이 있다면?"),
("당신이 아무리 노력해도 고치기 어려운 단점이 있나요?"),
("나와 연애를 하며 '이것' 만큼은 꼭 지켜주면 좋겠어!"),
("올해가 가기 전에 상대방과 꼭 함께 이루고 싶은 것이 있나요?"),
("그 사람과 눈을 마주치면 어떤 생각이 드나요?"),
("당신이 생각하는 행복을 위한 부의 기준은 어느정도인가요?"),
("그 사람이 했던 말 중 오래도록 머릿속에 남았던 말은?"),
("서로 양보할 수 없는 갈등이 생긴다면 어떻게 해결하면 좋을까요?"),
("당신은 그 사람에게 어떤 존재가 되어주고 싶은가요?"),
("상대방에게 섹시함을 느꼈던 순간이 있다면 언제인가요?"),
("누구나 각자의 고민이 있어요. 서로의 고민을 털어놔 보세요!"),
("사랑을 의미하는 단어를 나열해 보세요. 단, 사랑이란 단어는 빼고요."),
("당신의 소비패턴에서 가장 많은 지출을 차지하는 것은?"),
("상대방은 어떤 향기가 나는 사람인가요?"),
("매일 너와 -- 하고싶어 ♥"),
("당신이 사랑하는 그 사람을 자랑해보세요. 최대한 뻔뻔하게요!"),
("살면서 가장 당황했던 순간은 언제인가요?"),
("당신이 온전히 그 사람만을 위해서 하는 행동이 있다면 무엇인가요?"),
("오늘은 아무 말 대잔치의 날이에요 상대방에게 하고싶은 아무 말은?"),
("당신은 주변 사람들에게 어떤 사람으로 남고 싶나요?"),
("당신이 연인이 당신에게 서운함을 느낄 때는 언제인가요?"),
("당신이 생각하는 가장 이상적인 연인 관계는 어떤 모습인가요?"),
("최근에 당신이 바보같이 느껴졌던 순간은 언제인가요?"),
("지금 그 사람과 어디든 떠날 수 있다면, 함께 가고 싶은 곳은 어디인가요?"),
("멀리서 그 사람이 걸어 올 때 어떤 생각이 드나요?"),
("두 분의 연애 스토리를 영화로 만든다면 어떤 장르일까요?"),
("이 사람과 오래오래 함께하고 싶다고 생각한 순간은 언제인가요?"),
("그 사람은 모르는 당신만의 은밀한 취향이 있다면?"),
("당신의 연인에게 다시 한번 반하게 되었던 순간은 언제인가요?"),
("데이트 하기 가장 좋은 계절과 그 이유는 무엇인가요?"),
("10만원을 가장 알차게 쓸 수 있는 방법은 무엇일까요?"),
("상대방이 당신에 대해 꼭 알아야 하는 것을 말해주세요."),
("그 사람과 지금 당장 하고 싶은 것은 무엇인가요?"),
("'나'라는 사람에 대해 사람들이 갖는 편견은 무엇인가요?"),
("우리의 첫 키스. 어땠는지 기억나?"),
("당신이 사랑받고 있다는 것을 느끼게 해줬던 그 사람의 애정표현은?"),
("당신의 인생에 가장 큰 영향을 준 사람은 누구인가요?"),
("그 사람과 함께 가고싶은 당신만의 맛집은 어디인가요?"),
("당신이 이제 그만 -- 하면 좋겠어...!"),
("아침에 눈을 떴을 때, 상대방이 눈 앞에 있다면 당신의 반응은?"),
("제대로 사과하지 못했던 일이 있나요?"),
("요즘 그 사람의 최대 관심사는 무엇인지 맞춰보세요!"),
("그 사람에게 배우고 싶은 점이나 닮고 싶은 점이 있다면 무엇인가요?"),
("상대방의 취향을 맞춰보세요! 아침/저녁, 고기/회, 버스/지하철, 여름/겨울"),
("두 분이 함께 살 집을 짓는다면 어디에, 어떤 집을 짓고 싶나요?"),
("소중한 그 사람에게 가장 고마운 것은 무엇인가요?"),
("당신은 가족들에게 어떤 존재일까요?"),
("그 사람에게 지금 이 순간 듣고싶은 말이 있다면?"),
("두 분의 사랑과 어울리는 과일은 무엇인가요?"),
("두 분의 공식적인 첫 데이트 날! 어디에서 무얼 하셨나요?"),
("만약 초능력을 가지게 된다면 어떤 능력으로 무엇을 하고 싶은가요?"),
("사랑에 빠졌을 때 당신의 모습은 평소와 어떻게 다른가요?"),
("당신이 생각하는 바람의 기준은 무엇인가요?"),
("상대방과 함께 시작하고 싶은 취미 활동은 무엇인가요?"),
("당신이 세운 업적 중 가장 뿌듯한 일은 무엇인가요?"),
("니가 없는 나의 삶은 --일거야."),
("새로운 것이 필요해요! 이번 주발 데이트 코스를 짜볼까요?"),
("내가 --할 때, 당신이 -- 해줬으면 좋겠어."),
("어느 날 그 사람이 좀비가 되어 당신 앞에 나타난다면?"),
("상대방이 당신에게 가장, 자주 하는 말은 무엇일까요?"),
("당신이 마지막으로 눈물 흘린 날은 언제인가요?"),
("당신이 노래방에 갔을 때 자주 부르는 애창곡은 무엇인가요?"),
("나.. 정말 콩깍지가 씌였구나! 라고 느껴지는 때가 있다면?"),
("만약 점쟁이가 두 사람의 궁합이 맞지 않는다고 한다면?"),
("당신에게 시간이 갈 수록 소중해지는 것들을 나열해보세요."),
("상대방의 빈자리가 유독 크게 느껴질때는 언제인가요?"),
("그 사람과 함께한 날들 중 가장 소중한 추억 3가지를 꼽는다면?"),
("상대방을 만나 당신에게 일어난 가장 큰 변화는 무엇인가요?"),
("대판 싸운 날, 상대방이 홧김에 헤어져! 라고 말한다면 당신의 반응은?"),
("세상의 모든 전화기가 사라진다면 두 분은 어떻게 만날 수 있을까요?"),
("그 사람이 뿡- 방귀를 뀌었다면 당신의 반응은?"),
("상대방이 강해 보일 때, 그래서 참 든든할때는 언제인가요?"),
("당신은 먼 훗날 어디에서 어떤 모습으로 살고 싶은가요?"),
("어떤 이름으로 저장되어 있나요?"),
("지금 두 분에게 가장 필요한 것은 무엇일까요?"),
("벌써 100번째 질문이네요! 소중한 그 사람에게 하고싶은 말은?");