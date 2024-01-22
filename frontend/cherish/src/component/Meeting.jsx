import { useRef, useState, useEffect } from 'react';

var localStream;
var remoteStream;

var mediaRecorder;
var recordedChunks = [];
var camstate;

var changeChatting;


window.onload = function () {
	// 사용자 카메라 연결
	const constraints = {
		video: {
			frameRate: {
				ideal: 60,
				max: 80,
			},
			width: 300,
			height: 300,
			facingMode: 'user',
		},
		audio: {
			echoCancellation: true, // 에코 캔슬레이션 활성화
			noiseSuppression: true, // 잡음 억제 활성화
			sampleRate: 44100, // 샘플레이트 설정 (예: 44100Hz)
		},
	};
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function (stream) {
			localStream = stream;

			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.ondataavailable = function (event) {
				if (event.data.size > 0) {
					console.log('mediaRecorder.ondataavailable');
					console.log(mediaRecorder.ondataavailable);
					recordedChunks.push(event.data);
				}
			};
			mediaRecorder.onstop = function (event) {
				console.log(recordedChunks);
				let blob = new Blob(recordedChunks, {
					type: 'video/webm',
				});
				let url = URL.createObjectURL(blob);

				// 예를 들어, 비디오를 <video> 엘리먼트에 로드할 수 있습니다.
				let video = document.getElementById('record');
				video.src = url;
				video.play();
			};
		})
		.catch(function (err) {
			/* handle the error */
		});
};

//connecting to our signaling server
// 서버 주소로 변경해야 됨
var conn = new WebSocket('ws://localhost:8080/socket');

conn.onopen = function () {
	console.log('Connected to the signaling server');
	initialize();
};

conn.onmessage = function (msg) {
	console.log('Got message', msg.data);
	var content = JSON.parse(msg.data);
	var data = content.data;
	switch (content.event) {
		// when somebody wants to call us
		case 'offer':
			handleOffer(data);
			break;
		case 'answer':
			handleAnswer(data);
			break;
		// when a remote peer sends an ice candidate to us
		case 'candidate':
			handleCandidate(data);
			break;
		case 'stopCamera':
			handleStopCamera();
			break;
		case 'startCamera':
			handleStartCamera();
			break;
		case 'requestCameraState':
			send({
				event: 'responseCameraState',
				data: camstate,
			})
			break;
		case 'responseCameraState':
			if(data){
				document.getElementById('peer').srcObject = remoteStream;
			}
			else{
				document.getElementById('peer').srcObject = null;
			}
			break;
		default:
			break;
	}
};

function send(message) {
	conn.send(JSON.stringify(message));
}

var peerConnection;
var dataChannel;
var input = document.getElementById('messageInput');

function initialize() {
	var configuration = null;

	peerConnection = new RTCPeerConnection(configuration);

	// Setup ice handling
	peerConnection.onicecandidate = function (event) {
		if (event.candidate) {
			send({
				event: 'candidate',
				data: event.candidate,
			});
		}
	};

	// creating data channel
	dataChannel = peerConnection.createDataChannel('dataChannel', {
		reliable: true,
	});

	dataChannel.onerror = function (error) {
		console.log('Error occured on datachannel:', error);
	};

	// when we receive a message from the other peer, printing it on the console
	dataChannel.onmessage = function (event) {
		console.log('message:', event.data);
		changeChatting((prev)=>{return [event.data, ...prev]});
	};

	dataChannel.onclose = function () {
		console.log('data channel is closed');
	};

	peerConnection.ondatachannel = function (event) {
		dataChannel = event.channel;
	};

	peerConnection.onaddstream = function (event) {
		remoteStream = event.stream;
		document.getElementById('peer').srcObject = remoteStream;
		requestCameraState();
	};
}

function createOffer() {
	peerConnection.createOffer(
		function (offer) {
			send({
				event: 'offer',
				data: offer,
			});
			peerConnection.setLocalDescription(offer);
		},
		function (error) {
			alert('Error creating an offer');
		}
	);
}

function handleOffer(offer) {
	peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

	// create and send an answer to an offer
	peerConnection.createAnswer(
		function (answer) {
			peerConnection.setLocalDescription(answer);
			send({
				event: 'answer',
				data: answer,
			});
		},
		function (error) {
			alert('Error creating an answer');
		}
	);
	peerConnection.addStream(localStream);
}

function handleCandidate(candidate) {
	peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

function handleAnswer(answer) {
	peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
	console.log('connection established successfully!!');
	peerConnection.addStream(localStream);
	
}

function sendMessage(msg) {
	dataChannel.send(msg);

}

function record() {
	console.log('녹화 시작');
	// 녹화 시작
	mediaRecorder.start(1000);
}

function recordStop() {
	console.log('녹화 중지');
	mediaRecorder.stop();
}



function stopCamera(){
	document.getElementById('camera').srcObject = null;
	send({
		event: 'stopCamera',
		data: '',
	})
}

function handleStopCamera(){
	console.log("handleStopCamera");
	document.getElementById('peer').srcObject = null;
}

function startCamera(){
	document.getElementById('camera').srcObject = localStream;
	send({
		event: 'startCamera',
		data: '',
	})
}

function handleStartCamera(){
	console.log("handleStartCamera");
	document.getElementById('peer').srcObject = remoteStream;
}

function requestCameraState(){
	send({
		event: 'requestCameraState',
		data: ''
	})
}



//test

////////

function Meeting() {

	const [cameraState, setCameraState] = useState(false);
	camstate = cameraState;

	const [chatting, setChatting] = useState([]);
	changeChatting = setChatting;
	const [message, setMessage] = useState("");
	

	useEffect(() => {
		document.getElementById('offerbutton').onclick = () => {
			createOffer();
		};
		document.getElementById('recordbutton').onclick = () => {
			record();
		};
		document.getElementById('recordstopbutton').onclick = () => {
			recordStop();
		};
		
		document.getElementById('camerabutton').onclick = () =>{
			setCameraState((prev)=>{
				if(prev){
					stopCamera();
				}else{
					startCamera();
				}
				camstate = !prev;
				return !prev;
			});
		}


	}, []);

	


	return (
		<div className="container">
			<h1>WebRTC 테스트</h1>
			<button id="offerbutton" type="button" className="btn btn-primary">
				Offer 생성
			</button>
			<button id="camerabutton" type='button'>
				{cameraState ? "stop camera" : "start camera"}
			</button>
			<h1>offer 생성시 반대쪽 peer에 비디오 출력</h1>
			<video id="camera" width="300px" height="300px" muted autoPlay playsInline controls></video>
			<video id="peer" width="300px" height="300px" muted autoPlay playsInline controls></video>
			<button type="button" id="recordbutton" className="btn btn-primary">
				녹화
			</button>
			<button type="button" id="recordstopbutton" className="btn btn-primary">
				중지
			</button>
			<video id="record" autoPlay playsInline controls width="100px" height="100px"></video>
			<div>
				<div>
					<p>{message}</p>
				<input id="message" value={message} onChange={(event)=>{
					setMessage(event.target.value);
				}}/>
				<button htmlFor="message" onClick={()=>{
					sendMessage(message)
					setChatting((prev)=>{return [message,...prev]})
					setMessage("");
				}} >send</button>
				</div>
				<div>
					{
						chatting.map((para)=>{ 
							return (<p key={para}>{para}</p>)
						})
					}
				</div>
			</div>
		
		</div>
	);
}

export default Meeting;
