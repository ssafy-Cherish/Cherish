import { useState, useEffect } from "react";
import { useSpeechRecognition } from "react-speech-kit";

var canCheck = true;

function STTGPT() {
  // fetch
  const fetchTest = () => {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `${keywords}가 뭔지 간단하게 설명해줘.` },
    ];

    // fetch("http://localhost:8080/meeting/chat", {
    fetch("https://i10d103.p.ssafy.io/meeting/chat", {
      method: "POST", // HTTP 메소드를 POST로 설정
      headers: {
        Accept: "*/*", // 응답 데이터 타입
        "Content-Type": "application/json", // 콘텐츠 타입을 application/json으로 지정
      },
      body: JSON.stringify({
        // 요청 바디에 JSON 데이터를 문자열로 변환하여 전달
        id: 0,
        kakaoId: 0,
        nickname: "string",
        meetingId: 3,
        content: "서버 api 작동 테스트",
        createdAt: "string",
      }),
    })
      .then((response) => console.log(response)) // 응답을 JSON으로 변환
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error); // 오류 처리
      });
  };

  // STT
  const [recogString, setRecogString] = useState("");
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);
      if (recogString != result) {
        const arr = result.split(" ");
        if (canCheck && arr[arr.length - 1] === "안녕") {
          const today = new Date();
          setCaptureList((prev) => {
            return [today.toLocaleString(), ...prev];
          });
          canCheck = false;
          setTimeout(() => {
            canCheck = true;
          }, 1500);

          recordFlag[nowIdx][0] = true;
          recordFlag[nowIdx][1] = true;
        }
      }
      setRecogString(result);
    },
  });

  // GPT
  const [apiKey, setApiKey] = useState("");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState("");
  const search = () => {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `${keywords}가 뭔지 간단하게 설명해줘.` },
    ];

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", // HTTP 메소드를 POST로 설정
      headers: {
        Authorization: `Bearer ${apiKey}`, // API 키를 포함한 인증 헤더
        "Content-Type": "application/json", // 콘텐츠 타입을 application/json으로 지정
      },
      body: JSON.stringify({
        // 요청 바디에 JSON 데이터를 문자열로 변환하여 전달
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        n: 1,
        messages: messages,
      }),
    })
      .then((response) => response.json()) // 응답을 JSON으로 변환
      .then((data) => {
        const output = data.choices
          .map((choice) => choice.message.content.split("\n").join("<br/>"))
          .join("");
        setResult(output); // 결과를 설정
      })
      .catch((error) => {
        console.error(error); // 오류 처리
      });
  };

  return (
    <div className="container">
      <button onClick={fetchTest}>fetch test</button>
      <br />
      <br />
      <p>{recogString}</p>
      {listening && <div>음성인식 활성화 중</div>}
      <button onMouseDown={listen} onMouseUp={stop}>
        🎤
      </button>
      <div>
        <h1>주제 추천 AI</h1>
        <label htmlFor="api_key">API 키:</label>
        <input
          type="text"
          id="api_key"
          name="api_key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
        <br />
        <br />
        <label htmlFor="keywords">키워드:</label>
        <input
          type="text"
          id="keywords"
          name="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
        />
        <button onClick={search}>입력</button>
        <br />
        <br />
        <div id="result" dangerouslySetInnerHTML={{ __html: result }} />
      </div>
    </div>
  );
}

export default STTGPT;
