package com.assessment.quizapp.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuizResultResponse {
    private Long quizAttemptId;
    private Integer score;
    private Integer totalQuestions;
    private LocalDateTime endTime;
    private List<QuestionResult> questionResults;

    public QuizResultResponse() {}

    public QuizResultResponse(Long quizAttemptId, Integer score, Integer totalQuestions, 
                             LocalDateTime endTime, List<QuestionResult> questionResults) {
        this.quizAttemptId = quizAttemptId;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.endTime = endTime;
        this.questionResults = questionResults;
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

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public List<QuestionResult> getQuestionResults() {
        return questionResults;
    }

    public void setQuestionResults(List<QuestionResult> questionResults) {
        this.questionResults = questionResults;
    }

    public static class QuestionResult {
        private Long questionId;
        private String questionText;
        private List<OptionResult> options;
        private Long selectedOptionId;
        private Boolean isCorrect;

        public QuestionResult() {}

        public QuestionResult(Long questionId, String questionText, List<OptionResult> options,
                             Long selectedOptionId, Boolean isCorrect) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.options = options;
            this.selectedOptionId = selectedOptionId;
            this.isCorrect = isCorrect;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public List<OptionResult> getOptions() {
            return options;
        }

        public void setOptions(List<OptionResult> options) {
            this.options = options;
        }

        public Long getSelectedOptionId() {
            return selectedOptionId;
        }

        public void setSelectedOptionId(Long selectedOptionId) {
            this.selectedOptionId = selectedOptionId;
        }

        public Boolean getIsCorrect() {
            return isCorrect;
        }

        public void setIsCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
        }

        public static class OptionResult {
            private Long id;
            private String optionText;
            private Boolean isCorrect;

            public OptionResult() {}

            public OptionResult(Long id, String optionText, Boolean isCorrect) {
                this.id = id;
                this.optionText = optionText;
                this.isCorrect = isCorrect;
            }

            public Long getId() {
                return id;
            }

            public void setId(Long id) {
                this.id = id;
            }

            public String getOptionText() {
                return optionText;
            }

            public void setOptionText(String optionText) {
                this.optionText = optionText;
            }

            public Boolean getIsCorrect() {
                return isCorrect;
            }

            public void setIsCorrect(Boolean isCorrect) {
                this.isCorrect = isCorrect;
            }
        }
    }
}
