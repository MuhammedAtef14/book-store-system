package org.bookstore.bookstore.services;


import lombok.AllArgsConstructor;
import org.bookstore.bookstore.Interfaces.CartItemRow;
import org.bookstore.bookstore.dtos.*;
import org.bookstore.bookstore.entities.User;
import org.bookstore.bookstore.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class UserService {
    private final  UserRepository userRepository;

    public Optional<User> findByEmail(String email)
    {
      return  userRepository.findByEmail(email);
    }

    public Optional<User> findById(Integer id) { return  userRepository.findById(id);}

    public void save(User user)
    {
        userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return  userRepository.getAll();
    }


    public void deleteById( Integer id)
    {
        userRepository.deleteById(id);
    }

    public void  updateUser(User user){

        userRepository.save(user);
    }
    public CartResponse getCartWithItems(Long userId, Long cartId) {

        List<Object[]> rows =
                userRepository.findCartItemsWithTotal(userId, cartId);

        // Empty cart
        if (rows.isEmpty()) {
            return new CartResponse(cartId, BigDecimal.ZERO, List.of());
        }

        // Cart-level data (same in all rows)
        BigDecimal cartTotal = (BigDecimal) rows.get(0)[7];

        List<CartItemDto> items = new ArrayList<>();

        for (Object[] row : rows) {

            Long bookId = ((Number) row[2]).longValue();
            String title = (String) row[3];
            BigDecimal price = (BigDecimal) row[5];
            int quantity = ((Number) row[6]).intValue();

            BigDecimal subTotal =
                    price.multiply(BigDecimal.valueOf(quantity));

            items.add(
                    new CartItemDto(
                            bookId,
                            title,
                            quantity,
                            subTotal,
                            price
                    )
            );
        }

        return new CartResponse(cartId, cartTotal, items);
    }

        public OrderHistoryResponse getOrderHistory(Long userId) {

            List<Object[]> rows =
                    userRepository.findOrderHistoryByUserId(userId);

            if (rows.isEmpty()) {
                return new OrderHistoryResponse(userId, null, List.of());
            }

            String username = (String) rows.get(0)[1];

            Map<Long, OrderDto> ordersMap = new LinkedHashMap<>();

            for (Object[] row : rows) {

                Long orderId = ((Number) row[2]).longValue();

                OrderDto order = ordersMap.computeIfAbsent(
                        orderId,
                        id -> new OrderDto(
                                id,
                                (LocalDateTime) row[3],
                                (BigDecimal) row[4],
                                new ArrayList<>()
                        )
                );

                order.getBooks().add(
                        new BookDto(
                                (String) row[5],  // ISBN
                                (String) row[6]   // title
                        )
                );
            }

            return new OrderHistoryResponse(
                    userId,
                    username,
                    new ArrayList<>(ordersMap.values())
            );
        }



    public List<CartResponse> getUserCarts(Integer userId) {

        List<CartItemRow> rows =
                userRepository.findCartItemsByCartId(userId);

        Map<Long, CartResponse> cartMap = new LinkedHashMap<>();

        for (CartItemRow row : rows) {

            BigDecimal price = row.getSellingPrice();
            int quantity = row.getQuantity();

            BigDecimal subTotal =
                    price.multiply(BigDecimal.valueOf(quantity));

            CartResponse cart = cartMap.computeIfAbsent(
                    row.getCartId(),
                    id -> new CartResponse(id, BigDecimal.ZERO, new ArrayList<>())
            );

            cart.getItems().add(
                    new CartItemDto(
                            row.getBookId(),
                            row.getTitle(),
                            quantity,
                            subTotal,
                            price
                    )
            );

            cart.setCartTotal(
                    cart.getCartTotal().add(subTotal)
            );
        }

        return new ArrayList<>(cartMap.values());
    }





}
