package com.ssafy.cherish.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;

import java.lang.reflect.Type;

@Configuration
public class MultiPartFileConfig extends AbstractJackson2HttpMessageConverter {

    // for swagger with file and dto

    /**
     * Converter for support http request with header Content-Type: multipart/form-data
     */
    public MultiPartFileConfig(ObjectMapper objectMapper) {
        super(objectMapper, MediaType.APPLICATION_OCTET_STREAM);
    }

    @Override
    public boolean canWrite(Class<?> clss, MediaType mediaType) {
        return false;
    }

    @Override
    public boolean canWrite(Type type, Class<?> clss, MediaType mediaType) {
        return false;
    }

    @Override
    protected boolean canWrite(MediaType mediaType) {
        return false;
    }
}

