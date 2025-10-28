package com.assessment.quizapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class QuestionRequest {
    @NotBlank
    @Size(min = 10, max = 500)
    private String questionText;

    private List<OptionRequest> options;

    public QuestionRequest() {}

    public QuestionRequest(String questionText, List<OptionRequest> options) {
        this.questionText = questionText;
        this.options = options;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public List<OptionRequest> getOptions() {
        return options;
    }

    public void setOptions(List<OptionRequest> options) {
        this.options = options;
    }

    public static class OptionRequest {
        @NotBlank
        @Size(min = 1, max = 200)
        private String optionText;

        private Boolean isCorrect = false;

        public OptionRequest() {}

        public OptionRequest(String optionText, Boolean isCorrect) {
            this.optionText = optionText;
            this.isCorrect = isCorrect;
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
