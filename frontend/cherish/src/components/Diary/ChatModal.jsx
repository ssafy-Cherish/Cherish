import { createPortal } from "react-dom";
import { motion, useAnimate } from "framer-motion";
import CloseIcon from "../../assets/CloseIcon.svg";

const ChatModal = ({ z, chats, onClose, isX, myId }) => {
	const [scope, animate] = useAnimate();
	console.log(chats);

	const backdropStyle = {
		position: "fixed",
		top: "0",
		left: "0",
		width: "100%",
		height: "100vh",
		backgroundColor: "rgba(0, 0, 0, 0.25)",
		zIndex: z || "9",
	};
	const modalStyle = {
		margin: "10% auto",
		maxWidth: "90%",
		zIndex: "10",
	};

	return createPortal(
		<div onClick={onClose} ref={scope} style={backdropStyle}>
			<motion.dialog
				className="w-[30vw] h-[60vh] bg-pink p-5 rounded-2xl"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 30 }}
				open
				onClick={(e) => {
					// 다이얼로그 안을 클릭 했을 때 onClose가 실행되는 이벤트 캡쳐링 방지
					e.stopPropagation();
				}}
				style={modalStyle}
			>
				{isX && (
					<button onClick={onClose} className="float-right mt-[1.5vw] mr-[1.5vw]">
						<img src={CloseIcon} alt="CloseIcon" />
					</button>
				)}
				<div className="relative rounded-b-2xl h-full">
					<div className="bg-white rounded-2xl h-full overflow-y-auto absolute w-full p-5">
						{chats.map((chat, idx) => {
							return (
								<>
									{myId === chat.kakaoId ? (
										<div
											key={idx}
											className="flex flex-row justify-end pl-8 pr-4 pt-4 "
										>
											<div
												style={{
													backgroundColor: "#FEF8EC",
													whiteSpace: "pre-line",
													wordWrap: "break-word",
												}}
												className="py-2 pl-4 pr-4 rounded-tl-xl rounded-b-xl drop-shadow"
											>
												{chat.content}
											</div>
										</div>
									) : (
										<div
											key={idx}
											className="flex flex-row justify-start pl-4 pr-8 pt-4"
										>
											<div
												style={{
													backgroundColor: "#E0F4FF",
													whiteSpace: "pre-line",
													wordWrap: "break-word",
												}}
												className="py-2 pl-4 pr-4 rounded-tr-xl rounded-b-xl drop-shadow max-w-full"
											>
												{chat.content}
											</div>
										</div>
									)}
								</>
							);
						})}
					</div>
				</div>
			</motion.dialog>
		</div>,
		document.body
	);
};

export default ChatModal;
