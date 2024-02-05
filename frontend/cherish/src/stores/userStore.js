import  create  from "zustand";


const userStore = create(set => ({

    kakaoId : 1,
    setKakaoId: (state) => set({kakaoId : state}),
    nickname: "wonseok",
    setNickname: (state) => set({nickname: state}),
    userId : 1,
    user1 : 1,
    user2 : 3,
}))

export default userStore;