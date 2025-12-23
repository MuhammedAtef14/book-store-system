package org.bookstore.bookstore.services;

import lombok.AllArgsConstructor;
import org.bookstore.bookstore.dtos.CartDto;
import org.bookstore.bookstore.dtos.CheckoutRequest;
import org.bookstore.bookstore.entities.*;
import org.bookstore.bookstore.exceptions.BusinessException;
import org.bookstore.bookstore.mappers.CartMapper;
import org.bookstore.bookstore.repositories.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;


@AllArgsConstructor
@Service
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;
    private final PaymentService paymentService;
    private final CustomerOrderRepository  customerOrderRepository;
    private final CustomerOrderItemRepository customerOrderItemRepository;

    public void addToCart(Integer userId, int bookId, int quantity) {

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseGet(() -> createCartForUser(userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BusinessException("Book not found"));

        cartItemRepository.addToCart(
                cart.getId(),
                book.getBookID().longValue(),
                quantity
        );
    }


    public CartDto getCartDetails(Integer userId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new BusinessException("Cart not found"));

        return cartMapper.toDto(cart);
    }


    public void removeItem(Integer userId, Long bookId) {

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new BusinessException("Cart not found"));

        cartItemRepository.removeFromCart(cart.getId(), bookId);
    }

    public void decrementQuantity(Integer userId, Long bookId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new BusinessException("Cart not found"));

        cartItemRepository.decrementQuantity(cart.getId(), bookId);
        cartItemRepository.removeIfZero(cart.getId(), bookId);
    }


    public void clearCart(Integer userId) {

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new BusinessException("Cart not found"));

        cartRepository.deleteCartByUserId(userId);
    }

    public void checkoutCart(Integer userId, CheckoutRequest credit_card) {
        paymentService.validCredintials(userId, credit_card);

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new BusinessException("Cart not found"));

        Long cartId = cart.getId();

        CartDto cartDto = cartMapper.toDto(cart);
        BigDecimal totalPrice = cartDto.getTotalPrice();

        if (totalPrice == null || totalPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Cart is empty");
        }

        customerOrderRepository.insertCustomerOrder(
                userId,
                totalPrice,
                "PROCESSING",
                Timestamp.valueOf(LocalDateTime.now())
        );

        Integer orderId = customerOrderRepository.getLastInsertedOrderId();

        customerOrderItemRepository.insertOrderItemsFromCart(orderId, cartId);

        cartItemRepository.clearCart(cartId);
    }




    private Cart createCartForUser(Integer userId) {

        if (!userRepository.existsById(userId)) {
            throw new BusinessException("User not found");
        }
        cartRepository.insertCartForUser(userId);

        return cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new BusinessException("Cart creation failed"));
    }


}
