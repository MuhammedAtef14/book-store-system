package org.bookstore.bookstore.repositories;

import org.bookstore.bookstore.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User,Integer> {

    @Query(
            value = "SELECT * FROM Users WHERE Email = :email",
            nativeQuery = true
    )
    Optional<User> findByEmail(@Param("email") String email);


    @Query(
            value = "SELECT * FROM Users WHERE userId = :userId",
            nativeQuery = true
    )
    Optional<User> findByUserId(@Param("userId") Integer userId);


    Optional<User> findByUsername(String username);



    @Query(
           value ="SELECT * FROM Users ",
           nativeQuery = true
    )
    List<User> getAll();

    @Query(
            value = "DELETE FROM Users WHERE userId = :userId",
            nativeQuery = true
    )
    void deleteAllByUserId(@Param("userId") Integer userId);


    @Query(
            value = " UPDATE Users SET Username=: Username , Phone=:Phone , Role=:Role WHERE UserId=userId",
            nativeQuery = true
    )
    Optional<User> update(@Param("userId") Integer userId,String Username,String Phone);

    @Query(
            value = " UPDATE Users SET Password=: Password  WHERE UserId=userId",
            nativeQuery = true
    )
    Optional<User> changePassword(@Param("userId") Integer userId , String Password );
}
