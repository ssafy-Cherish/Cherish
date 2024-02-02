import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, useAnimate } from "framer-motion";
import { useState } from "react";
import { motion } from "framer-motion";
import { default as NavModal } from "../../components/Common/Modal";
import { default as Modal } from "../../components/Diary/Modal";
import dayjs from "dayjs";
import dailyImg from "../../assets/diary/DiaryDailyPage.svg";
import "../../components/Diary/DiaryDailyPage.css";
import ChatModal from "../../components/Diary/ChatModal";
import MemoModal from "../../components/Diary/MemoModal";
import MemoImg from "../../assets/MemoImg.svg";
import chatImg from "../../assets/diary/chat.svg";

const DiaryDailyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scope, animate] = useAnimate();
  const navigate = useNavigate();
  let year = searchParams.get("year");
  let month = searchParams.get("month");
  let day = searchParams.get("day");
  const date = new Date(year, +month - 1, day);

  // 내 kakaoId, 채팅 위치 식별 용
  // TODO : zustand에 저장되어 있는 값 가져와야 함
  const myId = 1;

  // 시작 날
  // TODO : zustand에 저장되어 있는 값 가져와야 함
  const [anniversary, setAnniversary] = useState(["2024-1-2"]);

  // 미팅 데이터
  // TODO : DB에서 데이터 가져와야 함
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      craetedAt: "2024-1-13 09:37:00",
      chats: [
        {
          kakaoId: 1,
          nickname: "A",
          content: "hello",
        },
        {
          kakaoId: 2,
          nickname: "B",
          content: "im fine",
        },
      ],

      clips: [
        {
          id: 1,
          keyword: "Hi",
          data: "data",
          isPinned: false,
        },
        {
          id: 2,
          keyword: "Hi",
          data: "data2",
          isPinned: true,
        },
        {
          id: 3,
          keyword: "love",
          data: "data3",
          isPinned: false,
        },
        {
          id: 4,
          keyword: "love",
          data: "data4",
          isPinned: true,
        },
      ],
    },
    {
      id: 2,
      craetedAt: "2024-1-13 16:21:00",
      chats: [
        {
          kakaoId: 1,
          nickname: "A",
          content: "hello",
        },
        {
          kakaoId: 2,
          nickname: "B",
          content: "im fine",
        },
        {
          kakaoId: 1,
          nickname: "A",
          content: "im fine",
        },
        {
          kakaoId: 1,
          nickname: "A",
          content: "im fine",
        },
        {
          kakaoId: 2,
          nickname: "B",
          content: "im fine",
        },
        {
          kakaoId: 2,
          nickname: "B",
          content: "im fine",
        },
        {
          kakaoId: 1,
          nickname: "B",
          content: "im fine",
        },
        {
          kakaoId: 2,
          nickname: "B",
          content:
            "im finesdlkamsdlkamdlkamdlkasmdlaskmdalskdmaklsdmasldkmasldkasmdlkasmdlkamsdlkamsldkasmdlkasmdlsakmdlaskm",
        },
        {
          kakaoId: 1,
          nickname: "B",
          content: "im fine",
        },
        {
          kakaoId: 1,
          nickname: "B",
          content: "im fine",
        },
      ],

      clips: [
        {
          id: 1,
          keyword: "Hi",
          data: "data",
          isPinned: false,
        },
        {
          id: 2,
          keyword: "Hi",
          data: "data2",
          isPinned: true,
        },
        {
          id: 3,
          keyword: "love",
          data: "data3",
          isPinned: true,
        },
        {
          id: 4,
          keyword: "love",
          data: "data4",
          isPinned: true,
        },
      ],
    },
  ]);

  const [memo, setMemo] = useState({
    id: 1,
    content: "메모에 적힐 내용",
  });

  const [selectedId, setSelectedId] = useState(null);

  // 채팅 기록 모달 ON, OFF
  const [openChatModal, setOpenChatModal] = useState(false);

  // 메모 모달 ON, OFF
  const [openMemoModal, setOpenMemoModal] = useState(false);

  // Modal에 전달할 채팅 기록
  const [chats, setChats] = useState([]);

  function showChat(selChats) {
    setChats(selChats);
    setOpenChatModal(true);
  }

  function closeChatModal() {
    setOpenChatModal(false);
  }

  function showMemo() {
    setOpenMemoModal(true);
  }

  function closeMemoModal() {
    setOpenMemoModal(false);
  }

  function moveToMonthly() {
    navigate({ pathname: "/diary/month", search: `?year=${year}&month=${month}` });
  }

  function togglePinned(clipId, mIdx) {
    console.log(clipId, mIdx);

    const tmpMeetings = [...meetings];

    tmpMeetings[mIdx].clips = tmpMeetings[mIdx].clips.map((clip) => {
      const tmp = { ...clip };
      if (tmp.id === clipId) tmp.isPinned = !tmp.isPinned;
      return tmp;
    });

    console.log(tmpMeetings);

    setMeetings(tmpMeetings);
    // isPin upadte 쿼리
  }

  return (
    <>
      <NavModal z={1} modalcss="h-[90vh] w-[70vw]" isX={false}>
        <div
          className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[50vw] items-center"
          ref={scope}
        >
          {/* 선택한 날짜와 며칠째인지 나오는 곳 */}
          <div className="me-auto">
            <motion.div
              className="text-[1vw]"
              onClick={moveToMonthly}
              whileHover={{ scale: 1.2, x: "10%", fontWeight: [100, 600] }}
              transition={{ duration: 0.2 }}
            >
              {dayjs(date).format("YYYY년 MM월 DD일")}
            </motion.div>
            <div className="text-[2vw]">
              <span className="text-cherry">{dayjs(date).diff(anniversary, "day") + 1}</span>
              <span>일째의 우리</span>
            </div>
          </div>

          {/* 미팅 타임라인, 채팅, 메모 */}
          <div className="grid grid-cols-3 w-full gap-6">
            {/* 미팅 타임라인 */}
            <div className="me-auto relative col-span-2 w-full">
              <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical  overflow-y-auto h-[35vw] rmscroll">
                {meetings.map((meeting, mIdx) => (
                  // <MeetingTimeline key={meeting.id} meeting={meeting} />
                  <li key={meeting.id} className="grid-cols-[10%_90%] col-span-2">
                    <div className="timeline-middle col-start-1">
                      <div className="rounded-full bg-subpuple w-[1vw] h-[1vw]"></div>
                    </div>
                    <div className="timeline-end m-0 w-full" style={{ gridColumnStart: 2 }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[1.5vw]">
                          {dayjs(meeting.craetedAt).format("A hh : mm")}
                        </span>
                        <button
                          className="btn rounded-full bg-pink shadow-lg w-[9vw] grid grid-cols-[30%_70%] justify-between items-center"
                          onClick={() => showChat(meeting.chats)}
                        >
                          <img src={chatImg} alt="" className="w-[70%]" />
                          <span className="text-[0.8vw]">채팅 기록</span>
                        </button>
                      </div>
                      {meeting.clips.map((clip) => (
                        <div key={clip.id} className="h-1/3 mb-5 flex flex-col justify-center">
                          <div className="flex flex-row justify-center z-30">
                            <svg
                              className="absolute -mt-[1vh]"
                              width="3vw"
                              height="3vh"
                              viewBox="0 0 60 60"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => togglePinned(clip.id, mIdx)}
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M39.9101 13.0942L47.3201 20.5117C52.3501 25.5467 54.8651 28.0642 54.2801 30.7792C53.6926 33.4917 50.3626 34.7417 43.7051 37.2442L39.0926 38.9767C37.3101 39.6467 36.4176 39.9817 35.7301 40.5767C35.4301 40.8392 35.1576 41.1342 34.9251 41.4567C34.3951 42.1992 34.1426 43.1167 33.6376 44.9567C32.4876 49.1367 31.9126 51.2267 30.5401 52.0092C29.9651 52.3392 29.3101 52.5092 28.6451 52.5092C27.0701 52.5092 25.5376 50.9742 22.4726 47.9092L18.8076 44.2392L16.1101 41.5392L12.5751 37.9992C9.53012 34.9517 8.00762 33.4292 8.00012 31.8617C7.99484 31.1839 8.17 30.5169 8.50762 29.9292C9.29012 28.5717 11.3651 27.9992 15.5151 26.8542C17.3576 26.3467 18.2776 26.0942 19.0201 25.5617C19.3501 25.3217 19.6526 25.0442 19.9201 24.7317C20.5101 24.0367 20.8401 23.1392 21.4951 21.3442L23.1676 16.7867C25.6351 10.0542 26.8676 6.68666 29.5876 6.08666C32.3101 5.48666 34.8426 8.02165 39.9101 13.0942Z"
                                className={clip.isPinned ? "fill-cherry" : "fill-slate-300"}
                              />
                              <path
                                d="M55.887 26.5746C55.7655 26.3604 55.6031 26.1722 55.4089 26.0208C55.2147 25.8694 54.9925 25.7577 54.7552 25.6921C54.5178 25.6265 54.2698 25.6083 54.0254 25.6386C53.781 25.6688 53.545 25.7469 53.3308 25.8684C53.1166 25.9899 52.9284 26.1523 52.7769 26.3466C52.6255 26.5408 52.5138 26.7629 52.4482 27.0003C52.3826 27.2376 52.3645 27.4856 52.3947 27.73C52.425 27.9744 52.503 28.2104 52.6245 28.4247L55.887 26.5746ZM45.0145 20.0746C45.368 20.4164 45.8415 20.6056 46.3332 20.6015C46.8248 20.5975 47.2951 20.4005 47.6429 20.0531C47.9908 19.7056 48.1882 19.2354 48.1927 18.7438C48.1972 18.2522 48.0084 17.7784 47.667 17.4246L45.0145 20.0746ZM23.172 47.2496L12.877 36.9496L10.2295 39.5997L20.5195 49.8996L23.172 47.2496ZM43.2545 35.7322L38.4645 37.5322L39.782 41.0446L44.577 39.2447L43.2545 35.7322ZM22.5895 21.5996L24.327 16.8621L20.807 15.5696L19.0695 20.3096L22.5895 21.5996ZM15.1095 28.4897C16.8895 27.9997 18.242 27.6547 19.3495 26.8597L17.1595 23.8147C16.727 24.1272 16.1645 24.3097 14.1145 24.8746L15.1095 28.4897ZM19.0695 20.3096C18.337 22.3096 18.107 22.8547 17.762 23.2597L20.617 25.6922C21.4995 24.6547 21.952 23.3321 22.5895 21.5996L19.0695 20.3096ZM19.3495 26.8597C19.817 26.5222 20.242 26.1297 20.617 25.6922L17.762 23.2597C17.5842 23.4682 17.3819 23.6545 17.1595 23.8147L19.3495 26.8597ZM38.4645 37.5322C36.742 38.1821 35.4295 38.6422 34.3995 39.5322L36.8545 42.3722C37.2545 42.0221 37.797 41.7872 39.7845 41.0421L38.4645 37.5322ZM35.2595 45.9996C35.822 43.9521 36.0045 43.3922 36.3145 42.9597L33.2695 40.7722C32.4745 41.8797 32.132 43.2321 31.6445 45.0071L35.2595 45.9996ZM34.3995 39.5347C33.9745 39.8997 33.5945 40.3172 33.2695 40.7722L36.3145 42.9597C36.472 42.7421 36.652 42.5446 36.8545 42.3722L34.3995 39.5347ZM12.8795 36.9446C11.2645 35.3271 10.1695 34.2271 9.45952 33.3347C8.74452 32.4371 8.67202 32.0497 8.67202 31.8772L4.92202 31.8997C4.92952 33.3547 5.65202 34.5746 6.52452 35.6697C7.39952 36.7696 8.67702 38.0447 10.227 39.5947L12.8795 36.9446ZM14.1145 24.8746C12.002 25.4597 10.2595 25.9347 8.95702 26.4597C7.65702 26.9797 6.42702 27.6847 5.70202 28.9447L8.95202 30.8147C9.03702 30.6647 9.29202 30.3647 10.352 29.9396C11.412 29.5147 12.907 29.0972 15.1095 28.4897L14.1145 24.8746ZM8.67202 31.8747C8.66908 31.503 8.76484 31.1372 8.94952 30.8147L5.70202 28.9447C5.18564 29.8434 4.91482 30.8632 4.92202 31.8997L8.67202 31.8747ZM20.5195 49.8996C22.0795 51.4596 23.362 52.7472 24.467 53.6246C25.567 54.5047 26.7945 55.2296 28.2595 55.2321L28.2645 51.4821C28.092 51.4821 27.7045 51.4096 26.802 50.6922C25.902 49.9771 24.797 48.8771 23.172 47.2496L20.5195 49.8996ZM31.6445 45.0071C31.032 47.2271 30.6145 48.7296 30.187 49.7971C29.757 50.8671 29.4545 51.1221 29.3045 51.2071L31.162 54.4646C32.437 53.7396 33.142 52.4996 33.667 51.1921C34.192 49.8821 34.672 48.1296 35.2595 45.9996L31.6445 45.0071ZM28.2595 55.2321C29.277 55.2321 30.277 54.9696 31.162 54.4646L29.3045 51.2071C28.9878 51.3881 28.6293 51.4829 28.2645 51.4821L28.2595 55.2321ZM44.577 39.2397C47.9795 37.9622 50.7345 36.9322 52.692 35.8447C54.6795 34.7447 56.2695 33.3547 56.7445 31.1572L53.0795 30.3647C52.9445 30.9897 52.4995 31.6646 50.872 32.5647C49.2145 33.4872 46.777 34.4072 43.257 35.7296L44.577 39.2397ZM41.2995 11.0496C38.7095 8.45715 36.6195 6.35965 34.812 5.01465C32.977 3.65465 31.042 2.77215 28.837 3.25965L29.647 6.91965C30.272 6.78215 31.0695 6.90715 32.577 8.02715C34.107 9.16465 35.9695 11.0196 38.647 13.7021L41.2995 11.0496ZM24.327 16.8621C25.632 13.3046 26.5395 10.8346 27.452 9.15965C28.352 7.50965 29.022 7.05965 29.647 6.91965L28.8395 3.25965C26.6345 3.74465 25.252 5.35965 24.1595 7.36465C23.082 9.34465 22.067 12.1296 20.807 15.5696L24.327 16.8621ZM52.627 28.4247C53.127 29.3122 53.187 29.8747 53.0795 30.3647L56.7445 31.1572C57.0995 29.5147 56.6995 28.0072 55.887 26.5746L52.627 28.4247ZM38.647 13.7021L45.0145 20.0746L47.667 17.4246L41.2995 11.0496L38.647 13.7021Z"
                                fill="black"
                              />
                              <path
                                d="M3.6751 53.6749C3.3439 54.0303 3.1636 54.5004 3.17217 54.9862C3.18074 55.4719 3.37752 55.9354 3.72105 56.2789C4.06458 56.6225 4.52805 56.8193 5.0138 56.8278C5.49955 56.8364 5.96967 56.6561 6.3251 56.3249L3.6751 53.6749ZM17.9601 44.6799C18.3015 44.3261 18.4903 43.8524 18.4858 43.3608C18.4813 42.8691 18.2838 42.399 17.936 42.0515C17.5882 41.704 17.1179 41.507 16.6262 41.503C16.1346 41.499 15.6611 41.6882 15.3076 42.0299L17.9601 44.6799ZM6.3251 56.3249L17.9601 44.6799L15.3076 42.0299L3.6701 53.6749L6.3251 56.3249Z"
                                fill="black"
                              />
                            </svg>
                          </div>

                          <div className="tooltip tooltip-left" data-tip={clip.keyword}>
                            <img
                              src={`https://cataas.com/cat/cute?${"" + meeting.id + clip.id}`}
                              className="h-full w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <hr className="bg-subpuple col-start-1" />
                  </li>
                ))}
              </ul>
            </div>

            {/* 메모 영역 */}
            <div className="flex justify-end items-center">
              <motion.div
                className="w-[17vw] relative"
                whileHover={{ scale: 1.2 }}
                onClick={showMemo}
              >
                <div className="max-w-full h-full grid grid-rows-6 justify-center absolute">
                  <div className="text-[1vw] text-center row-start-2 max-w-full">
                    <span>Memo</span>
                  </div>
                  <div
                    className="row-start-3 row-span-2 max-w-[17vw] w-[17vw] text-center  px-[4vw] text-[0.8vw]"
                    style={{
                      whiteSpace: "pre-line",
                      wordWrap: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {memo.content}
                  </div>
                </div>
                <img className="w-full" src={MemoImg} alt="MemoImg" />
              </motion.div>
            </div>
          </div>
        </div>
        <div>
          <img className="w-full" src={dailyImg} alt="" />
        </div>
      </NavModal>
      <AnimatePresence>
        {openChatModal && (
          <ChatModal onClose={closeChatModal} myId={myId} chats={chats}></ChatModal>
        )}
        {openMemoModal && (
          <Modal onClose={closeMemoModal} dialogCss="w-[30vw] h-[60vh] bg-skyblue p-5 rounded-2xl">
            <div></div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default DiaryDailyPage;
