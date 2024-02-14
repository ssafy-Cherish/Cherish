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
	const [coupleId, setCoupleId] = useState(undefined);
	const [coupleCode, setCoupleCode] = useState("");

	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get("code");

	const { mutate: kakaoLogin } = useMutation({
		mutationFn: kakaoLoginFetch,
		onSuccess: (data) => {
			if (data.verified) {
				console.log(data);
				const user = data.userDto;
				const couple = data.coupleDto;
				if (!couple.coupled) {
					setCoupleCode(couple.code);
					setCoupleId(couple.id);
					setUserId(user.id);
					setOpenWaitingModal(true);
				} else {
					setUserInfo(user.kakaoId, user.nickname, user.id, user.email, user.birthday);

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
		// Kakao.Auth.authorize({
		// 	redirectUri: `${import.meta.env.VITE_APP_KAKAO_REDIRECT_URI}`,
		// });

		Kakao.Auth.login({
			success(data) {
				console.log(data);
				kakaoLogin();
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
						coupleId={coupleId}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

export default SocialKakao;
