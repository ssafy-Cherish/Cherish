import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const initalState = {
	kakaoId: null,
	nickname: null,
	userId: null,
	email: null,
	birthday: null,
};

const useUserStore = create(
	persist(
		devtools((set) => ({
			...initalState,
			setUserInfo: (kakaoId, nickname, userId, email, birthday) => {
				set(() => ({
					kakaoId,
					nickname,
					userId,
					email,
					birthday,
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
