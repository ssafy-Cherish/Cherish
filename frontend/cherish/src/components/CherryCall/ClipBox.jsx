function ClipBox({ meetingInfo, clipWindow }) {
  return (
    <div className="h-[80%] flex flex-col justify-between relative">
      <div
        className="scroll-box bg-white mx-4 rounded-2xl h-[100%] overflow-y-scroll py-[5%] absolute"
        ref={clipWindow}
      >
        {meetingInfo.clipHistory.map((url, idx) => {
          return (
            <div key={idx} className="flex flex-col items-center my-4">
              {
                /* <div className="flex flex-row justify-evenly">
                  <div className="w-[50%]">
                    <video
                      src={URL.createObjectURL(clip[0])}
                      onClick={(event) => {
                        event.preventDefault();
                        event.target.play();
                      }}
                    ></video>
                  </div>
                  <div className="w-[50%]">
                    <video
                      src={URL.createObjectURL(clip[1])}
                      onClick={(event) => {
                        event.preventDefault();
                        event.target.play();
                      }}
                    ></video>
                  </div>
                </div> */
                <video
                  src={url}
                  onClick={(event) => {
                    event.preventDefault();
                    if (event.target.paused) {
                      event.target.play();
                    } else {
                      event.target.pause();
                    }
                  }}
                ></video>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClipBox;
