import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import CloseIcon from "../../assets/CloseIcon.svg";
const Modal = ({ z, onClose, children, dialogCss, isX }) => {
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
		<div onClick={onClose} style={backdropStyle}>
			<motion.dialog
				className={dialogCss}
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
					<button onClick={onClose} className="absolute left-[93%] w-[1vw] z-50">
						<img src={CloseIcon} alt="CloseIcon" />
					</button>
				)}
				{children}
			</motion.dialog>
		</div>,
		document.body
	);
};

export default Modal;
