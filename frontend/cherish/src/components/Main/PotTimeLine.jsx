export default function PotTimeLine({ timeLine }) {
  const keys = Object.keys(timeLine);
  const timeline = [];
  keys.forEach((key, idx) => {
    const date = (
      <li key={key}>
        <div className="timeline-middle">
          <div className="rounded-full bg-subpuple w-[1vw] h-[1vw]"></div>
        </div>
        <div
          className={
            "mb-10 " +
            (idx % 2 === 0 ? "timeline-start md:text-start" : "timeline-end md:text-end")
          }
        >
          <div className="text-[1vw] text-text-black mb-[3vw] font-bold">
            {key}
          </div>
          {timeLine[key].map((item) => (
            <div key={item.id} className="text-[1vw] mt-[1.5vw] text-text-gray">
              {item.content} +{item.exp}
            </div>
          ))}
        </div>
        <hr className="bg-subpuple" />
      </li>
    );
    timeline.push(date);
  });

  return <>{timeline}</>;
}
