package com.assessment.quizapp.dto;

import java.util.List;

public class QuestionResponse {
    private Long id;
    private String questionText;
    private List<OptionResponse> options;

    public QuestionResponse() {}

    public QuestionResponse(Long id, String questionText, List<OptionResponse> options) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<OptionResponse> getOptions() {
        return options;
    }

    public void setOptions(List<OptionResponse> options) {
        this.options = options;
    }

    public static class OptionResponse {
        private Long id;
        private String optionText;
        private Boolean isCorrect;

        public OptionResponse() {}

        public OptionResponse(Long id, String optionText, Boolean isCorrect) {
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
