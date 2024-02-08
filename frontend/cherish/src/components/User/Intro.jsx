import MainLogo from "../../assets/Main/MainLogo.svg";
import CoupleImg from "../../assets/Common/CoupleImg1.svg";
import LoginPot from "../../assets/LoginPot.svg";
import { motion } from "framer-motion";

const Intro = () => {
	const rand = Math.floor(Math.random() * 2);

	const containerMotion = {
		init: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.5 } },
	};

	const itemMotion = {
		init: { opacity: 0 },
		visible: { opacity: 1 },
	};

	return (
		<>
			<motion.div className={`h-full  px-[5%] ${rand === 0 ? "bg-pink" : "bg-beige"}`}>
				<motion.div
					className="h-full flex flex-col"
					variants={containerMotion}
					initial="init"
					animate="visible"
				>
					<motion.div variants={itemMotion} transition={{ duration: 2 }}>
						<img src={MainLogo} />
					</motion.div>
					<motion.div
						className="text-[3vw] leading-[110%]"
						variants={itemMotion}
						transition={{ duration: 2 }}
					>
						{rand === 0 ? (
							<>
								여러분들의 만남으로 <br />
								체리나무를 키워요
							</>
						) : (
							<>
								사랑하는 사람과의 <br />
								추억을 이어가세요
							</>
						)}
					</motion.div>
					<motion.div variants={itemMotion}></motion.div>
					<motion.div
						className="grow px-[10%] box-border flex justify-center"
						variants={itemMotion}
						transition={{ duration: 2 }}
					>
						<img src={rand === 0 ? LoginPot : CoupleImg} className="h-full" />
					</motion.div>
				</motion.div>
			</motion.div>
		</>
	);
};

export default Intro;
