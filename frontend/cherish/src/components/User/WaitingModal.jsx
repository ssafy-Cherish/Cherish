/* eslint-disable react/prop-types */
import Modal from "../Diary/Modal";
import Copy from "../../assets/User/copy.svg";
import Kakao, { getAccessToken } from "../../utils/Kakao";
import { AnimatePresence, motion } from "framer-motion";

const WaitingModal = ({ onClose, code, userId }) => {
	const handleCopyClipBoard = () => {
		try {
			navigator.clipboard.writeText(code);
			alert("클립보드에 복사되었습니다.");
		} catch (err) {
			console.log(err);
		}
	};

	function selectFriend() {
		if (!getAccessToken()) {
			alert("로그인 중이 아닙니다.");
			return;
		}

		Kakao.Share.sendCustom({
			templateId: 103940,
			templateArgs: {
				code: code,
			},
		});
	}

	function deleteUser() {
		async function fetchDelete() {
			const res = await fetch(
				`${import.meta.env.VITE_APP_BACKEND_URL}/user/delete/${userId}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: getAccessToken(),
					},
				}
			);

			if (!res.ok) {
				new Error("Delete Error");
			}
		}
		if (confirm("정말 삭제하시겠습니까?")) {
			fetchDelete();
			onClose();
		}
	}

	return (
		<Modal
			onClose={onClose}
			dialogCss="w-[30vw] h-[40vh] bg-white rounded-xl top-[10%] py-[2vh] border-solid border-2 border-text-black"
		>
			<div className="flex flex-col items-center h-full text-[1vw]">
				<div className="text-[1vw] ">
					<span className="text-cherry">체리씨</span>를 기다리는 중이에요
				</div>
				<div className="text-[2vw]">기다리는 중...</div>
				<motion.div
					className="grow flex justify-center items-center relative"
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
				<div className="w-[80%] flex justify-center py-[2vh]">
					<button className="btn bg-yellow-200" onClick={selectFriend}>
						카카오톡으로 초대하기
					</button>
				</div>
				<div>
					<span className="text-[0.7vw]">
						혹시 가입을 잘못하셨나요?{" "}
						<span
							className="underline text-red-500 hover:cursor-pointer"
							onClick={deleteUser}
						>
							여기
						</span>
						를 눌러 회원탈퇴를 진행하세요!
					</span>
				</div>
			</div>
		</Modal>
	);
};

export default WaitingModal;
