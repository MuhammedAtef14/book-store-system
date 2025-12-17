package org.bookstore.bookstore.services;


import lombok.AllArgsConstructor;
import org.bookstore.bookstore.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    private final  UserRepository userRepository;


}
