package com.didicook.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
@Service
public class GeminiService {
    @Value("${gemini.api-key}")
    private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public Map<String, Object> scoreDebate(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = "{\"contents\":[{\"parts\":[{\"text\":\"" + prompt.replace("\"", "\\\"") + "\"}]}]}";
        HttpEntity<String> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_URL + "?key=" + apiKey, request, String.class);
        return Map.of("rawResponse", response.getBody());
    }
}