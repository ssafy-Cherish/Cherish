import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useCoupleStore = create(
	persist(
		devtools((set) => ({
			coupleId: null,
			code: null,
			user1: null,
			user2: null,
			anniversary: null,
			userInfos: null,
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
		})),
		{ name: "couple-store" }
	)
);

export default useCoupleStore;
