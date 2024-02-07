import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import Modal from "../../components/Common/Modal";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import highlight from "../../assets/diary/paintingLine.svg";
import monthlyImg from "../../assets/diary/DiaryMonthlyPage.svg";
import Cake from "../../assets/diary/Cake.svg";
import useCoupleStore from "../../stores/useCoupleStore";
import "../../components/Diary/Calendar.css";
import { useQuery } from "@tanstack/react-query";
import { meetingFetch } from "../../services/diaryService";

const DiaryMonthlyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scope, animate] = useAnimate();
  const { anniversary, userInfos, coupleId } = useCoupleStore();

  const navigate = useNavigate();
  let year = searchParams.get("year");
  let month = searchParams.get("month");
  const date = new Date(year, month - 1);

  // 생일
  const birthdays = userInfos.map((item) => dayjs(item.birthday).format("M-D"));

  // 각 특별한 날에 해당하는 날짜들을 모아서 식별하기 위한 배열
  const highlights = [...birthdays, dayjs(anniversary).format("M-D")];

  // 달 이동 함수
  function moveMonth(move) {
    let mvMonth = +month + move;
    let mvYear = year;
    if (mvMonth == 0) {
      mvMonth = 12;
      mvYear--;
    } else if (mvMonth == 13) {
      mvMonth = 1;
      mvYear++;
    }

    animate("#year", { x: [0, -5, 5, 0] }, { duration: 0.3 });
    animate(".react-calendar__month-view__days", { opacity: [0.2, 1] }, { duration: 1 });
    searchParams.set("year", mvYear);
    searchParams.set("month", mvMonth);
    setSearchParams(searchParams, { replace: true });
  }

  // daily로 화면 이동
  function moveToDay(date) {
    navigate({
      pathname: "/diary/day",
      search: `?year=${date.getFullYear()}&month=${+date.getMonth() + 1}&day=${date.getDate()}`,
    });
  }

  function moveToYearly(year) {
    navigate({
      pathname: "/diary/year",
      search: `?year=${year}`,
    });
  }

  function setImage(src, className, style, date) {
    return (
      <div key={`${date}${src}`}>
        <img
          src={src}
          className={className}
          style={{
            ...style,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    );
  }

  const { data: meetingDates } = useQuery({
    queryKey: ["meetingDates", year, month],
    queryFn: () => meetingFetch(coupleId, dayjs(date).format("YYYY-MM")),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  return (
    // Diary 재사용 모달
    <Modal z={1} modalcss="h-[90vh] w-[70vw]" isX={false} nav="/">
      <div
        className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[45vw] items-center"
        ref={scope}
      >
        {/* MonthYear */}
        <div className="grid grid-cols-[10%_80%_10%] w-[15vw] me-auto justify-center items-center">
          <div>
            <motion.button
              className="text-[3vw] text-[#FD8680] font-bold"
              onClick={() => moveMonth(-1)}
              whileHover={{ scale: 1.2 }}
            >
              &lt;
            </motion.button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className="text-zinc-700 text-[2vw] font-bold block hover:cursor-pointer"
              id="year"
              onClick={() => moveToYearly(year)}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            >
              {year}
            </motion.div>
            <div className="text-[#FD8680] text-[4vw] font-bold" id="month">
              {dayjs(date).format("MM")}
            </div>
          </div>
          <div>
            <motion.button
              className="text-[3vw] text-[#FD8680] font-bold"
              onClick={() => moveMonth(1)}
              whileHover={{ scale: 1.2 }}
            >
              &gt;
            </motion.button>
          </div>
        </div>

        {/* react-calendar 컴포넌트 */}
        <Calendar
          value={date}
          onChange={moveToDay}
          formatDay={(locale, date) => dayjs(date).format("D")}
          minDetail="month"
          maxDetail="month"
          locale="en-US"
          showNeighboringMonth={false}
          tileClassName={({ date }) => {
            if (highlights.find((x) => x === dayjs(date).format("M-D"))) {
              return "relative";
            }
            if (meetingDates && meetingDates.find((x) => x === dayjs(date).format("YYYY-MM-DD"))) {
              return "relative";
            }
          }}
          tileContent={({ date }) => {
            let html = [];

            if (meetingDates && meetingDates.find((x) => x === dayjs(date).format("YYYY-MM-DD"))) {
              html.push(
                setImage(
                  highlight,
                  "absolute w-full",
                  {
                    top: "50%",
                    left: "50%",
                  },
                  date
                )
              );
            }

            if (highlights.find((x) => x === dayjs(date).format("M-D"))) {
              html.push(
                setImage(
                  Cake,
                  "absolute w-1/5",
                  {
                    top: "15%",
                    left: "50%",
                  },
                  date
                )
              );
            }

            return (
              <>
                {html.length > 0 && (
                  <motion.div
                    variants={{
                      init: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    initial="init"
                    animate="visible"
                  >
                    {html}
                  </motion.div>
                )}
              </>
            );
          }}
        ></Calendar>
      </div>
      <div>
        <img className="w-full" src={monthlyImg} alt="" />
      </div>
    </Modal>
  );
};

export default DiaryMonthlyPage;
