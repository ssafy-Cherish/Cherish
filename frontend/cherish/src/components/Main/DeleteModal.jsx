/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import Modal from "../Diary/Modal";
import { userDeleteFetch } from "../../services/userService";
import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Kakao from "../../utils/Kakao";

const DeleteModal = ({ onClose }) => {
	const inputRef = useRef();
	const { userId, reset: userReset } = useUserStore();
	const { coupleId, reset: coupleReset } = useCoupleStore();
	const navigate = useNavigate();

	const { mutate: deleteMutate } = useMutation({
		mutationFn: userDeleteFetch,
		onSuccess: () => {
			Kakao.API.request({
				url: "/v1/user/unlink",
				success() {},
				fail(err) {
					console.log(err);
				},
			});
			coupleReset();
			userReset();
			localStorage.removeItem("user-store");
			localStorage.removeItem("couple-store");
			navigate("/");
		},
	});

	function deleteUser() {
		if (inputRef.current.value === "체리씨 떠나기") {
			deleteMutate({ userId, coupleId });
		}
	}

	return (
		<Modal dialogCss={`h-[40%] w-[25%] top-[5%] bg-pink rounded-xl shadow-2xl`}>
			<div className="grid grid-rows-4 h-full p-[5%]">
				<div className="flex justify-center items-center text-[2vw] text-black">
					체리씨 떠나기
				</div>
				<div className="flex justify-center">
					3개월이 지나기 전에 다시 돌아올 수 있어요..!
				</div>
				<div className="grid grid-rows-2">
					<div className="flex justify-center mx-[20%]">
						<input
							type="text "
							className="input input-bordered w-[100%] h-full border-solid border-2 border-text-gray"
							ref={inputRef}
						/>
					</div>
					<div className="text-center">{`"체리씨 떠나기"를 입력해주세요.`}</div>
				</div>
				<div className="flex flex-row justify-evenly">
					<button
						type="button"
						className="btn bg-white text-cherry w-[20%] hover:bg-cherry hover:text-white"
						onClick={onClose}
					>
						취소
					</button>
					<button
						className="btn bg-cherry text-white w-[20%] hover:bg-white hover:text-cherry"
						onClick={deleteUser}
					>
						탈퇴
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteModal;
