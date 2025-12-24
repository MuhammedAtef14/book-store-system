package org.bookstore.bookstore.controllers;

import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.CartDto;
import org.bookstore.bookstore.dtos.CheckoutRequest;
import org.bookstore.bookstore.services.CartService;
import org.bookstore.bookstore.services.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartDto> viewCart(@PathVariable Integer userId) {
        CartDto cartDto = cartService.getCartDetails(userId);
        return ResponseEntity.ok(cartDto);
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Void> addToCart(
            @PathVariable Integer userId,
            @RequestParam int bookId,
            @RequestParam int quantity
    ) {
        cartService.addToCart( userId, bookId, quantity);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/remove")
    public ResponseEntity<String> removeFromCart(
            @PathVariable Integer userId,
            @RequestParam int bookId
    ) {
        cartService.removeItem(userId, (long) bookId);
        return ResponseEntity.ok("Item removed");
    }

    @PostMapping("/{userId}/decrement")
    public ResponseEntity<String> decrementCart(
            @PathVariable Integer userId,
            @RequestParam int bookId
    ) {
        cartService.decrementQuantity(userId, (long) bookId);
        return ResponseEntity.ok("Quantity decremented");
    }

    @DeleteMapping("{userId}/clear")
    public ResponseEntity<String> clearCart(
            @PathVariable Integer userId
    ) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart Cleared");
    }

    @PostMapping("/{userId}/checkout")
    public ResponseEntity<String> checkout(
            @PathVariable Integer userId,
            @RequestBody CheckoutRequest credit_card
    ) {
        cartService.checkoutCart(userId, credit_card);
        return ResponseEntity.ok("Checkout successful");
    }
}
