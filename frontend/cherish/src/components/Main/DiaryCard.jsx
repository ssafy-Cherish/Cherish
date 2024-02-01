import DiaryImg from "../../assets/DiaryImg.svg";

export default function DiaryCard() {
  return (
    <>
      <div className="mt-[1vw]">
        <img src={DiaryImg} alt="DiaryImg" />
      </div>
      <p className="mt-[1vw] text-[1.2vw]">다이어리</p>
    </>
  );
}
