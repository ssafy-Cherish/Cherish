import { useState } from "react";
import { useNavigate } from "react-router";

import Kakao from "../../utils/Kakao";
import WaitingModal from "./WaitingModal";
import { AnimatePresence } from "framer-motion";
import KakaoLogin from "../../assets/User/kakao_login_large_wide.png";
import useUserStore from "../../stores/useUserStore";
import useCoupleStore from "../../stores/useCoupleStore";

const SocialKakao = () => {
  const navigate = useNavigate();
  const [openWaitingModal, setOpenWaitingModal] = useState(false);

  const { setUserInfo } = useUserStore();
  const { setCoupleInfo } = useCoupleStore();

  const [userId, setUserId] = useState(undefined);
  const [coupleCode, setCoupleCode] = useState("");
  const [preventClick, setPreventClick] = useState(false);

  function handleKakaoLogin() {
    async function fetchKakaoLogin() {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/user/login`, {
        headers: {
          Authorization: Kakao.Auth.getAccessToken(),
        },
      });
      const resData = await response.json();
      if (!response.ok) {
        throw Error("login fetch Error");
      }

      if (resData.verified) {
        console.log(resData);
        if (!resData.coupleDto.coupled) {
          setCoupleCode(resData.coupleDto.code);
          setUserId(resData.user_id);
          setOpenWaitingModal(true);
        } else {
          setUserInfo(resData.kakao_id, resData.nickname, resData.user_id);
          const couple = resData.coupleDto;

          setCoupleInfo(
            couple.id,
            couple.code,
            couple.user1,
            couple.user2,
            couple.anniversary,
            resData.userInfos
          );
          navigate("/");
        }
      } else {
        navigate("/user/signup");
      }

      return resData;
    }

    if (preventClick) return;
    setPreventClick(true);

    Kakao.Auth.login({
      success(data) {
        console.log(data);
        fetchKakaoLogin();

        setPreventClick(false);
      },
      fail(err) {
        console.log(err);
        return;
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
