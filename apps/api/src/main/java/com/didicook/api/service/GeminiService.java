package com.didicook.api.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
@Service
public class GeminiService {
    @Value("${gemini.api-key}")
    private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public Map<String, Object> scoreDebate(Map<String, Object> input) {
        StringBuilder transcript = new StringBuilder();
        try {
            List<Map<String, Object>> phases = (List<Map<String, Object>>) input.get("phases");
            for (Map<String, Object> phase : phases) {
                String type = (String) phase.get("type");
                int speaker = (int) (phase.get("speaker") instanceof Integer ? phase.get("speaker") : Integer.parseInt(phase.get("speaker").toString()));
                String text = (String) phase.get("text");
                transcript.append(type).append(" - Player ").append(speaker).append(": ").append(text).append("\n");
            }
        } catch (Exception e) {
            return Map.of("error", "Invalid input format for phases", "details", e.getMessage());
        }

        List<String> evidence = getEvidenceChunks(transcript.toString(), 5);
        StringBuilder evidenceSection = new StringBuilder();
        if (!evidence.isEmpty()) {
            evidenceSection.append("\nRelevant evidence for this debate (use to support your scoring):\n");
            for (String ev : evidence) {
                evidenceSection.append("- ").append(ev.replace("\"", "'")).append("\n");
            }
        }
        String exampleJson = "{\n" +
            "  \"winner\": \"player1\",\n" +
            "  \"player1TotalScore\": 78,\n" +
            "  \"player2TotalScore\": 72,\n" +
            "  \"whatDecidedIt\": \"Player 1's opening statement established a stronger foundation with concrete examples, which Player 2 never fully countered.\",\n" +
            "  \"player1Strengths\": [\n" +
            "    \"Excellent use of real-world examples\",\n" +
            "    \"Maintained composure throughout\"\n" +
            "  ],\n" +
            "  \"player2Strengths\": [\n" +
            "    \"Strong logical structure in arguments\",\n" +
            "    \"Effectively challenged opponent's assumptions\"\n" +
            "  ],\n" +
            "  \"keyEvidence\": [\n" +
            "    \"Player 1 cited the 2024 McKinsey automation report\",\n" +
            "    \"Player 2 referenced historical job displacement patterns\"\n" +
            "  ],\n" +
            "  \"rounds\": [\n" +
            "    {\n" +
            "      \"name\": \"Opening Statement\",\n" +
            "      \"winner\": \"player1\",\n" +
            "      \"player1Score\": { \"logic\": 8, \"clarity\": 9, \"evidence\": 7, \"civility\": 10 },\n" +
            "      \"player2Score\": { \"logic\": 7, \"clarity\": 8, \"evidence\": 6, \"civility\": 10 }\n" +
            "    },\n" +
            "    {\n" +
            "      \"name\": \"Argument\",\n" +
            "      \"winner\": \"player2\",\n" +
            "      \"player1Score\": { \"logic\": 7, \"clarity\": 8, \"evidence\": 6, \"civility\": 9 },\n" +
            "      \"player2Score\": { \"logic\": 8, \"clarity\": 8, \"evidence\": 7, \"civility\": 10 }\n" +
            "    },\n" +
            "    {\n" +
            "      \"name\": \"Closing Statement\",\n" +
            "      \"winner\": \"player1\",\n" +
            "      \"player1Score\": { \"logic\": 8, \"clarity\": 9, \"evidence\": 7, \"civility\": 10 },\n" +
            "      \"player2Score\": { \"logic\": 7, \"clarity\": 7, \"evidence\": 6, \"civility\": 10 }\n" +
            "    },\n" +
            "    {\n" +
            "      \"name\": \"Brief Response\",\n" +
            "      \"winner\": \"tie\",\n" +
            "      \"player1Score\": { \"logic\": 7, \"clarity\": 8, \"evidence\": 5, \"civility\": 10 },\n" +
            "      \"player2Score\": { \"logic\": 7, \"clarity\": 8, \"evidence\": 5, \"civility\": 10 }\n" +
            "    }\n" +
            "  ]\n" +
            "}";

        String fullPrompt = "Given the following debate, score it using the following JSON format. " +
            "Replace round names with the actual round titles. " +
            "Be concise and fair. Return ONLY valid JSON, no markdown, no commentary, no code block formatting, no explanation, no triple backticks.\n\n" +
            exampleJson +
            evidenceSection.toString() +
            "\nDebate transcript:\n" + transcript.toString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = "{\"contents\":[{\"parts\":[{\"text\":\"" + fullPrompt.replace("\"", "\\\"") + "\"}]}]}";
        HttpEntity<String> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_URL + "?key=" + apiKey, request, String.class);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            String text = root.path("candidates").get(0)
                                  .path("content").path("parts").get(0)
                                  .path("text").asText();
            text = text.replaceAll("(?s)```json|```", "").trim();
            int firstBrace = text.indexOf('{');
            int lastBrace = text.lastIndexOf('}');
            if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
                text = text.substring(firstBrace, lastBrace + 1);
            }
            JsonNode scoring = mapper.readTree(text);
            return mapper.convertValue(scoring, Map.class);
        } catch (Exception e) {
            return Map.of("error", "Failed to parse Gemini response", "details", e.getMessage());
        }
    }

    public List<String> getEvidenceChunks(String debateTurn, int topK) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8000/search";
        ObjectMapper mapper = new ObjectMapper();
        String requestJson = "";
        try {
            Map<String, Object> requestMap = Map.of(
                "query", debateTurn,
                "top_k", topK
            );
            requestJson = mapper.writeValueAsString(requestMap);
        } catch (Exception e) {
            throw new RuntimeException("Failed to build request JSON", e);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        List<String> evidence = new java.util.ArrayList<>();
        if (response.getStatusCode() == org.springframework.http.HttpStatus.OK) {
            try {
                JsonNode body = mapper.readTree(response.getBody());
                JsonNode results = body.get("results");
                if (results != null && results.isArray()) {
                    for (JsonNode chunk : results) {
                        evidence.add(chunk.get("text").asText());
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse response JSON", e);
            }
        }
        return evidence;
    }
}