package com.didicook.api.model;

import java.util.ArrayList;
import java.util.List;

public class Debate {
    private String id;
    private String topic;
    private String status;
    private List<Turn> turns;

    public Debate() {
        this.id = generateRoomId();
        this.turns = new ArrayList<>();
        this.status = "waiting";
    }
    
    public Debate(String topic) {
        this();
        this.topic = topic;
    }
    private String generateRoomId() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 4; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public String getId() {return id;}
    public String getTopic() {return topic;}
    public String getStatus() {return status;}
    public List<Turn> getTurns() {return turns;}

    public void setId(String id) {this.id = id;}
    public void setTopic(String topic) {this.topic = topic;}
    public void setStatus(String status) {this.status = status;}
    public void setTurns(List<Turn> turns) {this.turns = turns;}
    public void addTurn(Turn turn) {this.turns.add(turn);}

}