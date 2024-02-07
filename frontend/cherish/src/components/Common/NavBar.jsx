import MainLogo from "../../assets/MainLogo.svg";
import CherryCallIcon from "../../assets/CherryCallIcon.svg";
import DiaryIcon from "../../assets/DiaryIcon.svg";
import GalleryIcon from "../../assets/GalleryIcon.svg";
import PotIcon from "../../assets/PotIcon.svg";
import QuestionIcon from "../../assets/QuestionIcon.svg";
import DropdownIcon from "../../assets/DropdownIcon.svg";
import ProfileIcon from "../../assets/ProfileIcon.svg";
import { Link } from "react-router-dom";
import UserInfo from "../Main/UserInfo";

export default function NavBar() {
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
        <div className="flex justify-start min-w-[245px] gap-8 mx-[2.4rem]">
          <div>
            <img src={CherryCallIcon} alt="CherryCallIcon" />
          </div>
          <p
            className="text-neutral-400
                text-[1.7rem]
                font-bold"
          >
            체리콜
          </p>
        </div>
        <div className="flex justify-start gap-8 mx-[2.4rem]">
          <img src={DiaryIcon} alt="DirayIcon" />
          <p
            className="text-neutral-400
                text-[1.75rem]
                font-bold"
          >
            다이어리
          </p>
        </div>
        <div className="flex justify-start gap-8 mx-[2.4rem]">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="Vector"
              d="M0 22.8571C0 27.4037 2.10714 31.7641 5.85786 34.979C9.60859 38.1939 14.6957 40 20 40C20 30.4762 11.0444 22.8571 0 22.8571ZM20 8.57143C21.4734 8.57143 22.8865 9.07313 23.9284 9.96616C24.9702 10.8592 25.5556 12.0704 25.5556 13.3333C25.5556 14.5963 24.9702 15.8075 23.9284 16.7005C22.8865 17.5935 21.4734 18.0952 20 18.0952C18.5266 18.0952 17.1135 17.5935 16.0716 16.7005C15.0298 15.8075 14.4444 14.5963 14.4444 13.3333C14.4444 12.0704 15.0298 10.8592 16.0716 9.96616C17.1135 9.07313 18.5266 8.57143 20 8.57143ZM5.77778 17.619C5.77778 18.882 6.36309 20.0932 7.40496 20.9862C8.44683 21.8793 9.85991 22.381 11.3333 22.381C12.5111 22.381 13.6 22.0571 14.4444 21.5429V21.9048C14.4444 23.1677 15.0298 24.3789 16.0716 25.2719C17.1135 26.165 18.5266 26.6667 20 26.6667C21.4734 26.6667 22.8865 26.165 23.9284 25.2719C24.9702 24.3789 25.5556 23.1677 25.5556 21.9048V21.5429C26.4 22.0571 27.4889 22.381 28.6667 22.381C30.1401 22.381 31.5532 21.8793 32.595 20.9862C33.6369 20.0932 34.2222 18.882 34.2222 17.619C34.2222 15.7143 32.9111 14.0952 31.0444 13.3333C32.9111 12.5714 34.2222 10.9333 34.2222 9.04762C34.2222 7.78468 33.6369 6.57347 32.595 5.68044C31.5532 4.78741 30.1401 4.28571 28.6667 4.28571C27.4889 4.28571 26.4 4.59048 25.5556 5.12381V4.7619C25.5556 3.49897 24.9702 2.28776 23.9284 1.39473C22.8865 0.501699 21.4734 0 20 0C18.5266 0 17.1135 0.501699 16.0716 1.39473C15.0298 2.28776 14.4444 3.49897 14.4444 4.7619V5.12381C13.6 4.59048 12.5111 4.28571 11.3333 4.28571C9.85991 4.28571 8.44683 4.78741 7.40496 5.68044C6.36309 6.57347 5.77778 7.78468 5.77778 9.04762C5.77778 10.9333 7.08889 12.5714 8.95556 13.3333C7.08889 14.0952 5.77778 15.7143 5.77778 17.619ZM20 40C25.3043 40 30.3914 38.1939 34.1421 34.979C37.8929 31.7641 40 27.4037 40 22.8571C28.8889 22.8571 20 30.4762 20 40Z"
              fill="#9D9D9D"
            />
          </svg>
          <p
            className="text-neutral-400
                text-[1.75rem]
                font-bold"
          >
            화분
          </p>
        </div>
        <div className="flex justify-start gap-8 mx-[2.4rem]">
          <img src={QuestionIcon} alt="QuestionIcon" />
          <p
            className="text-neutral-400
                text-[1.75rem]
                font-bold"
          >
            오늘의질문
          </p>
        </div>
        <div className="flex justify-start gap-8 mx-[2.4rem]">
          <img src={GalleryIcon} alt="GalleryIcon" />
          <p
            className="text-neutral-400
                text-[1.75rem]
                font-bold"
          >
            체리보관함
          </p>
        </div>
      </div>
    </div>
  );
}
