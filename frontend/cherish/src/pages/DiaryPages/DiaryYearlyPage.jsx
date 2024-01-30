import Modal from "../../components/Diary/Modal";
import yearlyImg from "../../assets/DiaryYearlyPage.svg";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useAnimate } from "framer-motion";

const DiaryYearlyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scope, animate] = useAnimate();
  let year = searchParams.get("year");
  if (!year) year = new Date().getFullYear();

  const nums = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const numColor = [
    "shadow-cyan-500/50",
    "shadow-orange-500/50",
    "shadow-blue-500/50",
    "shadow-red-500/50",
  ];

  function moveYear(move) {
    animate("#year", { y: [0, -5, 5, 0] }, { duration: 0.2 });
    year = +year + move;
    searchParams.set("year", year);
    setSearchParams(searchParams);
  }

  return (
    <Modal img={yearlyImg} z={1} height="90vh" width="auto">
      <div style={{ margin: "1rem 30%" }}>
        <div className="text-[3vw] text-red-400 text-center" ref={scope}>
          <button onClick={() => moveYear(-1)}>&lt;</button>
          <div id="year" className="inline-block text-[2vw]">
            &nbsp;{year}&nbsp;
          </div>
          <button onClick={() => moveYear(1)}>&gt;</button>
        </div>
        <div className="grid grid-cols-3 gap-x-3 gap-y-6">
          {nums.map((num) => (
            <Link key={num} to={{ pathname: `/diary/month`, search: `?year=${year}&month=${num}` }}>
              <motion.button whileHover={{ scale: 1.2 }}>
                <div className="w-[186px] h-44 left-0 top-0 relative ">
                  <div
                    className={`w-[186px] h-44 left-0 top-0 absolute bg-white rounded-[30px] border border-neutral-400 shadow-md ${
                      numColor[parseInt((Number(num) % 12) / 3)]
                    }`}
                  />
                  <div className="left-[32px] top-[25px] absolute text-center text-black text-[48px] font-light font-['Gluten']">
                    {num}
                  </div>
                  <div className="w-[49px] h-[0px] left-[93px] top-[66px] absolute border border-neutral-400"></div>
                  <div className="w-[99.02px] h-[0px] left-[43px] top-[94px] absolute border border-neutral-400"></div>
                  <div className="w-[75px] h-[0px] left-[43px] top-[139px] absolute border border-neutral-400"></div>
                  <div className="w-[99.02px] h-[0px] left-[43px] top-[118px] absolute border border-neutral-400"></div>
                </div>
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DiaryYearlyPage;
