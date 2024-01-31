package com.ssafy.cherish.utils;

import lombok.*;
import org.springframework.web.socket.WebSocketSession;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CherishSocketSession {
    private String coupleId;
    private WebSocketSession session;
}
