import { create } from "zustand";
import { devtools } from "zustand/middleware";

const UserStore = create(
	devtools(
		(set) => ({
			kakaoId: null,
			nickname: null,
			setUserInfo: (kakaoId, nickname) => {
				set(() => ({
					kakaoId,
					nickname,
				}));
			},
		}),
		{
			name: "user-store",
		}
	)
);

export default UserStore;
