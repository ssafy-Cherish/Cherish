import { useQuery } from "@tanstack/react-query";
import DropdownIcon from "../../assets/Common/DropdownIcon.svg";
import useCoupleStore from "../../stores/useCoupleStore";
import { getYearMonth } from "../../services/CherryBoxService";

export default function Keyword({
  handleSelectKeyword,
  selectKeyword,
  isOpen,
  handleClickIsOpen,
}) {
  let keywordClassName = `absolute z-20 left-[65%] transition-[height] duration-500 bg-white float-end w-[15vw] py-[0.5vw] text-[1.3vw] mr-[2vw] rounded-[40px] shadow-md text-center ${
    isOpen
      ? "h-[20vw] flex flex-col rounded-[15px] overflow-y-auto"
      : "h-[3vw] hover:bg-[#EFEFEF] cursor-pointer"
  }`;
  const { coupleId } = useCoupleStore();
  const { data } = useQuery({
    queryKey: ["yearMonth", coupleId],
    queryFn: () => getYearMonth(coupleId),
  });

  return (
    <>
      <div
        id="keyword"
        onClick={handleClickIsOpen}
        className={keywordClassName}
      >
        <div
          className={
            "w-[80%] grid grid-cols-4 ml-[2rem] " +
            (isOpen ? "border-b-2 border-black" : "")
          }
        >
          <p className="col-span-3 my-auto">{selectKeyword}</p>
          <img
            className={"col-span-1 w-[2vw] my-auto " + (isOpen && "rotate-180")}
            src={DropdownIcon}
            alt="DropdownIcon"
          />
        </div>
        {isOpen &&
          data &&
          data.yearMonth.map((date) => (
            <div
              key={date}
              onClick={(event) => handleSelectKeyword(event.target.innerText)}
              className="m-2 pl-[3.2rem] text-left cursor-pointer text-text-black hover:text-[#888888]"
            >
              {date}
            </div>
          ))}
      </div>
    </>
  );
}
