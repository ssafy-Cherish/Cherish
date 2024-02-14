import { useState } from "react";

import WaitingBox from "./WaitingBox";
import CallBox from "./CallBox";

import micImg from "../../assets/meeting/mic.svg";
import camImg from "../../assets/meeting/cam.svg";
import barImg from "../../assets/meeting/bar.svg";
import speakerImg from "../../assets/meeting/speaker.svg";

import phoneOnImg from "../../assets/meeting/phone-on.svg";
import phoneOffImg from "../../assets/meeting/phone-off.svg";
import loadingImg from "../../assets/meeting/loading.svg";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

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
  updateRemoteVideo,
  stop,
}) {
  const [barIsVisible, setBarIsVisible] = useState(false);
  const nav = useNavigate();

  return (
    <div className="h-3/4 m-2 rounded-2xl flex flex-col-reverse">
      <div className="h-14 bg-pink rounded-b-2xl">
        {!meetingInfo.isModalOpen && (
          <div className="w-full h-full flex flex-row justify-between">
            <div className="m-2 w-1/3 flex flex-row justify-evenly">
              <div className="w-[15%] h-full p-2">
                <button
                  className=" relative flex flex-col justify-center items-center w-full h-full"
                  onClick={(event) => {
                    event.preventDefault();
                    const targetVolume =
                      meetingInfo.video.local.volume == 0 ? 0.5 : 0;
                    const targetOn = meetingInfo.video.local.videoOn;
                    updateLocalVideo(targetOn, targetVolume, 1);
                  }}
                >
                  <img className="w-full h-full absolute z-50" src={micImg} />
                  {meetingInfo.video.local.volume == 0 && (
                    <img className="w-full h-full absolute" src={barImg}></img>
                  )}
                </button>
              </div>
              <div className="w-[15%] h-full p-2">
                <button
                  className=" relative flex flex-col justify-center items-center w-full h-full"
                  onClick={(event) => {
                    event.preventDefault();
                    const targetVolume = meetingInfo.video.local.volume;
                    const targetOn = !meetingInfo.video.local.videoOn;
                    updateLocalVideo(targetOn, targetVolume, 1);
                  }}
                >
                  <img className="w-full h-full absolute" src={camImg} />
                  {!meetingInfo.video.local.videoOn && (
                    <img className="w-full h-full absolute" src={barImg}></img>
                  )}
                </button>
              </div>
              <div
                className="w-full h-full  flex flex-row items-center p-2"
                onMouseOver={() => {
                  setBarIsVisible(true);
                }}
                onMouseOut={() => {
                  setBarIsVisible(false);
                }}
              >
                <button
                  className="w-1/6 h-[100%]  flex flex-col justify-center items-center relative"
                  onClick={(event) => {
                    event.preventDefault();
                    updateRemoteVideo(
                      meetingInfo.video.remote.videoOn,
                      meetingInfo.video.remote.volume,
                      meetingInfo.video.remote.volumeFactor != 0 ? 0 : 1,
                      false
                    );
                  }}
                >
                  <img className="w-full h-[80%] absolute" src={speakerImg} />
                  {meetingInfo.video.remote.volumeFactor == 0 && (
                    <img className="w-full h-full absolute" src={barImg}></img>
                  )}
                </button>

                <input
                  type="range"
                  min={0}
                  max="1"
                  value={meetingInfo.video.remote.volumeFactor}
                  step="0.01"
                  className={`range w-[85%] h-[20%] ${
                    barIsVisible ? "" : "hidden"
                  }`}
                  onChange={(event) => {
                    event.preventDefault();
                    const nextVolumeFactor = event.target.value;
                    console.log(nextVolumeFactor);

                    updateRemoteVideo(
                      meetingInfo.video.remote.videoOn,
                      meetingInfo.video.remote.volume,
                      nextVolumeFactor,
                      false
                    );

                    setMeetingInfo((prevMeetingInfo) => {
                      const newMeetingInfo = { ...prevMeetingInfo };
                      newMeetingInfo.video.remote.volumeFactor =
                        nextVolumeFactor;
                      return newMeetingInfo;
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row justify-center items-center">
              {meetingInfo.connect.offerState === 1 ? (
                <button
                  className=" m-2 w-14 rounded-2xl btn bg-green-400 hover:bg-green-600"
                  onClick={(event) => {
                    event.preventDefault();
                    createOffer();

                    // 이승준이 수정한 코드
                    // 음성인식을 한국어로 설정하고 결과를 말하는게 끝나면 한 꺼번에 받아오는 방식으로 변경
                    listen({ interimResults: false, lang: "ko-KR" });
                  }}
                >
                  <img src={phoneOnImg} />
                </button>
              ) : meetingInfo.connect.offerState === 2 ? (
                <div className="m-2 w-14 rounded-2xl btn bg-gray-100">
                  <img src={loadingImg} className="w-full h-full" />
                </div>
              ) : meetingInfo.connect.offerState === 3 ? (
                <button
                  className="m-2 w-14 rounded-2xl btn bg-red-400 hover:bg-red-600"
                  onClick={(event) => {
                    event.preventDefault();
                    if (confirm("통화를 종료하고 메인으로 이동할까요?")) {
                      nav("/");
                    }
                  }}
                >
                  <img src={phoneOffImg} />
                </button>
              ) : (
                <button
                  className=" m-2 w-14 rounded-2xl btn bg-gray-400"
                  disabled="true"
                >
                  <img src={phoneOnImg} />
                </button>
              )}
            </div>
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
