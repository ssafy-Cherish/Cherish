import Question from "./Question";


export default function TodayQuestionBox() {
  return (
    <>
    <div id='TodayQuestionBox' className="mt-[1vw] h-[29vw] rounded-[20px] overflow-y-auto">
      <Question reply={false}/>
      <Question reply={true}/>
      <Question reply={true}/>
    </div>
    </>
  )
}