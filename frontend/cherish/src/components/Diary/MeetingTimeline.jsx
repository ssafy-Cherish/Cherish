/* eslint-disable react/prop-types */
const MeetingTimeline = ({ meeting }) => {
  function showChat(chats) {
    console.log(chats);
  }

  console.log(meeting);

  return (
    <li key={meeting.id} className="grid grid-cols-2 gap-5">
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org//'/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="timeline-end">
        <div className="font-mono italic">
          {meeting.craetedAt}
          <button onClick={() => showChat(meeting.chats)}> [채팅 기록]</button>
        </div>
        {meeting.clips.map((clip) => (
          <div key={clip.id} className="h-1/3 mb-5 flex justify-center">
            <img src={`https://cataas.com/cat/cute?${clip.id}`} alt="" className="h-full w-full" />
          </div>
        ))}
      </div>
      <hr />
    </li>
  );
};

export default MeetingTimeline;
