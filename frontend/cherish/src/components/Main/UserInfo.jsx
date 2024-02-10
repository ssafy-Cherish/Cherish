import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";
import ProfileIcon from "../../assets/Main/ProfileIcon.svg";
import DropdownIcon from "../../assets/Common/DropdownIcon.svg";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ModifyModal from "./ModifyModal";

export default function UserInfo() {
	const { anniversary, userInfos, reset: coupleReset } = useCoupleStore();
	const { userId, birthday, nickname, reset: userReset } = useUserStore();
	const [isOpen, setIsOpen] = useState(false);
	const [openModifyModal, setOpenModifyModal] = useState(false);
	const navigate = useNavigate();

	const cherryInfo = userInfos.filter((info) => {
		return info.id !== userId;
	})[0];

	const anni = dayjs(anniversary).format("YYYY년 M월 D일");
	const myBirth = dayjs(birthday).format("YYYY년 M월 D일");
	const cherryBirth = dayjs(cherryInfo.birthday).format("YYYY년 M월 D일");

	const handleClickIsOpen = () => {
		setIsOpen((pre) => !pre);
	};

	const CloseModifyModal = () => {
		setOpenModifyModal(false);
	};

	function logout() {
		coupleReset();
		userReset();
		localStorage.removeItem("user-store");
		localStorage.removeItem("couple-store");
		navigate("/");
	}

	let userInfoClassName = `left-[2%] transition-[height] duration-500 absolute w-[18rem]  bg-white my-[65px]  text-[1.5rem] rounded-[40px] shadow-md text-center ${
		isOpen ? " h-[365px] z-[1]  flex flex-col rounded-[15px] overflow-y-auto" : " h-[4vw]"
	}`;

	return (
		<>
			<div id="userInfo" className={userInfoClassName}>
				<div
					className={
						"w-[80%] grid grid-cols-5 ml-[2rem] mt-[1vw] " +
						(isOpen ? "border-b-2 border-text-gray pb-[10px]" : "") +
						" hover:cursor-pointer"
					}
					onClick={handleClickIsOpen}
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
						<div className="my-[48px] text-text-black flex flex-col items-start ml-[15px] text-[80%]">
							<p className="mb-[8px]">내 생일 : {myBirth}</p>
							<p className="mb-[8px]">만남 : {anni}</p>
							<p className="mb-[8px] text-cherry">체리씨 : {cherryInfo.nickname}</p>
							<p className=" text-cherry">체리 생일 : {cherryBirth}</p>
						</div>
						<div className="flex justify-around mt-[32px] text-text-black">
							<button onClick={() => setOpenModifyModal(true)}>내정보</button>
							<button onClick={logout}>로그아웃</button>
						</div>
					</>
				)}

				<AnimatePresence>
					{openModifyModal && <ModifyModal onClose={CloseModifyModal}></ModifyModal>}
				</AnimatePresence>
			</div>
		</>
	);
}
