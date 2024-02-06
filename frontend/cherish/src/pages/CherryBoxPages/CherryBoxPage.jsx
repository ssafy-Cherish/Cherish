import CherryBoxMain from "../../components/CherryBox/CherryBoxMain";
import ShowVideo from "../../components/CherryBox/ShowVideo";
import ModalRoute from "../../components/Common/ModalRoute";

import { useState } from "react";

export default function CherryBoxPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectKeyword, setSelectKeyword] = useState("날짜 선택");
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleClickIsOpen = () => {
    setIsOpen((pre) => !pre);
  };

  const handleSelectKeyword = (keyword) => {
    setSelectKeyword((pre) => keyword);
  };

  const handleClickVideoOpen = () => {
    setIsVideoOpen((pre) => !pre)
  }
  return (
    <ModalRoute isX={true} modalcss="w-[50vw] h-[40vw] rounded-[20px] bg-pink">
      {isVideoOpen ? (
        <ShowVideo handleClickVideoOpen={handleClickVideoOpen} />
      ) : (
        <CherryBoxMain
          handleSelectKeyword={handleSelectKeyword}
          selectKeyword={selectKeyword}
          isOpen={isOpen}
          handleClickIsOpen={handleClickIsOpen}
          handleClickVideoOpen = {handleClickVideoOpen}
        />
      )}
    </ModalRoute>
  );
}
