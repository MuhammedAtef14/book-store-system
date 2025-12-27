package org.bookstore.bookstore.controllers;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.CartResponse;
import org.bookstore.bookstore.dtos.OrderHistoryResponse;
import org.bookstore.bookstore.dtos.UserDto;
import org.bookstore.bookstore.entities.User;
import org.bookstore.bookstore.mappers.UserMapper;
import org.bookstore.bookstore.services.CartService;
import org.bookstore.bookstore.services.PaymentService;
import org.bookstore.bookstore.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/customer")
public class CustomerController {

    private final UserMapper userMapper;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final CartService cartService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        User user = (User) auth.getPrincipal();

        Map<String, Object> profile = new HashMap<>();
        profile.put("userId", user.getUserId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("phone", user.getPhone());
        profile.put("role", user.getRole().toString());
        profile.put("emailVerified", user.isEmailVerified());
        profile.put("enabled", user.isEnabled());

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        User user = (User) auth.getPrincipal();

        // Update allowed fields only
        if (updates.containsKey("firstName") && updates.get("firstName") != null) {
            user.setFirstName(updates.get("firstName"));
        }
        if (updates.containsKey("lastName") && updates.get("lastName") != null) {
            user.setLastName(updates.get("lastName"));
        }
        if (updates.containsKey("phone") && updates.get("phone") != null) {
            user.setPhone(updates.get("phone"));
        }
        if (updates.containsKey("email") && updates.get("email") != null) {
            user.setEmail(updates.get("email"));
        }

        userService.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }

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
