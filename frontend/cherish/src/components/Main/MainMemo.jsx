import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getMemoFetch } from "../../services/diaryService";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MemoImg from "../../assets/MemoImg.svg";
import MemoModal from "../Diary/MemoModal";
import useCoupleStore from "../../stores/useCoupleStore";

export default function MainMemo() {
  const { coupleId } = useCoupleStore();
  const dateFormat = dayjs().format("YYYY-MM-DD");
  // 메모 모달 ON, OFF
  const [openMemoModal, setOpenMemoModal] = useState(false);
  // memo 내용
  const [memo, setMemo] = useState("");
  function showMemo() {
    setOpenMemoModal(true);
  }
  function closeMemoModal() {
    setOpenMemoModal(false);
  }
  const { data: memoData } = useQuery({
    queryKey: ["memo", dateFormat],
    queryFn: () => getMemoFetch(coupleId, dateFormat),
    staleTime: 0,
    select: (data) => {
      return data.memo;
    },
  });

  useEffect(() => {
    if (memoData) {
      setMemo(memoData.content);
    }
  }, [memoData]);

  function handleMemoData(content) {
    setMemo(content);
  }

  return (
    <>
      {/* 메모 영역 */}
      <div className="flex justify-end items-center">
        <motion.div
          className="w-[17vw] relative hover:cursor-pointer"
          // whileHover={{ scale: 1.2 }}
          onClick={showMemo}
        >
          <div className="max-w-full h-full grid grid-rows-6 justify-center absolute">
            <div className="text-[1vw] text-center row-start-2 max-w-full">
              <span>Memo</span>
            </div>
            <div
              className="row-start-3 row-span-2 max-w-[17vw] w-[17vw] text-center  px-[4vw] text-[0.8vw]"
              style={{
                whiteSpace: "pre-line",
                wordWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {memo || "작성된 메모가 없어요."}
            </div>
          </div>
          <img className="w-full" src={MemoImg} alt="MemoImg" />
        </motion.div>
      </div>
      <AnimatePresence>
        {openMemoModal && (
          <MemoModal
            onClose={closeMemoModal}
            memo={memo}
            handleMemoData={handleMemoData}
            coupleId={coupleId}
            date={dateFormat}
          ></MemoModal>
        )}
      </AnimatePresence>
    </>
  );
}
