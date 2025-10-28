package com.assessment.quizapp.controller;

import com.assessment.quizapp.dto.ScoreResponse;
import com.assessment.quizapp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "*")
public class ScoreController {

    @Autowired
    private QuizService quizService;

    @GetMapping
    public ResponseEntity<List<ScoreResponse>> getUserScores() {
        try {
            List<ScoreResponse> scores = quizService.getUserScores();
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
