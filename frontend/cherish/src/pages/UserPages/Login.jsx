import { Outlet } from "react-router-dom";
import SocialKakao from "../../components/User/SocialKakao";

const Login = () => {
	return (
		<div className="flex justify-center items-center h-full text-[2vw]">
			<div className="bg-pink h-[50%] w-[80%] flex flex-col items-center rounded-xl shadow-2xl">
				<div className=" p-[8%]">로그인</div>
				<div className="grow flex justify-center items-center pb-[10%]">
					<SocialKakao />
					<Outlet></Outlet>
				</div>
			</div>
		</div>
	);
};

export default Login;
