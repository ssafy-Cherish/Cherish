import micImg from "../../assets/meeting/mic.svg";
import camImg from "../../assets/meeting/cam.svg";
import barImg from "../../assets/meeting/bar.svg";

function WaitingBox({
  meetingInfo,
  updateLocalVideo,
  readyCam,
  setConnection,
  setMeetingInfo,
  listen,
}) {
  return (
    <div
      className={`h-full bg-slate-700 flex flex-col justify-center items-center rounded-t-2xl ${
        meetingInfo.isModalOpen ? "" : "hidden"
      }`}
    >
      <div className="h-5/6 w-1/2 mt-5 rounded-2xl bg-pink flex flex-col justify-center items-center">
        <div className="h-1/3 w-full flex flex-col justify-center text-center font-extrabold text-xl">
          체리콜을 시작할까요?
        </div>
        <div className="h-2/3 w-5/6  flex flex-col-reverse justify-center">
          <div className="h-14 bg-white rounded-b-2xl flex flex-row justify-center">
            <button
              className="w-10 my-2 mx-5 border-2 flex flex-col justify-center items-center relative"
              onClick={(event) => {
                event.preventDefault();
                const targetVolume =
                  meetingInfo.video.local.volume == 0 ? 0.5 : 0;
                const targetOn = meetingInfo.video.local.videoOn;
                updateLocalVideo(targetOn, targetVolume, 0);
              }}
            >
              <img className="h-full absolute" src={micImg} />
              {meetingInfo.video.local.volume == 0 && (
                <img className="h-full absolute" src={barImg}></img>
              )}
            </button>
            <button
              className="w-10 my-2 mx-5 border-2 flex flex-col justify-center items-center relative"
              onClick={(event) => {
                event.preventDefault();
                const targetVolume = meetingInfo.video.local.volume;
                const targetOn = !meetingInfo.video.local.videoOn;
                updateLocalVideo(targetOn, targetVolume, 0);
              }}
            >
              <img className="h-full absolute" src={camImg} />
              {!meetingInfo.video.local.videoOn && (
                <img className="h-full absolute" src={barImg}></img>
              )}
            </button>
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

              updateLocalVideo(meetingInfo.video.local.videoOn, meetingInfo.video.local.volume, 1);

              listen();
            }}
          >
            입장
          </button>
        </div>
      </div>
    </div>
  );
}

export default WaitingBox;
