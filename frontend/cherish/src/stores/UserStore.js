import { create } from "zustand";
import { devtools } from "zustand/middleware";

const UserStore = create(
  devtools(
    (set) => ({
      kakaoId: null,
      nickname: null,
      userId: null,
      setUserInfo: (kakaoId, nickname, userId) => {
        set(() => ({
          kakaoId,
          nickname,
          userId,
        }));
      },
    }),
    {
      name: "user-store",
    }
  )
);

export default UserStore;
