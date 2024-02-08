import dayjs from "dayjs";
import { useState } from "react";
import { motion } from "framer-motion";
import Kakao from "../../utils/Kakao";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [hasCode, setHasCode] = useState(false);
  const today = dayjs();

  function checkCode() {}

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    console.log(JSON.stringify(data));

    async function fetchJoin() {
      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/user/join`, {
        method: "POST",
        headers: {
          Authorization: Kakao.Auth.getAccessToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw Error("join fetch Error");
      } else {
        navigate("/user/login");
      }
    }

    fetchJoin();
  }

  return (
    <div className="flex justify-center items-center h-full text-[2vw]">
      <div className="bg-pink h-[90%] w-[80%] flex flex-col items-center rounded-xl shadow-2xl">
        <div className="h-[10%] my-[2vh]">추가정보 입력</div>
        <form
          method="post"
          onSubmit={handleSubmit}
          className="grow grid grid-rows-6 w-full px-[10%] h-[100%] max-h-full"
        >
          <div>
            <motion.label
              className="form-control w-full"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="label">
                <span className="label-text">
                  <span className="text-[1.2vw]">애칭&nbsp;</span>
                  <span className="text-[0.8vw] text-cherry">체리씨</span>
                  <span className="text-[0.8vw]">가 당신을 어떻게 부르나요?</span>
                </span>
              </div>
              <input
                type="text"
                name="nickname"
                id="nickname"
                placeholder="체리씨"
                className="input input-bordered w-[100%] border-solid border-2 border-text-gray"
                required
              />
            </motion.label>
          </div>
          <div>
            <motion.label
              className="form-control w-full"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="label">
                <span className="label-text">
                  <span className="text-[1.2vw]">e-mail</span>
                </span>
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="abcd@ssafy.com"
                className="input input-bordered w-full border-solid border-2 border-text-gray"
                required
              />
            </motion.label>
          </div>
          <div>
            <motion.label
              className="form-control w-full"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="label">
                <span className="label-text">
                  <span className="text-[1.2vw]">당신의 생일</span>
                </span>
              </div>
              <input
                type="date"
                name="birthday"
                id="birthday"
                className="input input-bordered w-full border-solid border-2 border-text-gray"
                max={today.format("YYYY-MM-DD")}
                required
              />
            </motion.label>
          </div>
          <div>
            <motion.label
              className="form-control w-full"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="label w-full flex justify-between relative">
                <div className="text-[1.2vw] flex items-center">
                  체리 코드가 있으신가요?
                  <input
                    type="checkbox"
                    checked={hasCode}
                    onChange={() => setHasCode(!hasCode)}
                    className="checkbox bg-white w-[1.5vw] h-[1.5vw] mx-[1vw] "
                  />
                </div>
              </div>
              <span className="flex flex-row justify-between">
                <div className="w-[70%]">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    className="input input-bordered w-full border-solid border-2 border-text-gray"
                    placeholder="체리 코드 입력"
                    disabled={!hasCode}
                    required
                  />
                </div>
                <div className="h-[2vh]">
                  <button
                    type="button"
                    onClick={checkCode}
                    className="btn bg-cherry text-white hover:bg-white hover:text-cherry h-full"
                    disabled={!hasCode}
                  >
                    확인
                  </button>
                </div>
              </span>
            </motion.label>
          </div>
          <div>
            <motion.label
              className="form-control w-full"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="label">
                <span className="label-text">
                  <span className="text-[1.2vw]">사귀기 시작한 날</span>
                </span>
              </div>
              <input
                type="date"
                name="anniversary"
                id="anniversary"
                className="input input-bordered w-full border-solid border-2 border-text-gray"
                max={today.format("YYYY-MM-DD")}
                disabled={hasCode}
                required
              />
            </motion.label>
          </div>

          <div className="flex items-center">
            <button className="btn bg-cherry text-white w-full hover:bg-white hover:text-cherry">
              가입 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
