package com.assessment.quizapp.service;

import com.assessment.quizapp.dto.QuestionRequest;
import com.assessment.quizapp.dto.QuestionResponse;
import com.assessment.quizapp.entity.Option;
import com.assessment.quizapp.entity.Question;
import com.assessment.quizapp.repository.OptionRepository;
import com.assessment.quizapp.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return convertToResponse(question);
    }

    @Transactional
    public QuestionResponse createQuestion(QuestionRequest questionRequest) {
        Question question = new Question();
        question.setQuestionText(questionRequest.getQuestionText());
        Question savedQuestion = questionRepository.save(question);

        List<Option> options = questionRequest.getOptions().stream()
                .map(optionRequest -> {
                    Option option = new Option();
                    option.setOptionText(optionRequest.getOptionText());
                    option.setIsCorrect(optionRequest.getIsCorrect());
                    option.setQuestion(savedQuestion);
                    return option;
                })
                .collect(Collectors.toList());

        optionRepository.saveAll(options);
        savedQuestion.setOptions(options);

        return convertToResponse(savedQuestion);
    }

    @Transactional
    public QuestionResponse updateQuestion(Long id, QuestionRequest questionRequest) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setQuestionText(questionRequest.getQuestionText());
        Question savedQuestion = questionRepository.save(question);

        // Delete existing options
        optionRepository.deleteByQuestionId(id);

        // Create new options
        List<Option> options = questionRequest.getOptions().stream()
                .map(optionRequest -> {
                    Option option = new Option();
                    option.setOptionText(optionRequest.getOptionText());
                    option.setIsCorrect(optionRequest.getIsCorrect());
                    option.setQuestion(savedQuestion);
                    return option;
                })
                .collect(Collectors.toList());

        optionRepository.saveAll(options);
        savedQuestion.setOptions(options);

        return convertToResponse(savedQuestion);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        optionRepository.deleteByQuestionId(id);
        questionRepository.delete(question);
    }

    private QuestionResponse convertToResponse(Question question) {
        List<QuestionResponse.OptionResponse> optionResponses = question.getOptions().stream()
                .map(option -> new QuestionResponse.OptionResponse(
                        option.getId(),
                        option.getOptionText(),
                        option.getIsCorrect()
                ))
                .collect(Collectors.toList());

        return new QuestionResponse(question.getId(), question.getQuestionText(), optionResponses);
    }
}
