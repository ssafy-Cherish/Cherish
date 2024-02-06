import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    devtools((set) => ({
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
    })),
    {
      name: "user-store",
    }
  )
);

export default useUserStore;
