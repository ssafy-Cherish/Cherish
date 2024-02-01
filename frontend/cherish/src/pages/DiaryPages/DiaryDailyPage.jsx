import { useNavigate, useSearchParams } from "react-router-dom";
import { useAnimate } from "framer-motion";
import { useState } from "react";
import Modal from "../../components/Diary/Modal";
import MeetingTimeline from "../../components/Diary/MeetingTimeline";
import dayjs from "dayjs";
import dailyImg from "../../assets/DiaryDailyPage.svg";
import "./DiaryDailyPage.css";

const DiaryDailyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scope, animate] = useAnimate();
  const navigate = useNavigate();
  let year = searchParams.get("year");
  let month = searchParams.get("month");
  let day = searchParams.get("day");
  const date = new Date(year, +month - 1, day);

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
    {
      id: 2,
      craetedAt: "14 : 00",
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

  return (
    <Modal z={1} height="90vh" width="70vw">
      <div
        className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[45vw] items-center"
        ref={scope}
      >
        {/* 선택한 날짜와 며칠째인지 나오는 곳 */}
        <div className="me-auto">
          <div className="text-[1vw]">{dayjs(date).format("YYYY년 MM월 DD일")}</div>
          <div className="text-[2vw]">
            <span className="text-cherry">{dayjs(date).diff(anniversary, "day") + 1}</span>
            <span>일째의 우리</span>
          </div>
        </div>

        {/* 미팅 타임라인, 채팅 등 */}
        <div className="grid grid-cols-2 w-full">
          {/* 미팅 타임라인 */}
          <div className="me-auto relative">
            <ul
              className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical  overflow-y-auto h-[35vw]"
              id="dailyTimeline"
            >
              {meetings.map((meeting) => (
                // <MeetingTimeline key={meeting.id} meeting={meeting} />
                <li key={meeting.id} className="grid grid-cols-2 gap-5">
                  <div className="timeline-middle">
                    <div className="rounded-full bg-subpuple w-[1vw] h-[1vw]"></div>
                  </div>
                  <div className="timeline-end">
                    <div className="flex justify-between items-center">
                      {dayjs(meeting.craetedAt).format("A HH : mm")}
                      <button className="btn rounded-full" onClick={() => showChat(meeting.chats)}>
                        [채팅 기록]
                      </button>
                    </div>
                    {meeting.clips.map((clip) => (
                      <div key={clip.id} className="h-1/3 mb-5 flex justify-center">
                        <img
                          src={`https://cataas.com/cat/cute?${clip.id}`}
                          alt=""
                          className="h-full w-full"
                        />
                      </div>
                    ))}
                  </div>
                  <hr className="bg-subpuple" />
                </li>
              ))}
            </ul>
          </div>

          {/* 메모 영역 */}
          <div>asdasd</div>
        </div>
      </div>
      <div>
        <img className="w-full" src={dailyImg} alt="" />
      </div>
    </Modal>
  );
};

export default DiaryDailyPage;
