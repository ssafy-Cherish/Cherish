import { useState } from "react";
import test from "../../assets/test.png";
export default function Answer({ answer }) {
  const [selectName, setSelectName] = useState(null);

  const handleSelectName = (name) => {
    setSelectName((pre) => name);
  };
  return (
    <>
      <div className="col-span-10 h-[20vw] flex flex-col items-center">
        <div className="flex flex-row justify-center">
          <button
            onClick={() => handleSelectName(answer[0]?.nickname)}
            className={
              "m-[1vw] text-[1.2vw] " +
              (selectName === answer[0]?.nickname && "text-cherry")
            }
          >
            {answer[0]?.nickname}
          </button>
          <button
            onClick={() => handleSelectName(answer[1]?.nickname)}
            className={
              "m-[1vw] text-[1.2vw] " +
              (selectName === answer[1]?.nickname && "text-cherry")
            }
          >
            {answer[1]?.nickname}
          </button>
        </div>
        <div className="w-[28vw]">
          {selectName === answer[0]?.nickname ? (
            <img className="w-full rounded-lg" src={test} alt="" />
          ) : (
            <img className="w-full rounded-lg" src={test} alt="" />
          )}
        </div>
      </div>
    </>
  );
}
