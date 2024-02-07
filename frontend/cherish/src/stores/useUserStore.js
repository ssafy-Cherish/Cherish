import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const initalState = {
	kakaoId: null,
	nickname: null,
	userId: null,
};

const useUserStore = create(
	persist(
		devtools((set) => ({
			...initalState,
			setUserInfo: (kakaoId, nickname, userId) => {
				set(() => ({
					kakaoId,
					nickname,
					userId,
				}));
			},
			reset: () => {
				set(initalState);
			},
		})),
		{
			name: "user-store",
		}
	)
);

export default useUserStore;
