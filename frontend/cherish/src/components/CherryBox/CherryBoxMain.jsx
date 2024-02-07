import Keyword from "./Keyword";

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
        <div
          onClick={handleClickVideoOpen}
          className="bg-white w-[15vw] h-[10vw] rounded-[15px] flex items-center justify-center"
        >
          <p className="text-[1.5vw]">
            우리들의 "<span className="text-cherry">사랑해</span>"
          </p>
        </div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px] flex items-center justify-center">
          <p className="text-[1.5vw]">
            우리들의 "<span className="text-cherry">사랑해</span>"
          </p>
        </div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px] flex items-center justify-center">
          <p className="text-[1.5vw]">
            우리들의 "<span className="text-cherry">사랑해</span>"
          </p>
        </div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px]"></div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px]"></div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px]"></div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px]"></div>
        <div className="bg-white w-[15vw] h-[10vw] rounded-[15px]"></div>
      </div>
    </div>
  );
}
