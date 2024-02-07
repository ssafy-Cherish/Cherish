import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";
import ProfileIcon from "../../assets/Main/ProfileIcon.svg";
import DropdownIcon from "../../assets/Common/DropdownIcon.svg";
import { useState } from "react";
import dayjs from "dayjs";
export default function UserInfo() {
  const { anniversary, userInfos } = useCoupleStore();
  const { nickname } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const userInfo = userInfos.filter((info) => {
    return info.nickname === nickname;
  });
  const anni = dayjs(anniversary).format("YYYY년 M월 D일");
  const info = dayjs(userInfo[0].birthday).format("YYYY년 M월 D일");

  const handleClickIsOpen = () => {
    setIsOpen((pre) => !pre);
  };

  let userInfoClassName = `left-[2%] transition-[height] duration-500 absolute w-[18rem]  bg-white my-[65px]  text-[1.5rem] rounded-[40px] shadow-md text-center ${
    isOpen
      ? " h-[365px] z-[1]  flex flex-col rounded-[15px] overflow-y-auto"
      : " h-[4vw]"
  }`;

  return (
    <>
      <div
        id="userInfo"
        onClick={handleClickIsOpen}
        className={userInfoClassName}
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
            className={"col-span-1 w-[2vw] my-auto " + (isOpen && "rotate-180")}
            src={DropdownIcon}
            alt="DropdownIcon"
          />
        </div>
        {isOpen && (
          <>
            <div className="my-[48px] text-text-black flex flex-col items-start ml-[15px]">
              <p className="mb-[8px]">애칭 : {nickname}</p>
              <p className="mb-[8px]">생일 : {info}</p>
              <p>만남 : {anni}</p>
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
