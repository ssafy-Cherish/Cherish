import { useState } from "react";
import { useNavigate } from "react-router";

import Kakao from "../../utils/Kakao";
import WaitingModal from "./WaitingModal";
import { AnimatePresence } from "framer-motion";
import KakaoLogin from "../../assets/User/kakao_login_large_wide.png";
import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { kakaoLoginFetch } from "../../services/userService";

const SocialKakao = () => {
	const navigate = useNavigate();
	const [openWaitingModal, setOpenWaitingModal] = useState(false);

	const { setUserInfo } = useUserStore();
	const { setCoupleInfo } = useCoupleStore();

	const [userId, setUserId] = useState(undefined);
	const [coupleCode, setCoupleCode] = useState("");
	const [preventClick, setPreventClick] = useState(false);

	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get("code");

	const { mutate: kakaoLogin } = useMutation({
		mutationFn: kakaoLoginFetch,
		onSuccess: (data) => {
			if (data.verified) {
				console.log(data);
				if (!data.coupleDto.coupled) {
					setCoupleCode(data.coupleDto.code);
					setUserId(data.user_id);
					setOpenWaitingModal(true);
				} else {
					setUserInfo(data.kakao_id, data.nickname, data.user_id);
					const couple = data.coupleDto;

					setCoupleInfo(
						couple.id,
						couple.code,
						couple.user1,
						couple.user2,
						couple.anniversary,
						data.userInfos,
						data.questionDto
					);
					navigate("/");
				}
			} else {
				navigate(`/user/signup${code ? `?code=${code}` : ""}`);
			}
		},
	});

	function handleKakaoLogin() {
		if (preventClick) return;
		setPreventClick(true);

		Kakao.Auth.loginForm({
			success(data) {
				console.log(data);
				kakaoLogin();
				setPreventClick(false);
			},
			fail(err) {
				console.log(err);
				return;
			},
		});
	}

	return (
		<>
			<img
				src={KakaoLogin}
				onClick={handleKakaoLogin}
				className="w-[80%] hover:cursor-pointer"
			/>
			<AnimatePresence>
				{openWaitingModal && (
					<WaitingModal
						onClose={() => setOpenWaitingModal(false)}
						code={coupleCode}
						userId={userId}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

export default SocialKakao;
