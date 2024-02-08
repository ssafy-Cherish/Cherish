import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const initalState = {
  coupleId: null,
  code: null,
  user1: null,
  user2: null,
  anniversary: null,
  userInfos: null,
  question: null,
};

const useCoupleStore = create(
  persist(
    devtools((set) => ({
      ...initalState,
      setCoupleInfo: (coupleId, code, user1, user2, anniversary, userInfos, question) => {
        set(() => ({
          coupleId,
          code,
          user1,
          user2,
          anniversary,
          userInfos,
          question,
        }));
      },
      reset: () => {
        set(initalState);
      },
    })),
    { name: "couple-store" }
  )
);

export default useCoupleStore;
