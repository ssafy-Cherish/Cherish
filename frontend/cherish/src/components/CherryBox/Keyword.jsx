import DropdownIcon from "../../assets/DropdownIcon.svg";

const dummy = [
  "2024년 1월",
  "2023년 12월",
  "2023년 10월",
  "2023년 9월",
  "2023년 8월",
  "2023년 6월",
  "2023년 5월",
  "2023년 4월",
  "2023년 3월",
  "2023년 2월",
];

export default function Keyword({
  handleSelectKeyword,
  selectKeyword,
  isOpen,
  handleClickIsOpen,
}) {
  let keywordClassName = `bg-white float-end w-[15vw] py-[0.5vw] text-[1.3vw] mr-[2vw] rounded-[40px] shadow-md text-center ${
    isOpen
      ? "h-[20vw] z-20 absolute left-[65.5%] flex flex-col rounded-[15px] overflow-y-auto"
      : undefined
  }`;

  return (
    <>
      <div
        id="keyword"
        onClick={handleClickIsOpen}
        className={keywordClassName}
      >
        <div className={isOpen ? "w-[80%] grid grid-cols-4 ml-[1.7rem] border-b-2 border-black" : "w-[80%] grid grid-cols-4 ml-[2rem]"}>
          <p
            className="col-span-3 my-auto"
          >
            {selectKeyword}
          </p>
          <img
            className="col-span-1 w-[2vw] my-auto"
            src={DropdownIcon}
            alt="DropdownIcon"
          />
        </div>
        {isOpen &&
          dummy.map((test) => (
            <div
              key={test}
              onClick={(event) => handleSelectKeyword(event.target.innerText)}
              className="m-2 pl-[3.2rem] text-left"
            >
              {test}
            </div>
          ))}
      </div>
    </>
  );
}