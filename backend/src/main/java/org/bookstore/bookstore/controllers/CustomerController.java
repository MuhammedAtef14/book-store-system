package org.bookstore.bookstore.controllers;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.CartResponse;
import org.bookstore.bookstore.dtos.OrderHistoryResponse;
import org.bookstore.bookstore.dtos.UserDto;
import org.bookstore.bookstore.mappers.UserMapper;
import org.bookstore.bookstore.services.CartService;
import org.bookstore.bookstore.services.PaymentService;
import org.bookstore.bookstore.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/customer")
public class CustomerController {

    private final UserMapper userMapper;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final CartService cartService;

    @GetMapping()
    public ResponseEntity<?> getAllUsers() {
        var users = userService.getAllUsers().stream()
                .map(user -> {
                    return userMapper.toDto(user);
                }).toList();
        if (users.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Integer id)
    {
        var user =userService.findById(id);
        if(user.isEmpty()) {
            return  ResponseEntity.notFound().build();
        }

        userService.deleteById(id);
        return ResponseEntity.ok().build();

    }


    @PostMapping("/{id}/update")
    @Transactional
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Integer id
            ,@Valid  @RequestBody  UserDto userDto
    ){
        var user =userService.findById(id);

        if (user.isEmpty()) {
            return  ResponseEntity.notFound().build();
        }

        userMapper.updateUser(userDto,user.get());
        String pass=user.get().getPassword();
        user.get().setPassword(passwordEncoder.encode(pass));
        userService.updateUser(user.get());
        return  ResponseEntity.ok(userMapper.toDto(user.get()));

    }




    @GetMapping("/{userId}/viewItemsInCart")
    public ResponseEntity<CartResponse> viewItemsInCart(
            @PathVariable Long userId,
            @RequestParam Long cartId
    ){
       var cart= userService.getCartWithItems(userId,cartId);

        return ResponseEntity.ok(cart);
    }


    @GetMapping("/{userId}/viewCarts")
    public  ResponseEntity<List<CartResponse>> viewUserCarts(
            @PathVariable Integer userId
    )
    {

       var carts= userService.getUserCarts(userId);
        return  ResponseEntity.ok(carts);
    }

    //delete item from cart in the cart controller already


    @GetMapping("/{userId}/viewPastOrders")
    public ResponseEntity<OrderHistoryResponse> viewPastOrders(
            @PathVariable Long userId
    ) {

          var  history= userService.getOrderHistory(userId);
          return ResponseEntity.ok(history);

    }














}
