import Modal from "../../components/Main/Modal";
import CloseIcon from "../../assets/CloseIcon.svg";
import HeartIcon from "../../assets/HeartIcon.svg";
import PotLv2 from "../../assets/PotLv2.svg"

export default function PotPage() {
  return (
    <Modal z={1} height="41vw" width="65vw">
      <div className="float-right mt-[1.5vw] mr-[1.5vw]">
        <img src={CloseIcon} alt="CloseIcon" />
      </div>
      <div id="Wrapper" className="grid grid-cols-12 gap-5 h-[35vw] mt-[4vw] mx-[2vw]">
        <div id="Total" className="col-span-4 grid grid-rows-12 gap-2 h-[37vw]">
          <div id="Des" className="row-span-2">
            <p className="text-[1.3vw]">D + 99</p>
            <div id="PotCoupleName" className="flex flex-row items-center">
              <p className="text-[2.5vw]">나희도</p>
              <div>
                <img src={HeartIcon} alt="HeartIcon" />
              </div>
              <p className="text-[2.5vw]">백이진</p>
            </div>
          </div>
          <div id="CoupleStatus" className="row-start-4 row-end-7">
            <p className="text-[1.5vw]">우리가 모은 클립 갯수는?</p>
            <p className="text-[1.3vw]">
              <span className="text-[2vw] text-cherry">78</span>개
            </p>
            <p className="text-[1.5vw]">우리가 체리콜로 만난 시간은?</p>
            <p className="text-[1.3vw]">
              <span className="text-[2vw] text-cherry">129</span>시간 <span className="text-[2vw] text-cherry">28</span>분 <span className="text-[2vw] text-cherry">17</span>초
            </p>
          </div>
          <div id="Graph" className="row-start-8 row-end-12">그래프</div>
        </div>
        <div id="CherryPot" className="col-span-4 flex flex-col items-center mt-[3vw]">
          <div className="h-[70%]"><img className="w-[100%]" src={PotLv2} alt="PotLv1" /></div>
          <p className="mt-[4vw]">체리 떡잎 단계</p>
        </div>
        <div id="PotTimeLine" className="col-span-4 h-[30vw] mt-[2vw] overflow-y-auto border">
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
  <li>
    <div className="timeline-middle">
      <div className="rounded-full bg-subpuple w-[1vw] h-[1vw]"></div>
    </div>
    <div className="timeline-start md:text-end mb-10">
      <time className="text-[1vw]">2023. 09. 17</time>
      <div className="text-[1vw] mt-[3vw]">체리콜 TIME +6</div>
      <span className="text-[1vw]">클립 영상 +1</span>
    </div>
    <hr className="bg-subpuple"/>
  </li>
  <li>
    <hr />
    <div className="timeline-middle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    </div>
    <div className="timeline-end mb-10">
      <time className="font-mono italic">2023. 09. 17</time>
      <div className="text-lg font-black">체리콜 TIME +6</div>
      클립 영상 +1
    </div>
    <hr />
  </li>
  <li>
    <hr />
    <div className="timeline-middle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    </div>
    <div className="timeline-start md:text-end mb-10">
      <time className="text-[1.5vw]">2023. 09. 17</time>
      <div className="text-[1.5vw]">체리콜 TIME +6</div>
      클립 영상 +1
    </div>
    <hr />
  </li>
  <li>
    <hr />
    <div className="timeline-middle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    </div>
    <div className="timeline-end mb-10">
      <time className="font-mono italic">2023. 09. 17</time>
      <div className="text-lg font-black">체리콜 TIME +6</div>
      클립 영상 +1
    </div>
    <hr />
  </li>
  <li>
    <hr />
    <div className="timeline-middle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    </div>
    <div className="timeline-start md:text-end mb-10">
      <time className="font-mono italic">2023. 09. 17</time>
      <div className="text-lg font-black">체리콜 TIME +6</div>
      클립 영상 +1
    </div>
  </li>
</ul>
          </div>
      </div>
    </Modal>
  );
}
