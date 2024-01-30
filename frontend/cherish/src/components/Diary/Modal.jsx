import { motion, useAnimate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import classes from "./Modal.module.css";

const Modal = ({ children, z, width, height }) => {
	const navigate = useNavigate();
	const [scope, animate] = useAnimate();
	function onClose() {
		animate("dialog", { opacity: 0, y: 30 });
		setTimeout(() => {
			navigate("..");
		}, 300);
	}

	return createPortal(
		<div
			className={classes.backdrop}
			onClick={onClose}
			ref={scope}
			style={{ zIndex: z ? z : undefined }}
		>
			<motion.dialog
				className={classes.modal}
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				open
				onClick={(e) => {
					// 다이얼로그 안을 클릭 했을 때 onClose가 실행되는 이벤트 캡쳐링 방지
					e.stopPropagation();
				}}
				style={{
					height: height ? height : undefined,
					width: width ? width : undefined,
					padding: 0,
				}}
			>
				{children}
			</motion.dialog>
		</div>,
		document.body
	);
};

export default Modal;
