import dayjs from "dayjs";
import Modal from "../Diary/Modal";
import { motion } from "framer-motion";
import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";
import { useState } from "react";

const ModifyModal = (onClose) => {
	const today = new dayjs();

	const { nickname, email, birthday } = useUserStore();
	const { anniversary } = useCoupleStore();

	const [userInfoData, setUserInfoData] = useState({
		nickname,
		email,
		birthday: dayjs(birthday).format("YYYY-MM-DD"),
		anniversary,
	});

	function handleChange() {}

	console.log(userInfoData);

	function handleSubmit(event) {}

	return (
		<Modal
			dialogCss={`h-[60%] w-[30%] bg-pink flex flex-col items-center rounded-xl shadow-2xl`}
		>
			<div className="h-[10%] my-[2vh] text-[1.5vw]">정보 수정</div>
			<form
				method="post"
				onSubmit={handleSubmit}
				className="grow grid grid-rows-5 w-full px-[10%] max-h-full"
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
								<span className="text-[1.2vw]">사귀기 시작한 날</span>
							</span>
						</div>
						<input
							type="date"
							name="anniversary"
							id="anniversary"
							value={userInfoData.anniversary}
							className="input input-bordered w-full border-solid border-2 border-text-gray"
							max={today.format("YYYY-MM-DD")}
							required
						/>
					</motion.label>
				</div>

				<div className="flex flex-row justify-between">
					<button className="btn bg-white text-cherry w-[20%] hover:bg-cherry hover:text-white">
						취소
					</button>
					<button className="btn bg-cherry text-white w-[20%] hover:bg-white hover:text-cherry">
						저장
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default ModifyModal;
