import { useSearchParams } from "react-router-dom";
import monthlyImg from "../../assets/DiaryMonthlyPage.svg";
import Modal from "../../components/Diary/Modal";
import Calendar from "react-calendar";
import "../../components/Diary/Calendar.css";
import moment from "moment";
import { useState } from "react";
import highlight from "../../assets/paintingLine.svg";
import { motion } from "framer-motion";

const DiaryMonthlyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let year = searchParams.get("year");
  let month = searchParams.get("month");
  const date = new Date(year, month - 1);

  const [meetingDates, setMeetingDate] = useState([
    "2024-1-4",
    "2024-1-10",
    "2024-1-11",
    "2024-1-16",
  ]);

  return (
    <Modal z={1} height="90vh" width="70vw">
      <div className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[45vw] items-center">
        <div className="w-[10vw] me-auto my-[2vw]">
          <span className="text-zinc-700 text-[2vw] font-bold block">{year}</span>
          <span className="text-[#FD8680] text-[4vw] font-bold" style={{ lineHeight: "80%" }}>
            {moment(date).format("MM")}
          </span>
        </div>
        <Calendar
          value={date}
          formatDay={(locale, date) => moment(date).format("D")}
          formatMonthYear={(locale, date) => moment(date).format("YYYY MM")}
          minDetail="month"
          maxDetail="month"
          locale="en-US"
          calendarType="gregory"
          showNeighboringMonth={false}
          tileClassName={({ date, view }) => {
            if (meetingDates.find((x) => x === moment(date).format("YYYY-M-D"))) {
              return "highlight";
            }
          }}
          tileContent={({ date, view }) => {
            if (meetingDates.find((x) => x === moment(date).format("YYYY-M-D"))) {
              return (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <img
                      src={highlight}
                      alt=""
                      className="absolute w-full"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </motion.div>
                </>
              );
            }
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
