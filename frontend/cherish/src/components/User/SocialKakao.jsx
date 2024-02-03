import KakaoLogin from "react-kakao-login";
import { useNavigate } from "react-router";

const SocialKakao = () => {
	const kakaoClientId = import.meta.env.VITE_APP_KAKAO_JAVASCRIPT_KEY;
	const navigate = useNavigate();

	const kakaoOnSuccess = async (data) => {
		console.log(data);
		const idToken = data.response.access_token; // 엑세스 토큰 백엔드로 전달

		// 이미 있는 회원인지 확인해서 메인으로 보내거나 회원가입을 보내거나 선택
		navigate("/user/signup");
	};
	const kakaoOnFailure = (error) => {
		console.log(error);
	};
	return (
		<>
			<KakaoLogin token={kakaoClientId} onSuccess={kakaoOnSuccess} onFail={kakaoOnFailure} />
		</>
	);
};

export default SocialKakao;
