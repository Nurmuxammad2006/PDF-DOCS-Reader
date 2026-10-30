package com.example.pdfdocsopener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class PdfDocsOpenerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PdfDocsOpenerApplication.class, args);
    }
}
