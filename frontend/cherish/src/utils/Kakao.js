const { Kakao } = window;

if (!Kakao.isInitialized()) {
  Kakao.init(import.meta.env.VITE_APP_KAKAO_JAVASCRIPT_KEY);
}

export default Kakao;

// function handleKakaoLogin() {
//   // TODO: 여러 번 클릭누르는거 막아둬야 함

//   Kakao.Auth.login({
//     success(data) {
//       console.log(data);

//       Kakao.API.request({
//         url: "/v2/user/me",
//         success(info) {
//           console.log(info);

//           // 회원이 없으면
//           // navigate("/user/signup");

//           // 회원이 있는데 coupled false면
//           // TODO: setCoupleCode
//           setOpenWaitingModal(true);

//           // 회원이 있는데 coupled true면
//           // navigate("/");
//         },
//         fail(err) {
//           console.log(err);
//         },
//       });
//     },
//     fail(err) {
//       console.log(err);
//     },
//   });
// }

// function handleKakaoLogout() {
//   if (!Kakao.Auth.getAccessToken()) {
//     alert("로그인중이 아닙니다.");
//     return;
//   }
//   Kakao.Auth.logout(() => {
//     alert("로그아웃");
//   });
// }

// function unlinkUser() {
//   if (!Kakao.Auth.getAccessToken()) {
//     alert("로그인중이 아닙니다.");
//     return;
//   }

//   Kakao.API.request({
//     url: "/v1/user/unlink",
//     success(res) {
//       console.log(res);
//     },
//     fail(err) {
//       console.log(err);
//     },
//   });
// }

// function selectFriend() {
//   if (!Kakao.Auth.getAccessToken()) {
//     alert("로그인중이 아닙니다.");
//     return;
//   }

//   Kakao.Share.sendCustom({
//     templateId: 103940,
//   });
// }
