import WaitingBox from "./WaitingBox";
import CallBox from "./CallBox";

import micImg from "../../assets/meeting/mic.svg";
import camImg from "../../assets/meeting/cam.svg";
import barImg from "../../assets/meeting/bar.svg";

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
      <div className="h-14 bg-pink rounded-b-2xl">
        {!meetingInfo.isModalOpen && (
          <div className="w-full h-full flex flex-row justify-between">
            <div className="border-2 m-2 w-1/3 flex flex-row">
              <div className="w-[15%] h-full border-2">
                <button
                  className="border-2 relative flex flex-col justify-end items-center w-full h-full"
                  onClick={(event) => {
                    event.preventDefault();
                    const targetVolume =
                      meetingInfo.video.local.volume == 0 ? 0.5 : 0;
                    const targetOn = meetingInfo.video.local.videoOn;
                    updateLocalVideo(targetOn, targetVolume, true);
                  }}
                >
                  <img className="w-full h-full absolute z-50" src={micImg} />
                  {meetingInfo.video.local.volume == 0 && (
                    <img className="w-full h-full absolute" src={barImg}></img>
                  )}
                </button>
              </div>
              <div className="w-[15%] h-full border-2">
                <button
                  className="border-2 relative flex flex-col justify-end items-center w-full h-full"
                  onClick={(event) => {
                    event.preventDefault();
                    const targetVolume = meetingInfo.video.local.volume;
                    const targetOn = !meetingInfo.video.local.videoOn;
                    updateLocalVideo(targetOn, targetVolume, true);
                  }}
                >
                  <img className="w-full absolute" src={camImg} />
                  {!meetingInfo.video.local.videoOn && (
                    <img className="w-full  absolute" src={barImg}></img>
                  )}
                </button>
              </div>
              <div className="w-full h-full border-2">
                <button className="w-1/6 h-[100%] border-2"></button>
              </div>
            </div>
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
        )}
      </div>

      <CallBox
        meetingInfo={meetingInfo}
        camContainer={camContainer}
        remoteCam={remoteCam}
        localCamContainer={localCamContainer}
        localCam={localCam}
      />

      <WaitingBox
        
        meetingInfo={meetingInfo}
        updateLocalVideo={updateLocalVideo}
        readyCam={readyCam}
        setConnection={setConnection}
        setMeetingInfo={setMeetingInfo}
        listen={listen}
      />
    </div>
  );
}

export default LeftWindow;
