package org.bookstore.bookstore.services;

import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.CartDto;
import org.bookstore.bookstore.entities.Book;
import org.bookstore.bookstore.entities.Cart;
import org.bookstore.bookstore.entities.CartItem;
import org.bookstore.bookstore.entities.User;
import org.bookstore.bookstore.exceptions.BusinessException;
import org.bookstore.bookstore.mappers.CartMapper;
import org.bookstore.bookstore.repositories.CartItemRepository;
import org.bookstore.bookstore.repositories.CartRepository;
import org.bookstore.bookstore.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;

    public Cart AddToCart(Integer userId, Long bookId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createCartForUser(userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BusinessException("Book not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getBook().getId().equals(bookId))
                .findFirst();

        if (existingItem.isPresent()) {
            // If exists, just update quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            // If not, create new item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setBook(book);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return cartRepository.save(cart);
    }

    public CartDto getCartDetails(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        return cartMapper.toDto(cart);
    }


    public void removeItem(Integer userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Remove functionality relying on orphanRemoval=true in Entity
        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        cartRepository.save(cart);
    }

    public void clearCart(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException("Cart not found for user"));
        cart.getItems().clear();
        cartRepository.save(cart);
    }



    private Cart createCartForUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }


}
