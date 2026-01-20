package com.didicook.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.didicook.api.model.Debate;
import com.didicook.api.model.Turn;
import com.didicook.api.service.DebateService;

@RestController
@RequestMapping("/api/debates")
public class DebateController {

    private final DebateService debateService;
    private final com.didicook.api.service.GeminiService geminiService;

    public DebateController(DebateService debateService, com.didicook.api.service.GeminiService geminiService) {
        this.debateService = debateService;
        this.geminiService = geminiService;
    }

    @PostMapping
    public Debate createDebate(@RequestBody Map<String, String> body) {
        String topic = body.get("topic");
        return debateService.createDebate(topic);
    }

    // get a debate
    @GetMapping("/{id}")
    public Debate getDebate(@PathVariable String id) {
        return debateService.getDebate(id);
    }
    @GetMapping("/{id}/results")
    public Map<String, Object> getDebateResults(@PathVariable String id) {
        System.out.println("[DebateController] /results endpoint called for debate " + id);
        Debate debate = debateService.getDebate(id);
        if (debate == null) {
            System.out.println("[DebateController] Debate not found: " + id);
            return Map.of("error", "Debate not found");
        }
        List<Map<String, Object>> phases = new java.util.ArrayList<>();
        for (int i = 0; i < debate.getTurns().size(); i++) {
            var turn = debate.getTurns().get(i);
            phases.add(Map.of(
                "type", "phase" + i,
                "speaker", turn.getVisitorId().equals(debate.getPlayer1Id()) ? 1 : 2,
                "text", turn.getArgument()
            ));
        }
        Map<String, Object> input = Map.of(
            "phases", phases,
            "player1Name", debate.getPlayer1Name() != null ? debate.getPlayer1Name() : "Player 1",
            "player2Name", debate.getPlayer2Name() != null ? debate.getPlayer2Name() : "Player 2"
        );
        System.out.println("[DebateController] Calling GeminiService.scoreDebate for debate " + id);
        Map<String, Object> result = geminiService.scoreDebate(input);
        System.out.println("[DebateController] GeminiService.scoreDebate returned for debate " + id);
        return result;
    }
    @PostMapping("/{id}/turns")
    public Turn addTurn(@PathVariable String id, @RequestBody Map<String, String> body) {
        String argument = body.get("argument");
        String visitorId = body.get("visitorId");
        String visitorName = body.get("visitorName");
        return debateService.addTurn(id, visitorId, visitorName, argument);
    }

    @PostMapping("/{id}/join") 
    public Debate joinDebate(@PathVariable String id, @RequestBody Map<String, String> body) {
        String visitorId = body.get("visitorId");
        String visitorName = body.get("visitorName");
        return debateService.joinDebate(id, visitorId, visitorName);
    }

    @PostMapping("/{id}/ready")
    public Debate setReady(@PathVariable String id, @RequestBody Map<String, String> body) {
        String visitorId = body.get("visitorId");
        return debateService.setReady(id, visitorId);
    }

    @PostMapping("/{id}/next-phase")
    public Debate nextPhase(@PathVariable String id) {
        return debateService.nextPhase(id);
    }
}