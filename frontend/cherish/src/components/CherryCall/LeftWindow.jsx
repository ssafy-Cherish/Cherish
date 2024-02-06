import { motion } from "framer-motion";

function LeftWindow({
  meetingInfo,
  createOffer,
  updateLocalVideo,
  readyCam,
  setConnection,
  setMeetingInfo,
  listen,
  camContainer,
  remoteCam,
  localCamContainer,
  localCam,
}) {
  return (
    <div className="h-3/4 m-2 rounded-2xl flex flex-col-reverse">
      <div className="h-14 bg-pink rounded-b-2xl flex flex-row justify-between">
        <div className="border-2 m-2 w-1/6"></div>
        <button
          className="border-2 m-2 w-14 rounded-2xl"
          disabled={!meetingInfo.connect.offerReady}
          onClick={() => {
            createOffer();
          }}
        >
          통화
        </button>
      </div>
      {!meetingInfo.isModalOpen && (
        <motion.div
          className="h-full w-full relative flex flex-col-reverse items-center bg-slate-700 rounded-t-2xl z-50"
          ref={camContainer}
        >
          <video
            className="h-full bg-slate-700 absolute rounded-t-2xl"
            id="remoteCam"
            ref={remoteCam}
            autoPlay
            playsInline
          ></video>
          {meetingInfo.video.local.videoOn && (
            <motion.div
              className="h-[30%] w-[30%] z-100 relative left-[30%] bottom-[5%] rounded-2xl bg-pink flex flex-col justify-center items-center"
              drag
              dragConstraints={camContainer}
              ref={localCamContainer}
              dragMomentum={false}
            >
              <video
                ref={localCam}
                autoPlay
                playsInline
                className="h-[90%] w-[90%] absolute "
              ></video>
            </motion.div>
          )}
        </motion.div>
      )}
      {meetingInfo.isModalOpen && (
        <div className="h-full bg-slate-700 flex flex-col justify-center items-center rounded-t-2xl">
          <div className="h-5/6 w-1/2 mt-5 rounded-2xl bg-pink flex flex-col justify-center items-center">
            <div className="h-1/3 w-full flex flex-col justify-center text-center font-extrabold text-xl">
              체리콜을 시작할까요?
            </div>
            <div className="h-2/3 w-5/6  flex flex-col-reverse justify-center">
              <div className="h-14 bg-white rounded-b-2xl flex flex-row justify-center">
                <button
                  className="w-10 my-2 mx-5 border-2"
                  onClick={() => {
                    const targetVolume =
                      meetingInfo.video.local.volume == 0 ? 0.5 : 0;
                    const targetOn = meetingInfo.video.local.videoOn;
                    updateLocalVideo(targetOn, targetVolume);
                  }}
                ></button>
                <button
                  className="w-10 my-2 mx-5 border-2"
                  onClick={() => {
                    const targetVolume = meetingInfo.video.local.volume;
                    const targetOn = !meetingInfo.video.local.videoOn;
                    updateLocalVideo(targetOn, targetVolume);
                  }}
                ></button>
              </div>

              <div className="h-full rounded-t-2xl bg-slate-700 flex justify-center relative">
                <video
                  id="ready-cam"
                  ref={readyCam}
                  autoPlay
                  playsInline
                  className="absolute h-full w-full"
                ></video>
              </div>
            </div>
            <div className="h-1/4 w-5/6 flex flex-row justify-between items-center">
              <button
                className={
                  meetingInfo.stream.localMediaStream.getTracks().length !== 0
                    ? "px-5 h-14 bg-skyblue rounded-2xl font-extrabold text-xl"
                    : "px-5 h-14 bg-zinc-400 rounded-2xl font-extrabold text-xl"
                }
                disabled={
                  meetingInfo.stream.localMediaStream.getTracks().length === 0
                }
                onClick={(event) => {
                  event.preventDefault();
                  meetingInfo.stream.localMediaStream
                    .getTracks()
                    .forEach((track) => {
                      track.stop();
                    });
                }}
              >
                알림보내기
              </button>
              <button
                className={
                  meetingInfo.stream.localMediaStream.getTracks().length !== 0
                    ? "px-5 h-14 bg-skyblue rounded-2xl font-extrabold text-xl"
                    : "px-5 h-14 bg-zinc-400 rounded-2xl font-extrabold text-xl"
                }
                disabled={
                  meetingInfo.stream.localMediaStream.getTracks().length === 0
                }
                onClick={() => {
                  setConnection();

                  setMeetingInfo((prevMeetingInfo) => {
                    const newMeetingInfo = { ...prevMeetingInfo };
                    newMeetingInfo.isModalOpen = false;
                    return newMeetingInfo;
                  });
                  listen();
                }}
              >
                입장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeftWindow;
