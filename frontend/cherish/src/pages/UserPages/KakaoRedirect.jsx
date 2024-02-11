import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const KakaoRedirect = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get("code");

	const uri = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${
		import.meta.env.VITE_APP_KAKAO_REST_API_KEY
	}&redirect_uri=${import.meta.env.VITE_APP_KAKAO_REDIRECT_URI}&code=${code}`;

	async function getTokenFetch() {
		const res = await fetch(uri, {
			method: "POST",
			headers: {
				"Content-type": "application/x-www-form-urlencoded;charset=utf-8",
			},
		});
		const data = await res.json();
		localStorage.setItem("token", data.access_token);
	}
	useEffect(() => {
		if (code) getTokenFetch();
	}, []);

	return <></>;
};

export default KakaoRedirect;
