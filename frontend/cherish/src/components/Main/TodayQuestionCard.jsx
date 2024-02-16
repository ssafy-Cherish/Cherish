import { motion } from "framer-motion";
import MainBookmarkIcon from "../../assets/Main/MainBookmarkIcon.svg";
import useCoupleStore from "../../stores/useCoupleStore";

export default function TodayQuestionCard() {
  const { question } = useCoupleStore();
  const boxVariants = {
    hover: {
      // 내부 div에 적용할 변형을 정의
      backgroundColor: "#FECFCD", // 예시로 빨간색으로 변경
    },
  };
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }}
        variants={boxVariants}
        className="flex relative ml-[5vw] w-[40vw] h-[7vw]"
      >
        <div className="bg-pink w-[36vw] h-[5vw] rounded-[20px] flex items-center">
          <p className="text-[1.2vw] font-bold text-text-gray ml-[1vw]">
            오늘의 질문?
          </p>
          <p className="text-[1vw] text-text-black ml-[1vw] w-[23vw]">
            {question?.content}
          </p>
        </div>
        <div className="absolute left-[80%] -top-[20%]">
          <img src={MainBookmarkIcon} alt="" />
        </div>
      </motion.div>
    </>
  );
}
