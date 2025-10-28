package com.assessment.quizapp.dto;

import java.util.List;

public class QuizSubmissionRequest {
    private List<AnswerSubmission> answers;

    public QuizSubmissionRequest() {}

    public QuizSubmissionRequest(List<AnswerSubmission> answers) {
        this.answers = answers;
    }

    public List<AnswerSubmission> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerSubmission> answers) {
        this.answers = answers;
    }

    public static class AnswerSubmission {
        private Long questionId;
        private Long selectedOptionId;

        public AnswerSubmission() {}

        public AnswerSubmission(Long questionId, Long selectedOptionId) {
            this.questionId = questionId;
            this.selectedOptionId = selectedOptionId;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public Long getSelectedOptionId() {
            return selectedOptionId;
        }

        public void setSelectedOptionId(Long selectedOptionId) {
            this.selectedOptionId = selectedOptionId;
        }
    }
}
