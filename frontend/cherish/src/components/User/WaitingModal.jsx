/* eslint-disable react/prop-types */
import Modal from "../Diary/Modal";
import Copy from "../../assets/User/copy.svg";
import Kakao from "../../utils/Kakao";
import { motion } from "framer-motion";

const WaitingModal = ({ onClose, code }) => {
	const handleCopyClipBoard = () => {
		try {
			navigator.clipboard.writeText(code);
			alert("클립보드에 복사되었습니다.");
		} catch (err) {
			console.log(err);
		}
	};

	function selectFriend() {
		if (!Kakao.Auth.getAccessToken()) {
			alert("로그인중이 아닙니다.");
			return;
		}

		Kakao.Share.sendCustom({
			templateId: 103940,
		});
	}

	return (
		<Modal
			onClose={onClose}
			dialogCss="w-[30vw] h-[40vh] bg-white rounded-xl top-[10%] py-[2vh] border-solid border-2 border-text-black"
		>
			<div className="flex flex-col items-center h-full text-[1vw]">
				<div className="text-[1vw] ">체리씨를 기다리는 중이에요</div>
				<div className="text-[2vw]">기다리는 중...</div>
				<motion.div
					className="grow h-full flex justify-center items-center relative"
					onClick={handleCopyClipBoard}
					whileHover={{ scale: 1.2 }}
				>
					<input
						type="text"
						readOnly
						value={code}
						className="input input-bordered w-full border-solid border-2 border-text-gray text-[1vw]"
					/>
					<img src={Copy} className="absolute w-[1.3vw] h-[1.3vw] left-[85%]" />
				</motion.div>
				<div className="w-[80%] flex justify-center">
					<button className="btn bg-yellow-200" onClick={selectFriend}>
						카카오톡으로 초대하기
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default WaitingModal;
