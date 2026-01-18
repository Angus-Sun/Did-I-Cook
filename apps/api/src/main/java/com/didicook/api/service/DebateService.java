package com.didicook.api.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.didicook.api.model.Debate;
import com.didicook.api.model.Turn;

@Service

public class DebateService {

    private final Map<String, Debate> debates = new HashMap<>();
    
    public Debate createDebate(String topic) {
        Debate newDebate = new Debate();
        newDebate.setTopic(topic);
        debates.put(newDebate.getId(), newDebate);
        return newDebate;
    }

    public Debate getDebate(String id) {
        return debates.get(id);
    }

    public Turn addTurn(String debateId, String visitorId, String argument) {
        Debate selectedDebate = getDebate(debateId);
        Turn newTurn = new Turn(visitorId, argument);
        selectedDebate.addTurn(newTurn);
        return newTurn;
    }
}