import { useState } from "react";
import { useNavigate } from "react-router";

import Kakao from "../../utils/Kakao";
import WaitingModal from "./WaitingModal";
import { AnimatePresence } from "framer-motion";
import KakaoLogin from "../../assets/User/kakao_login_large_wide.png";

const SocialKakao = () => {
  const navigate = useNavigate();
  const [openWaitingModal, setOpenWaitingModal] = useState(false);

  const [coupleCode, setCoupleCode] = useState("!VCJmYMh3LP*9@j");

  function handleKakaoLogin() {
    // TODO: 여러 번 클릭누르는거 막아둬야 함

    Kakao.Auth.login({
      success(data) {
        console.log(data);

        signupFlow();
      },
      fail(err) {
        console.log(err);
      },
    });
  }

  function signupFlow() {
    Kakao.API.request({
      url: "/v2/user/me",
      success(info) {
        console.log(info);

        // 회원이 없으면
        // navigate("/user/signup");
        // return

        // 받은 데이터로 Zustand 세팅

        // 회원이 있는데 coupled false면
        // TODO: setCoupleCode
        setOpenWaitingModal(true);

        // 회원이 있는데 coupled true면
        // navigate("/");
      },
      fail(err) {
        console.log(err);
      },
    });
  }

  function handleKakaoLogout() {
    if (!Kakao.Auth.getAccessToken()) {
      alert("로그인중이 아닙니다.");
      return;
    }
    Kakao.Auth.logout(() => {
      alert("로그아웃");
    });
  }

  function unlinkUser() {
    if (!Kakao.Auth.getAccessToken()) {
      alert("로그인중이 아닙니다.");
      return;
    }

    Kakao.API.request({
      url: "/v1/user/unlink",
      success(res) {
        console.log(res);
      },
      fail(err) {
        console.log(err);
      },
    });
  }

  return (
    <>
      <img src={KakaoLogin} onClick={handleKakaoLogin} className="w-[80%] hover:cursor-pointer" />
      <AnimatePresence>
        {openWaitingModal && (
          <WaitingModal onClose={() => setOpenWaitingModal(false)} code={coupleCode} />
        )}
      </AnimatePresence>
    </>
  );
};

export default SocialKakao;
