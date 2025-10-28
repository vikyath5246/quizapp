package com.assessment.quizapp.dto;

import java.time.LocalDateTime;

public class ScoreResponse {
    private Long quizAttemptId;
    private Integer score;
    private Integer totalQuestions;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public ScoreResponse() {}

    public ScoreResponse(Long quizAttemptId, Integer score, Integer totalQuestions,
                        LocalDateTime startTime, LocalDateTime endTime) {
        this.quizAttemptId = quizAttemptId;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getQuizAttemptId() {
        return quizAttemptId;
    }

    public void setQuizAttemptId(Long quizAttemptId) {
        this.quizAttemptId = quizAttemptId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
