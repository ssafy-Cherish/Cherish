import { motion } from "framer-motion";

function CallBox({ meetingInfo, camContainer, remoteCam, localCamContainer, localCam }) {
	return (
		<motion.div
			className={`h-full w-full relative flex flex-col-reverse items-center bg-slate-700 rounded-t-2xl z-50 ${
				!meetingInfo.isModalOpen ? "" : "hidden"
			}`}
			ref={camContainer}
		>
			<video
				className="h-full bg-slate-700 absolute rounded-t-2xl video-mirror"
				id="remoteCam"
				ref={remoteCam}
				autoPlay
				playsInline
			></video>

			<motion.div
				className={`h-[30%] w-[30%] z-100 relative left-[30%] bottom-[5%] rounded-2xl bg-pink flex flex-col justify-center items-center ${
					meetingInfo.video.local.videoOn ? "" : "hidden"
				}`}
				drag
				dragConstraints={camContainer}
				ref={localCamContainer}
				dragMomentum={false}
			>
				<video ref={localCam} autoPlay playsInline className="h-[90%] w-[90%] absolute video-mirror"></video>
			</motion.div>
		</motion.div>
	);
}

export default CallBox;
