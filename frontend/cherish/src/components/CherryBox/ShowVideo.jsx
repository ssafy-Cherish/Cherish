import VideoStartIcon from "../../assets/VideoIcon/VideoStartIcon.svg";

export default function ShowVideo({ handleClickVideoOpen, video }) {
  console.log("파일패스전달", video);

  return (
    <>
      <div className="mt-[3vw] ml-[1.5vw]">
        <button
          onClick={handleClickVideoOpen}
          className="ml-[3vw] mb-[1vw] bg-cherry rounded-lg px-[0.5vw] py-[0.2vw] text-white hover:bg-[#F5473E]"
        >
          뒤로가기
        </button>
        <p className="text-[2.5vw] ml-[3vw]">
          우리들의 "<span className="text-cherry">{video.keyword}</span>"
        </p>
        <div className="flex flex-col items-center justify-center">
          <div className="w-[42vw] mt-[1vw]">
            <div className="w-[4wvw] h-[25vw] bg-black">
              <video
                src={video.filepath}
                className="rounded-t-[15px]"
                id="video-output"
                autoPlay
                playsInline
              ></video>
            </div>
            <div className="bg-pink rounded-b-[15px] shadow-md text-center py-[0.5vw]">
              <button>
                <img src={VideoStartIcon} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
