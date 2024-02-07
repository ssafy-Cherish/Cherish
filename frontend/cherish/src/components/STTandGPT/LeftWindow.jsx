
import WaitingBox from "./WaitingBox";
import CallBox from "./CallBox";

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
        <CallBox
          meetingInfo={meetingInfo}
          camContainer={camContainer}
          remoteCam={remoteCam}
          localCamContainer={localCamContainer}
          localCam={localCam}
        />
      )}
      {meetingInfo.isModalOpen && (
        <WaitingBox
          meetingInfo={meetingInfo}
          updateLocalVideo={updateLocalVideo}
          readyCam={readyCam}
          setConnection={setConnection}
          setMeetingInfo={setMeetingInfo}
          listen={listen}
        />
      )}
    </div>
  );
}

export default LeftWindow;
