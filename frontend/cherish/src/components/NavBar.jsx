import MainLogo from "../assets/MainLogo.svg"
import CherryCallIcon from "../assets/CherryCallIcon.svg"
import DiaryIcon from "../assets/DiaryIcon.svg"
import GalleryIcon from '../assets/GalleryIcon.svg'
import PotIcon from '../assets/PotIcon.svg'
import QuestionIcon from "../assets/QuestionIcon.svg"
import DropdownIcon from "../assets/DropdownIcon.svg"
import ProfileIcon from "../assets/ProfileIcon.svg"


export default function NavBar() {
    return (
        <div className="col-span-2 h-screen bg-beige">
        <div className="ml-16">
            <img src={MainLogo} alt="MainLogo" />
        </div>
        <div className="grid gird-rows-6 gap-14 mt-[5.5vw]" id="네브바메인">
                <button className="ml-[2vw] flex flex-row justify-around items-center bg-white w-[12vw] h-[3.6vw] rounded-[36px] shadow-md">
                <div>
                    <img src={ProfileIcon} alt="ProfileIcon" />
                </div>
                <p className="text-[1.2vw]">나희도</p>
                <div>
                    <img src={DropdownIcon} alt="DropdownIcon" />
                </div>  
                </button>
            <div className="flex justify-start gap-8 mx-[2.4rem]">
                <div>
                <img src={CherryCallIcon} alt="CherryCallIcon" />
                </div>
                <p 
                className="text-neutral-400
                text-[1.5vw]
                font-bold">체리콜</p>
            </div>
            <div className="flex justify-start gap-8 mx-[2.4rem]">
                <img src={DiaryIcon} alt="DirayIcon" />
                <p 
                className="text-neutral-400
                text-[1.5vw]
                font-bold">다이어리</p>
            </div>
            <div className="flex justify-start gap-8 mx-[2.4rem]">
                <img src={PotIcon} alt="PotIcon" />
                <p 
                className="text-neutral-400
                text-[1.5vw]
                font-bold">화분</p>
            </div>
            <div className="flex justify-start gap-8 mx-[2.4rem]">
                <img src={QuestionIcon} alt="QuestionIcon" />
                <p 
                className="text-neutral-400
                text-[1.5vw]
                font-bold">오늘의질문</p>
            </div>
            <div className="flex justify-start gap-8 mx-[2.4rem]">
                <img src={GalleryIcon} alt="GalleryIcon" />
                <p 
                className="text-neutral-400
                text-[1.5vw]
                font-bold">체리보관함</p>
            </div>
        </div>
    </div>
    )
}