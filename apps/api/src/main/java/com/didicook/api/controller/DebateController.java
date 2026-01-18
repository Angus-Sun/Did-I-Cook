package com.didicook.api.controller;

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

    public DebateController(DebateService debateService) {
        this.debateService = debateService;
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

    // add a turn
    @PostMapping("/{id}/turns")
    public Turn addTurn(@PathVariable String id, @RequestBody Map<String, String> body) {
        String argument = body.get("argument");
        String visitorId = body.get("visitorId");
        return debateService.addTurn(id, visitorId, argument);
    }
}