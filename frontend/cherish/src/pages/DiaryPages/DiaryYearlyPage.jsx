import Modal from "../../components/Diary/Modal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useAnimate } from "framer-motion";
import yearlyImg from "../../assets/DiaryYearlyPage.svg";

import Month1 from "../../assets/Month/Month1.svg";
import Month2 from "../../assets/Month/Month2.svg";
import Month3 from "../../assets/Month/Month3.svg";
import Month4 from "../../assets/Month/Month4.svg";
import Month5 from "../../assets/Month/Month5.svg";
import Month6 from "../../assets/Month/Month6.svg";
import Month7 from "../../assets/Month/Month7.svg";
import Month8 from "../../assets/Month/Month8.svg";
import Month9 from "../../assets/Month/Month9.svg";
import Month10 from "../../assets/Month/Month10.svg";
import Month11 from "../../assets/Month/Month11.svg";
import Month12 from "../../assets/Month/Month12.svg";

const MonthArr = [
  Month1,
  Month2,
  Month3,
  Month4,
  Month5,
  Month6,
  Month7,
  Month8,
  Month9,
  Month10,
  Month11,
  Month12,
];

const DiaryYearlyPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scope, animate] = useAnimate();
  let year = searchParams.get("year");
  if (!year) year = new Date().getFullYear();

  function moveYear(move) {
    animate("#year", { y: [0, -5, 5, 0] }, { duration: 0.2 });
    animate("#month", { opacity: [1, 0, 1] });
    year = +year + move;
    searchParams.set("year", year);
    setSearchParams(searchParams);
  }

  function moveToMonth(month) {
    navigate({ pathname: "/diary/month", search: `?year=${year}&month=${month}` });
  }

  return (
    <Modal z={1} height="90vh" width="70vw">
      <div className="h-[90vh] w-[70vw] my-auto absolute -z-10">
        <img src={yearlyImg} alt="" />
      </div>
      <div className="h-full w-full grid grid-rows-12 grid-cols-12 px-[10%] py-10" ref={scope}>
        <div className="text-[2vw] text-red-400 text-center row-span-1 col-span-12">
          <button onClick={() => moveYear(-1)}>&lt;</button>
          <div id="year" className="inline-block text-[2vw]">
            &nbsp;{year}&nbsp;
          </div>
          <button onClick={() => moveYear(1)}>&gt;</button>
        </div>
        <div className="grid grid-cols-3 gap-x-[1vw] gap-y-[1vw] row-span-11 col-span-8 col-start-3 px-[10%]">
          {MonthArr.map((src, i) => (
            <div key={src}>
              <motion.img
                id="month"
                src={src}
                alt={src}
                whileHover={{ scale: 1.2 }}
                className="mx-auto"
                onClick={() => moveToMonth(i + 1)}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DiaryYearlyPage;
