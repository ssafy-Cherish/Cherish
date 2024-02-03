package com.ssafy.cherish.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@Slf4j
public class SocketHandler extends TextWebSocketHandler {

    // 연결이 성공한 모든 클라이언트와 서버의 연결이 저장되는 맵
    Map<String, CherishSocketSession> sessions = new HashMap<>();
    // 커플 아이디 별로 연결된 세션의 수
    Map<Integer, List<CherishSocketSession>> connections = new HashMap<>();

    // 연결이 성공한 클라이언트가 웹소켓을 통해 메세지를 부르면 호출되는 메소드
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws InterruptedException, IOException {
        log.debug("웹소켓 메세지 처리, message : {}", message.getPayload());
        log.debug("message : {}", message);

        try {
            // 클라이언트로부터 받은 메세지를 맵으로 변환
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> map = mapper.readValue(message.getPayload(), Map.class);

            CherishSocketSession cherishSession = sessions.get(session.getId());

            switch (map.get("event")) {
                // WebRTC 연결에 사용되는 메세지라면 상대방에게 메세지를 바로 보낸다
                case "offer":
                case "answer":
                case "candidate":
                    if (cherishSession.getCoupleId() == Integer.MIN_VALUE) {
                        log.debug("커플 아이디 없음 : {}", cherishSession);
                        return;
                    }

                    // 연결 가능한 세션들을 가져옴
                    List<CherishSocketSession> couple = connections.get(cherishSession.getCoupleId());

                    // 커플이 둘 다 연결되어 있다면
                    if (couple.size() > 1) {

                        // 상대방에게 WebRTC 연결에 필요한 메세지 전송
                        for (CherishSocketSession cs : couple)
                            if (cs.getSession().isOpen() &&
                                    !cs.getSession().getId().equals(session.getId()))
                                cs.getSession().sendMessage(message);

                    } else {
                        log.debug("상대방 연결 안됨 : {}", cherishSession);
                    }
                    break;

                    // 클라이언트가 처음 서버와 연결된 뒤 정보를 저장하기 위해 커플 아이디를 전송
                case "access":
                    // 데이터를 맵으로 변환
                    Map<String, Integer> map2 = mapper.readValue(map.get("data"), Map.class);
                    int coupleId = map2.get("coupleId");
                    
                    // 커플들의 각각의 세션에 커플 아이디 저장
                    cherishSession.setCoupleId(coupleId);

                    // 상대방이 연결되어 있다면 리스트가 존재
                    List<CherishSocketSession> list =
                            connections.containsKey(coupleId) ?
                                    connections.get(coupleId) : new ArrayList<>();

                    // 상대방이거나 처음일 경우만 추가, 자기자신일 경우 그냥 리턴
                    if (list.isEmpty() || !list.get(0).getSession().getId().equals(session.getId()))
                        list.add(cherishSession);
                    else
                        return;
                    connections.put(coupleId, list);

                    // 둘 다 연결 되었다면 둘에게 알림
                    if (list.size() > 1)
                        for (CherishSocketSession cs : list)
                            cs.getSession().sendMessage(message);

                    break;

                default:
                    break;
            }

        } catch (Exception e) {
            log.debug("웹소켓 메세지 처리 중 에러 발생 : {}", e.getMessage());
        }

    }

    // 웹소켓 요청을 보낸 클라이언트와 서버가 연결이 성공하면 불려지는 메소드
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.debug("웹소켓 클라이언트 연결 성공, session : {}", session);
        sessions.put(session.getId(), new CherishSocketSession(session));
    }

    // 웹소켓 연결이 끊긴 사용자
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.debug("웹소켓 클라이언트 연결 끊김, session : {}", session);

        CherishSocketSession cherishSession = sessions.get(session.getId());
        
        if (cherishSession.getCoupleId() == Integer.MIN_VALUE) {
            log.debug("세션의 커플 아이디 없음, cherishSession : {}", cherishSession);
            return;
        }
        
        // 커플 커넥션에서 웹소켓 연결이 끊긴 사용자 삭제
        List<CherishSocketSession> couple = connections.get(cherishSession.getCoupleId());
        couple.removeIf(cs -> cs.getSession().getId().equals(session.getId()));

        // 세션들의 맵에서도 연결이 끊긴 사용자 삭제
        sessions.remove(session.getId());
    }
}