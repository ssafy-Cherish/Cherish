import { motion } from "framer-motion";
import "./Carousel.css";
import { useQuery } from "@tanstack/react-query";
import useCoupleStore from "../../stores/useCoupleStore";
import { getPinedClip } from "../../services/IndexPageService";
import cherish from "../../assets/Common/cherish.png";

export default function Testca() {
  const { coupleId } = useCoupleStore();
  const { data, isLoading } = useQuery({
    queryKey: ["pinedClip", coupleId],
    queryFn: () => getPinedClip(coupleId),
    refetchOnMount: true,
  });

  if (isLoading) {
    return (
      <div className="view skeleton border-2 rounded-[20px] px-[1.2vw] shadow-md h-[17vw]"></div>
    );
  }

  const videoList = new Array(6).fill(null);
  data.pinnedclip.forEach((item, idx) => {
    videoList[idx] = item.filepath;
  });

  return (
    <>
      <div className="view border-2 rounded-[20px] px-[1.2vw] shadow-md h-[17vw]">
        <ul className="slide">
          {videoList.concat(videoList).map((item, idx) => {
            //concat으로 original과 clone 연결
            return (
              <motion.li
                whileHover={{ scale: 1.1 }}
                key={idx}
                className="bg-pink mx-[1vw] rounded-[25px] border-[5px] border-cherry"
              >
                {item ? (
                  <video
                    preload="metadata"
                    onClick={(event) => {
                      event.preventDefault();
                      if (event.target.paused === false) {
                        event.target.pause();
                      } else {
                        event.target.play();
                      }
                    }}
                    className="w-full h-full"
                    src={`${item}#t=100`}
                  ></video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img className="w-[50%]" src={cherish} alt="" />
                    <p className="text-[1.3vw] text-text-black font-bold">
                      <span className="text-cherry font-bold">다이어리</span>
                      에서<br></br> 추억을
                      <span className="text-cherry font-bold"> Pin</span>으로
                      <br></br> 고정하세요!
                    </p>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
