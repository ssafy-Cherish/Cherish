import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { default as NavModal } from "../../components/Common/Modal";
import dayjs from "dayjs";
import dailyImg from "../../assets/diary/DiaryDailyPage.svg";
import "../../components/Diary/DiaryDailyPage.css";
import ChatModal from "../../components/Diary/ChatModal";
import MemoModal from "../../components/Diary/MemoModal";
import MemoImg from "../../assets/MemoImg.svg";
import chatImg from "../../assets/diary/chat.svg";
import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";
import { useQuery } from "@tanstack/react-query";
import { dailyFetch, getMemoFetch } from "../../services/diaryService";
import Pin from "../../assets/diary/pin.svg?react";

const DiaryDailyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scope, animate] = useAnimate();
  const navigate = useNavigate();
  let year = searchParams.get("year");
  let month = searchParams.get("month");
  let day = searchParams.get("day");
  const date = new Date(year, +month - 1, day);
  const dateFormat = dayjs(date).format("YYYY-MM-DD");

  // 로그인한 사용자의 카카오 아이디
  const { kakaoId: myId } = useUserStore();
  const { anniversary, coupleId } = useCoupleStore();

  // 채팅 기록 모달 ON, OFF
  const [openChatModal, setOpenChatModal] = useState(false);

  // 메모 모달 ON, OFF
  const [openMemoModal, setOpenMemoModal] = useState(false);

  // Modal에 전달할 채팅 기록
  const [chats, setChats] = useState([]);

  // memo 내용
  const [memo, setMemo] = useState("");

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
    animate(`#pin${clipId}`, { x: [0, -5, 0], y: [0, 5, 0] }, { duration: 0.3 });
    // const tmpMeetings = [...meetings];
    // tmpMeetings[mIdx].clips = tmpMeetings[mIdx].clips.map((clip) => {
    //   const tmp = { ...clip };
    //   if (tmp.id === clipId) tmp.isPinned = !tmp.isPinned;
    //   return tmp;
    // });
    // console.log(tmpMeetings);
    // setMeetings(tmpMeetings);
    // isPin upadte 쿼리
  }

  const { data: meetings } = useQuery({
    queryKey: ["meetings", year, month, day],
    queryFn: () => dailyFetch(coupleId, dateFormat),
    staleTime: 60000,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data.meeting;
    },
  });

  const { data: memoData } = useQuery({
    queryKey: ["memo", dateFormat],
    queryFn: () => getMemoFetch(coupleId, dateFormat),
    staleTime: 0,
    select: (data) => {
      return data.memo;
    },
  });

  useEffect(() => {
    if (memoData) {
      setMemo(memoData.content);
    }
  }, [memoData]);

  function handleMemoData(content) {
    setMemo(content);
  }

  return (
    <>
      <NavModal z={1} modalcss="h-[90vh] w-[70vw] bg-transparent" isX={false} nav="/">
        <div
          className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[50vw] items-center"
          ref={scope}
        >
          {/* 선택한 날짜와 며칠째인지 나오는 곳 */}
          <div className="me-auto">
            <motion.div
              className="text-[1vw] hover:cursor-pointer"
              onClick={moveToMonthly}
              whileHover={{ scale: 1.2, x: "10%", fontWeight: [100, 600] }}
              transition={{ duration: 0.2 }}
            >
              {dayjs(date).format("YYYY년 MM월 DD일")}
            </motion.div>
            <div className="text-[2vw]">
              {dayjs(date).diff(anniversary, "day") + 1 > 0 ? (
                <>
                  <span className="text-cherry">{dayjs(date).diff(anniversary, "day") + 1}</span>
                  <span>일째의 우리</span>
                </>
              ) : (
                <span>만나기 전의 우리</span>
              )}
            </div>
          </div>

          {/* 미팅 타임라인, 채팅, 메모 */}
          <div className="grid grid-cols-3 w-full gap-6">
            {/* 미팅 타임라인 */}
            <div className="me-auto relative col-span-2 w-full">
              <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical  overflow-y-auto h-[35vw] rmscroll">
                {meetings && meetings.length > 0 ? (
                  meetings.map((meeting, mIdx) => (
                    // <MeetingTimeline key={meeting.id} meeting={meeting} />
                    <li key={meeting.id} className="grid-cols-[10%_90%] col-span-2">
                      <div className="timeline-middle col-start-1">
                        <div className="rounded-full bg-subpuple w-[1vw] h-[1vw]"></div>
                      </div>
                      <div className="timeline-end m-0 w-full" style={{ gridColumnStart: 2 }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[1.5vw]">
                            {dayjs(meeting.createdAt).format("A hh : mm")}
                          </span>
                          <button
                            className="btn rounded-full bg-pink shadow-lg w-[9vw] grid grid-cols-[30%_70%] justify-between items-center"
                            onClick={() => showChat(meeting.chats)}
                          >
                            <img src={chatImg} alt="" className="w-[70%]" />
                            <span className="text-[0.8vw]">채팅 기록</span>
                          </button>
                        </div>
                        {meeting.clips > 0 ? (
                          meeting.clips.map((clip) => (
                            <div key={clip.id} className="h-1/3 mb-5 flex flex-col justify-center">
                              <div className="flex flex-row justify-center z-30">
                                <motion.Pin
                                  className="absolute -mt-[1vh] hover:cursor-pointer"
                                  whileHover={{ scale: 1.2 }}
                                  onClick={() => togglePinned(clip.id, mIdx)}
                                ></motion.Pin>
                              </div>
                              <div
                                className="tooltip tooltip-bottom mb-[2vw]"
                                data-tip={`"${clip.keyword}"`}
                              >
                                <video src="" className="h-full w-full bg-slate-400" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="text-[2vw]">저장된 클립이 없어요.. ㅠㅠ</div>
                          </>
                        )}
                      </div>
                      <hr className="bg-subpuple col-start-1" />
                    </li>
                  ))
                ) : (
                  <>
                    <div className="text-[2vw]">
                      는 <span className="text-cherry">체리콜</span>을 하지 않았어요..
                    </div>
                  </>
                )}
              </ul>
            </div>

            {/* 메모 영역 */}
            <div className="flex justify-end items-center">
              <motion.div
                className="w-[17vw] relative hover:cursor-pointer"
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
                    {memo || "작성된 메모가 없숩니다."}
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
          <MemoModal
            onClose={closeMemoModal}
            memo={memo}
            handleMemoData={handleMemoData}
            coupleId={coupleId}
            date={dateFormat}
          ></MemoModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default DiaryDailyPage;
