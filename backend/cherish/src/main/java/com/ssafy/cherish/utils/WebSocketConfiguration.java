package com.ssafy.cherish.utils;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

// 웹 소켓에 대한 설정을 담은 클래스
@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    // 웹 소켓 핸들러를 등록한뒤 CORS를 처리
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new SocketHandler(), "/socket")
            .setAllowedOrigins("*");
    }
}
