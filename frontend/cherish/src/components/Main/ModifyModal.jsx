/* eslint-disable react/prop-types */
import dayjs from "dayjs";
import Modal from "../Diary/Modal";
import Copy from "../../assets/User/copy.svg";
import { AnimatePresence, motion } from "framer-motion";
import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";
import { useState } from "react";
import Kakao from "../../utils/Kakao";
import { useNavigate } from "react-router-dom";
import { userDeleteFetch, userModifyFetch } from "../../services/userService";
import { useMutation } from "@tanstack/react-query";
import DeleteModal from "./DeleteModal";

const ModifyModal = ({ onClose }) => {
	const today = new dayjs();
	const navigate = useNavigate();

	const {
		nickname,
		email,
		birthday,
		userId,
		kakaoId,
		reset: userReset,
		setUserInfo,
	} = useUserStore();

	const { code, reset: coupleReset } = useCoupleStore();
	const [copied, setCopied] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [userInfoData, setUserInfoData] = useState({
		nickname,
		email,
		birthday: dayjs(birthday).format("YYYY-MM-DD"),
	});

	function handleChange(identifier, event) {
		setUserInfoData((prev) => ({
			...prev,
			[identifier]: event.target.value,
		}));
	}

	const handleCopyClipBoard = () => {
		try {
			navigator.clipboard.writeText(code);
			setCopied(true);
		} catch (err) {
			console.log(err);
		}
	};

	function handleSubmit(event) {
		event.preventDefault();
		if (confirm("정말 수정하시겠어요?")) {
			const fd = new FormData(event.target);
			const formData = Object.fromEntries(fd.entries());
			modifyeMutate({ formData });
		}
	}

	const { mutate: modifyeMutate } = useMutation({
		mutationFn: userModifyFetch,
		onSuccess: () => {
			setUserInfo(
				kakaoId,
				userInfoData.nickname,
				userId,
				userInfoData.email,
				userInfoData.birthday
			);
			onClose();
		},
	});

	return (
		<Modal
			dialogCss={`h-[70%] w-[30%] bg-pink flex flex-col items-center rounded-xl shadow-2xl`}
		>
			<div className="h-[6%] my-[2vh] text-[1.5vw] flex flex-col justify-center items-center">
				<div>정보 수정</div>
				<div className="text-[0.8vw]">애칭, 이메일, 생일을 변경할 수 있어요!</div>
			</div>
			<div className="w-full grow">
				<form
					method="post"
					onSubmit={handleSubmit}
					className="grow grid grid-rows-5 w-full px-[10%] max-h-full h-full"
				>
					<div>
						<motion.label className="form-control w-full">
							<div className="label">
								<span className="label-text">
									<span className="text-[1.2vw]">변경할 애칭&nbsp;</span>
								</span>
							</div>
							<input
								type="text"
								name="nickname"
								id="nickname"
								value={userInfoData.nickname}
								onChange={(event) => handleChange("nickname", event)}
								placeholder="체리씨"
								className="input input-bordered w-[100%] border-solid border-2 border-text-gray"
								required
							/>
						</motion.label>
					</div>
					<div>
						<motion.label className="form-control w-full">
							<div className="label">
								<span className="label-text">
									<span className="text-[1.2vw]">e-mail</span>
								</span>
							</div>
							<input
								type="email"
								name="email"
								id="email"
								value={userInfoData.email}
								onChange={(event) => handleChange("email", event)}
								placeholder="abcd@ssafy.com"
								className="input input-bordered w-full border-solid border-2 border-text-gray"
								required
							/>
						</motion.label>
					</div>
					<div>
						<motion.label className="form-control w-full">
							<div className="label">
								<span className="label-text">
									<span className="text-[1.2vw]">당신의 생일</span>
								</span>
							</div>
							<input
								type="date"
								name="birthday"
								id="birthday"
								value={userInfoData.birthday}
								onChange={(event) => handleChange("birthday", event)}
								className="input input-bordered w-full border-solid border-2 border-text-gray"
								max={today.format("YYYY-MM-DD")}
								required
							/>
						</motion.label>
					</div>

					<div>
						<motion.label className="form-control w-full">
							<div className="label">
								<span className="label-text">
									<span className="text-[1.2vw]">코드</span>
								</span>
							</div>
							<div
								className="flex relative justify-center"
								onClick={handleCopyClipBoard}
							>
								<input
									type="text"
									readOnly
									value={code}
									className="input input-bordered w-full border-solid border-2 border-text-gray text-[1vw]"
								/>
								<img
									src={Copy}
									className="absolute w-[1.3vw] h-[1.3vw] left-[90%] h-[100%]"
								/>
								{copied && (
									<motion.div
										className="absolute -top-[50%]"
										initial={{ scale: 0, y: 30 }}
										animate={{ scale: 1, y: 0 }}
									>
										복사되었어요!
									</motion.div>
								)}
							</div>
						</motion.label>
					</div>
					<div className="flex flex-row justify-between">
						<button
							type="button"
							className="btn bg-white text-cherry w-[20%] hover:bg-cherry hover:text-white"
							onClick={onClose}
						>
							취소
						</button>
						<button className="btn bg-cherry text-white w-[20%] hover:bg-white hover:text-cherry">
							저장
						</button>
					</div>
					<input type="hidden" name="id" value={userId} />
				</form>
			</div>
			<div>
				<span className="text-[0.8vw]">
					혹시 나무가 시들었나요?{" "}
					<span
						className="underline text-red-500 hover:cursor-pointer"
						onClick={() => setOpenDeleteModal(true)}
					>
						여기
					</span>
					를 눌러 회원탈퇴를 진행하세요...
				</span>
			</div>
			<AnimatePresence>
				{openDeleteModal && (
					<DeleteModal onClose={() => setOpenDeleteModal(false)}></DeleteModal>
				)}
			</AnimatePresence>
		</Modal>
	);
};

export default ModifyModal;
