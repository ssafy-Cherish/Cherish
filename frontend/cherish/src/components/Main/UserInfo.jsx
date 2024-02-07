import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";
import ProfileIcon from "../../assets/ProfileIcon.svg";
import DropdownIcon from "../../assets/DropdownIcon.svg";
import { useState } from "react";
import { motion } from "framer-motion";

export default function UserInfo() {
  const { coupleId, anniversary, userInfos } = useCoupleStore();
  const { nickname } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const userInfo = userInfos.filter((info) => {
    return info.nickname === nickname;
  });
  const info = userInfo[0].birthday.split("-");
  const anni = anniversary.split("-");

  const handleClickIsOpen = () => {
    setIsOpen((pre) => !pre);
  };

  let keywordClassName = `left-[2%] transition-[height] absolute w-[18rem] duration-500 bg-white my-[65px]  text-[1.5rem] rounded-[40px] shadow-md text-center ${
    isOpen
      ? " h-[365px] z-20  flex flex-col rounded-[15px] overflow-y-auto"
      : " h-[4vw]"
  }`;

  return (
    <>
      <div
        id="keyword"
        onClick={handleClickIsOpen}
        className={keywordClassName}
      >
        <div
          className={
            "w-[80%] grid grid-cols-5 ml-[2rem] mt-[1vw] " +
            (isOpen ? "border-b-2 border-text-gray pb-[10px]" : "")
          }
        >
          <img className="col-span-1" src={ProfileIcon} alt="ProfileIcon" />
          <p className="col-span-3 my-auto text-text-black">{nickname}</p>
          <img
            className={"col-span-1 w-[2vw] my-auto " + (isOpen && 'rotate-180') }
            src={DropdownIcon}
            alt="DropdownIcon"
          />
        </div>
        {isOpen && (
          <>
            <div className="my-[48px] text-text-black flex flex-col items-start ml-[15px]">
              <p className="mb-[8px]">애칭 : {nickname}</p>
              <p className="mb-[8px]">
                생일 : {info[0]}년 {info[1][0] === "0" ? info[1][1] : info[1]}월{" "}
                {info[2][0] === "0" ? info[2][1] : info[2]}일
              </p>
              <p>
                만남 : {anni[0]}년 {anni[1][0] === "0" ? anni[1][1] : anni[1]}월{" "}
                {anni[2][0] === "0" ? anni[2][1] : anni[2]}일
              </p>
            </div>
            <div className="flex justify-around mt-[32px] text-text-black">
              <button>정보수정</button>
              <button>로그아웃</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
