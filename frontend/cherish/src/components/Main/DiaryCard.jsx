import DiaryImg from "../../assets/DiaryImg.svg";

export default function DiaryCard() {
  return (
    <>
      <div className="mt-[1vw]">
        <img src={DiaryImg} alt="DiaryImg" />
      </div>
      <p className="text-[1.2vw] text-text-black mb-[0.5vw]">다이어리</p>
    </>
  );
}
