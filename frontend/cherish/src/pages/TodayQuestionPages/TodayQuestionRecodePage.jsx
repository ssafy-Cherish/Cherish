import Modaltest from "../../components/Common/ModalTest";
export default function TodayQuestionRecodePage() {
  const date = new Date()
  console.log(date)

  return (
    <Modaltest modalcss="w-[49.5vw] h-[85vh] bg-pink rounded-[40px]" isX={true}>
      test
    </Modaltest>
  );
}
