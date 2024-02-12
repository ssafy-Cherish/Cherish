export default function PotGraph({ exp }) {
  return (
    <div
      id="Graph"
      className="row-start-8 row-end-12 flex justify-center items-center"
    >
      <div
        className="radial-progress text-cherry mt-[3vw] flex flex-col justify-center items-center"
        style={{ "--value": exp, "--size": "12vw" }}
        role="progressbar"
      >
        <p className="text-[1.3vw] text-text-black font-bold">현재 성장치</p>
        <p className="text-[1.5vw] font-bold">{exp}%</p>
      </div>
    </div>
  );
}
