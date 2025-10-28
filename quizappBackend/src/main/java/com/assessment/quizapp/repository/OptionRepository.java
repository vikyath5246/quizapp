package com.assessment.quizapp.repository;

import com.assessment.quizapp.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findByQuestionId(Long questionId);
    
    @Modifying
    @Query("DELETE FROM Option o WHERE o.question.id = :questionId")
    void deleteByQuestionId(@Param("questionId") Long questionId);
}
