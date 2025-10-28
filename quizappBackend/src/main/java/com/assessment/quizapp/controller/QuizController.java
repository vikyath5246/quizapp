package com.assessment.quizapp.controller;

import com.assessment.quizapp.dto.QuestionResponse;
import com.assessment.quizapp.dto.QuizResultResponse;
import com.assessment.quizapp.dto.QuizSubmissionRequest;
import com.assessment.quizapp.dto.ScoreResponse;
import com.assessment.quizapp.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/start")
    public ResponseEntity<List<QuestionResponse>> startQuiz() {
        List<QuestionResponse> questions = quizService.startQuiz();
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(@Valid @RequestBody QuizSubmissionRequest submissionRequest) {
        try {
            QuizResultResponse result = quizService.submitQuiz(submissionRequest);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
