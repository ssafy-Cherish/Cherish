import PotTimeLine from "./PotTimeLine";

export default function PotExp() {
  return (
    <>
      <div id="PotHistory" className="col-span-4 h-[35vw]">
        <div className="flex flex-col items-center mt-[1.5vw]">
          <p className="text-[2vw] text-text-black font-bold">
            이달의 성장 내역
          </p>
          <ul
            id="PotTimeLine"
            className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical mt-[1vw] overflow-y-auto h-[30vw]"
          >
            <PotTimeLine />
          </ul>
        </div>
      </div>
    </>
  );
}
