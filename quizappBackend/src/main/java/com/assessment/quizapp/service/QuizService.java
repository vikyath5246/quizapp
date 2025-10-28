package com.assessment.quizapp.service;

import com.assessment.quizapp.dto.QuestionResponse;
import com.assessment.quizapp.dto.QuizResultResponse;
import com.assessment.quizapp.dto.QuizSubmissionRequest;
import com.assessment.quizapp.dto.ScoreResponse;
import com.assessment.quizapp.entity.*;
import com.assessment.quizapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    public List<QuestionResponse> startQuiz() {
        List<Question> questions = questionRepository.findAll();
        return questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizResultResponse submitQuiz(QuizSubmissionRequest submissionRequest) {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create quiz attempt
        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setUser(user);
        quizAttempt.setStartTime(LocalDateTime.now());
        quizAttempt.setEndTime(LocalDateTime.now());
        quizAttempt.setTotalQuestions(submissionRequest.getAnswers().size());
        QuizAttempt savedAttempt = quizAttemptRepository.save(quizAttempt);

        final int[] score = {0};
        List<QuizResultResponse.QuestionResult> questionResults = submissionRequest.getAnswers().stream()
                .map(answerSubmission -> {
                    Question question = questionRepository.findById(answerSubmission.getQuestionId())
                            .orElseThrow(() -> new RuntimeException("Question not found"));

                    Option selectedOption = null;
                    if (answerSubmission.getSelectedOptionId() != null) {
                        selectedOption = optionRepository.findById(answerSubmission.getSelectedOptionId())
                                .orElse(null);
                    }

                    // Create user answer
                    UserAnswer userAnswer = new UserAnswer(savedAttempt, question, selectedOption);
                    userAnswerRepository.save(userAnswer);

                    // Check if answer is correct
                    boolean isCorrect = selectedOption != null && selectedOption.getIsCorrect();
                    if (isCorrect) {
                        score[0]++;
                    }

                    // Convert options for response
                    List<QuizResultResponse.QuestionResult.OptionResult> optionResults = question.getOptions().stream()
                            .map(option -> new QuizResultResponse.QuestionResult.OptionResult(
                                    option.getId(),
                                    option.getOptionText(),
                                    option.getIsCorrect()
                            ))
                            .collect(Collectors.toList());

                    return new QuizResultResponse.QuestionResult(
                            question.getId(),
                            question.getQuestionText(),
                            optionResults,
                            selectedOption != null ? selectedOption.getId() : null,
                            isCorrect
                    );
                })
                .collect(Collectors.toList());

        // Update quiz attempt with score
        savedAttempt.setScore(score[0]);
        quizAttemptRepository.save(savedAttempt);

        return new QuizResultResponse(
                savedAttempt.getId(),
                score[0],
                savedAttempt.getTotalQuestions(),
                savedAttempt.getEndTime(),
                questionResults
        );
    }

    public List<ScoreResponse> getUserScores() {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByStartTimeDesc(user.getId());
        return attempts.stream()
                .map(attempt -> new ScoreResponse(
                        attempt.getId(),
                        attempt.getScore(),
                        attempt.getTotalQuestions(),
                        attempt.getStartTime(),
                        attempt.getEndTime()
                ))
                .collect(Collectors.toList());
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private QuestionResponse convertToResponse(Question question) {
        List<QuestionResponse.OptionResponse> optionResponses = question.getOptions().stream()
                .map(option -> new QuestionResponse.OptionResponse(
                        option.getId(),
                        option.getOptionText(),
                        null // Don't reveal correct answers during quiz
                ))
                .collect(Collectors.toList());

        return new QuestionResponse(question.getId(), question.getQuestionText(), optionResponses);
    }
}
