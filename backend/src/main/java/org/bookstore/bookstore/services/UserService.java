package org.bookstore.bookstore.services;


import lombok.AllArgsConstructor;
import org.bookstore.bookstore.entities.User;
import org.bookstore.bookstore.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final  UserRepository userRepository;

    public Optional<User> findByEmail(String email)
    {
      return  userRepository.findByEmail(email);
    }
    public void save(User user)
    {
        userRepository.save(user);
    }

}
