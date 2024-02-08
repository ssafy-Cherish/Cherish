package com.ssafy.cherish;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

//Swagger 주소 : http://localhost:8080/api/swagger-ui/index.html
@EnableAsync
@SpringBootApplication
public class CherishApplication {

	public static void main(String[] args) {
		SpringApplication.run(CherishApplication.class, args);
	}

	// TODO: 비동기 작업을 위한 Async 설정을 위한 taskExcutor가 필요

}
