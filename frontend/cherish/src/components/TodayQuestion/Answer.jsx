import test from "../../assets/test.png";
export default function Answer() {
  return (
    <>
      <div className="col-span-10 h-[20vw] flex flex-col items-center">
        <div className="flex flex-row justify-center">
          <button className="m-[1vw] text-[1.2vw]">나희도</button>
          <button className="m-[1vw] text-[1.2vw]">백이진</button>
        </div>
        <div className="w-[28vw]">
          <img className="w-full rounded-lg" src={test} alt="" />
        </div>
      </div>
    </>
  );
}
