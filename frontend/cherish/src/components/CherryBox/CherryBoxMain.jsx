import Keyword from "./Keyword";
import VideoList from "./VideoList";

export default function CherryBoxMain({
  handleSelectKeyword,
  selectKeyword,
  isOpen,
  handleClickIsOpen,
  handleClickVideoOpen,
}) {
  return (
    <div className="mt-[2.5vw] ml-[1.5vw] relative">
      <div>
        <p className="text-[2.5vw] mb-[1vw] text-cherry">체리보관함</p>
        <p className="text-[1.2vw] mb-[0.5vw]">
          여러분들의 아름다웠던 <span className="text-cherry">순간</span>을
          모아봤어요!
        </p>
        <p className="text-[1.2vw] mb-[1vw]">
          체리씨와 함께 가장 많이 말했던{" "}
          <span className="text-cherry">키워드</span>는 무엇일까요?
        </p>
      </div>
      <Keyword
        handleSelectKeyword={handleSelectKeyword}
        selectKeyword={selectKeyword}
        isOpen={isOpen}
        handleClickIsOpen={handleClickIsOpen}
      />

      <div
        id="cherrybox"
        className="mt-[6vw] flex flex-row gap-5 flex-wrap h-[22vw] rounded-[15px] overflow-y-auto"
      >
        {selectKeyword === "날짜 선택" ? (
          <div className="text-[2vw] font-bold m-auto"><span className="text-cherry">날짜</span>를 선택하세요</div>
        ) : (
          <VideoList
            selectKeyword={selectKeyword}
            handleClickVideoOpen={handleClickVideoOpen}
          />
        )}
      </div>
    </div>
  );
}
