package com.assessment.quizapp.config;

import com.assessment.quizapp.entity.Option;
import com.assessment.quizapp.entity.Question;
import com.assessment.quizapp.entity.User;
import com.assessment.quizapp.repository.OptionRepository;
import com.assessment.quizapp.repository.QuestionRepository;
import com.assessment.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@quiz.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }

        // Create sample user
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@quiz.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(User.Role.USER);
            userRepository.save(user);
        }

        // Create sample questions if none exist
        if (questionRepository.count() == 0) {
            createSampleQuestions();
        }
    }

    private void createSampleQuestions() {
        // Question 1
        Question q1 = new Question("What is the capital of France?");
        q1 = questionRepository.save(q1);

        Option q1o1 = new Option("London", false);
        q1o1.setQuestion(q1);
        optionRepository.save(q1o1);

        Option q1o2 = new Option("Paris", true);
        q1o2.setQuestion(q1);
        optionRepository.save(q1o2);

        Option q1o3 = new Option("Berlin", false);
        q1o3.setQuestion(q1);
        optionRepository.save(q1o3);

        Option q1o4 = new Option("Madrid", false);
        q1o4.setQuestion(q1);
        optionRepository.save(q1o4);

        // Question 2
        Question q2 = new Question("Which planet is known as the Red Planet?");
        q2 = questionRepository.save(q2);

        Option q2o1 = new Option("Venus", false);
        q2o1.setQuestion(q2);
        optionRepository.save(q2o1);

        Option q2o2 = new Option("Mars", true);
        q2o2.setQuestion(q2);
        optionRepository.save(q2o2);

        Option q2o3 = new Option("Jupiter", false);
        q2o3.setQuestion(q2);
        optionRepository.save(q2o3);

        Option q2o4 = new Option("Saturn", false);
        q2o4.setQuestion(q2);
        optionRepository.save(q2o4);

        // Question 3
        Question q3 = new Question("What is 2 + 2?");
        q3 = questionRepository.save(q3);

        Option q3o1 = new Option("3", false);
        q3o1.setQuestion(q3);
        optionRepository.save(q3o1);

        Option q3o2 = new Option("4", true);
        q3o2.setQuestion(q3);
        optionRepository.save(q3o2);

        Option q3o3 = new Option("5", false);
        q3o3.setQuestion(q3);
        optionRepository.save(q3o3);

        Option q3o4 = new Option("6", false);
        q3o4.setQuestion(q3);
        optionRepository.save(q3o4);
    }
}
