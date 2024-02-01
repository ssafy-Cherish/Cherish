package com.ssafy.cherish.utils;

import lombok.*;
import org.springframework.web.socket.WebSocketSession;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CherishSocketSession {
    private int coupleId = Integer.MIN_VALUE;

    // 받게되는 웹소켓 세션
    private WebSocketSession session;

    CherishSocketSession(WebSocketSession session) {
        this.session = session;
    }
}
