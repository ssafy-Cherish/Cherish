import MainLogo from "../../assets/Main/MainLogo.svg";
import CherryCallIcon from "../../assets/Main/CherryCallIcon.svg?react";
import DiaryIcon from "../../assets/Main/DiaryIcon.svg?react";
import GalleryIcon from "../../assets/Main/GalleryIcon.svg?react";
import PotIcon from "../../assets/Main/PotIcon.svg?react";
import QuestionIcon from "../../assets/Main/QuestionIcon.svg?react";
import { Link, NavLink } from "react-router-dom";
import UserInfo from "../Main/UserInfo";

export default function NavBar() {
  const navbarcss =
    "flex justify-start gap-8 mx-[2.4rem] text-text-gray hover:text-cherry hover:fill-cherry fill-text-gray";
  const navbarcssActive =
    "flex justify-start gap-8 mx-[2.4rem] text-cherry fill-cherry";
  return (
    <div className="col-span-2 h-screen bg-beige relative">
      <Link to="/">
        <div className="ml-16">
          <img src={MainLogo} alt="MainLogo" />
        </div>
      </Link>
      <UserInfo />
      <div
        className="grid gird-rows-6 gap-[3vw] mt-[192px] bg-beige"
        id="네브바메인"
      >
        <NavLink
          to="cherrycall"
          className={({ isActive }) => (isActive ? navbarcssActive : navbarcss)}
        >
          <CherryCallIcon />
          <p
            className="
                text-[1.7rem]
                font-bold"
          >
            체리콜
          </p>
        </NavLink>
        <NavLink
          to="diary"
          className={({ isActive }) => (isActive ? navbarcssActive : navbarcss)}
        >
          <DiaryIcon />
          <p
            className="
                text-[1.75rem]
                font-bold"
          >
            다이어리
          </p>
        </NavLink>
        <NavLink
          to="pot"
          className={({ isActive }) => (isActive ? navbarcssActive : navbarcss)}
        >
          <PotIcon />
          <p
            className="
                text-[1.75rem]
                font-bold"
          >
            화분
          </p>
        </NavLink>
        <NavLink
          to="today"
          className={({ isActive }) => (isActive ? navbarcssActive : navbarcss)}
        >
          <QuestionIcon />
          <p
            className="
                text-[1.75rem]
                font-bold"
          >
            오늘의질문
          </p>
        </NavLink>
        <NavLink
          to="cherrybox"
          className={({ isActive }) => (isActive ? navbarcssActive : navbarcss)}
        >
          <GalleryIcon />
          <p
            className="
                text-[1.75rem]
                font-bold"
          >
            체리보관함
          </p>
        </NavLink>
      </div>
    </div>
  );
}
