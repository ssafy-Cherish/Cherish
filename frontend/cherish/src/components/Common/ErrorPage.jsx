import { useNavigate } from "react-router-dom";
import CoupleImg from "../../assets/Common/CoupleImg1.svg";

const ErrorPage = () => {
	const navigate = useNavigate();
	return (
		<div className="h-full w-full bg-beige flex justify-center items-center">
			<div className=" flex flex-col items-center gap-10">
				<div className="text-[2vw]">문제가 발생했어요..</div>
				<div>
					<img src={CoupleImg} alt="" />
				</div>
				<div>
					<buttonc
						className="btn"
						onClick={() => {
							navigate("/");
						}}
					>
						메인으로 돌아가기
					</buttonc>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;
