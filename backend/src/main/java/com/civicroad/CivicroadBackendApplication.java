package com.civicroad;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CivicroadBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(CivicroadBackendApplication.class, args);
    }
}
