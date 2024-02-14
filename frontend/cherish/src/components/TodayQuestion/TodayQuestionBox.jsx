import useUserStore from "../../stores/useUserStore";
import Question from "./Question";

export default function TodayQuestionBox({
  handleClickIsQuestionBoxOpen,
  ansList,
  handleIsAnswered,
}) {
  const { kakaoId, nickname } = useUserStore();
  //나중에 카카오아이디로 수정하기 밑에 if 문

  const questionList = ansList.answerList.map((answer, idx) => {
    if (idx === 0) {
      if (ansList.answercnt === 0) {
        return (
          <Question
            handleIsAnswered={handleIsAnswered}
            key={answer[0].content}
            answer={answer}
            reply={0}
            handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen}
          />
        );
      } else if (ansList.answercnt === 1) {
        if (answer[0]?.nickname === nickname) {
          return (
            <Question
              handleIsAnswered={handleIsAnswered}
              key={answer[0].content}
              answer={answer}
              reply={1}
              handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen}
            />
          );
        } else {
          return (
            <Question
              handleIsAnswered={handleIsAnswered}
              key={answer[0].content}
              answer={answer}
              reply={0}
              handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen}
            />
          );
        }
      } else {
        return (
          <Question
            key={answer[0].content}
            handleIsAnswered={handleIsAnswered}
            answer={answer}
            reply={2}
            handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen}
          />
        );
      }
    } else {
      return (
        <Question
          key={answer[0].content}
          handleIsAnswered={handleIsAnswered}
          answer={answer}
          reply={2}
          handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen}
        />
      );
    }
  });

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
