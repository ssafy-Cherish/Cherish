const { Kakao } = window;

if (!Kakao.isInitialized()) {
	Kakao.init(import.meta.env.VITE_APP_KAKAO_JAVASCRIPT_KEY);
}

export default Kakao;
