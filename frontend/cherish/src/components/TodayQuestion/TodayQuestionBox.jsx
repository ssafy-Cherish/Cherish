import useUserStore from "../../stores/useUserStore";
import Question from "./Question";

export default function TodayQuestionBox({
  handleClickIsQuestionBoxOpen,
  ansList,
}) {
  const {kakaoId} = useUserStore()
  
  const questionList = ansList.answerList.map((answer, idx) => {
    if (idx === 0) {
      if (ansList.answercnt === 0) {
        return <Question reply={0} handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen} />
      } else if (ansList.answercnt === 1) {
        if (answer?.kakao_id === kakaoId) {
          return <Question reply={1} handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen} />
        } else {
          return <Question reply={0} handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen} />
        }
      } else {
        return<Question answer={answer} reply={2} handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen} />
      }
    }
  })

  return (
    <>
      <div
        id="TodayQuestionBox"
        className="mt-[1vw] h-[29vw] rounded-[20px] overflow-y-auto"
      >
        {questionList}
      </div>
    </>
  );
}
