package com.assessment.quizapp.repository;

import com.assessment.quizapp.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    List<UserAnswer> findByQuizAttemptId(Long quizAttemptId);
    UserAnswer findByQuizAttemptIdAndQuestionId(Long quizAttemptId, Long questionId);
}
