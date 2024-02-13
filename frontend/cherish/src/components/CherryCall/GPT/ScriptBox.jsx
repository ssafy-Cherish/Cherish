function ScriptBox({ meetingInfo }) {
  function scriptType(elem, idx) {
    switch (elem.isLocal) {
      case 0: // 자신
        return (
          <div
            key={idx}
            className="flex flex-row justify-end pl-8 pr-4 pt-4 w-full"
          >
            <div
              style={{
                backgroundColor: "#FEF8EC",
                whiteSpace: "pre-line",
                wordWrap: "break-word",
              }}
              className="py-2 pl-4 pr-4 rounded-tl-xl rounded-b-xl drop-shadow max-w-[90%]"
            >
              {elem.message}
            </div>
          </div>
        );

      case 1: // 상대
        return (
          <div
            key={idx}
            className="flex flex-row justify-start pl-4 pr-8 pt-4 w-full"
          >
            <div
              style={{
                backgroundColor: "#E0F4FF",
                whiteSpace: "pre-line",
                wordWrap: "break-word",
              }}
              className="py-2 pl-4 pr-4 rounded-tr-xl rounded-b-xl drop-shadow max-w-[90%]"
            >
              {elem.message}
            </div>
          </div>
        );

      case 2: // gpt
        return (
          <div
            key={idx}
            className="flex flex-row justify-start pl-4 pr-8 pt-4 w-full"
          >
            <div
              style={{
                backgroundColor: "#fcdeeb",
                whiteSpace: "pre-line",
                wordWrap: "break-word",
              }}
              className="py-2 pl-4 pr-4 rounded-tr-xl rounded-b-xl drop-shadow max-w-[90%]"
            >
              {elem.message}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="h-[80%] w-full flex flex-col justify-between px-4">
      <div className=" relative h-full">
        <div className="scroll-box bg-white rounded-2xl h-[100%] w-[100%] overflow-y-scroll py-[5%] absolute">
          {meetingInfo.scriptHistory.map((elem, idx) => {
            return scriptType(elem, idx);
          })}
        </div>
      </div>
    </div>
  );
}

export default ScriptBox;
