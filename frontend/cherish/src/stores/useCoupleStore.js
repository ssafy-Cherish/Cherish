import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const initalState = {
	coupleId: null,
	code: null,
	user1: null,
	user2: null,
	anniversary: null,
	userInfos: null,
};

const useCoupleStore = create(
	persist(
		devtools((set) => ({
			...initalState,
			setCoupleInfo: (coupleId, code, user1, user2, anniversary, userInfos) => {
				set(() => ({
					coupleId,
					code,
					user1,
					user2,
					anniversary,
					userInfos,
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
