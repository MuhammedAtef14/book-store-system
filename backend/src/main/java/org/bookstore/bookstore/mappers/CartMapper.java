package org.bookstore.bookstore.mappers;

import org.bookstore.bookstore.dtos.CartDto;
import org.bookstore.bookstore.dtos.CartItemDto;
import org.bookstore.bookstore.entities.Cart;
import org.bookstore.bookstore.entities.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.math.BigDecimal;
import java.util.List;


@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "totalPrice", expression = "java(calculateTotalPriceOfItems(cart.getItems()))")
    @Mapping(source = "items", target = "cartItems")
    CartDto toDto(Cart cart);

    @Mapping(source = "book.bookID", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "book.sellingPrice", target = "price")


    @Mapping(target = "subTotal", expression = "java(calculateSubTotal(cartItem))")
    CartItemDto toDto(CartItem cartItem);

    default BigDecimal calculateSubTotal(CartItem cartItem) {
        if (cartItem == null || cartItem.getBook() == null) return BigDecimal.ZERO;
        return cartItem.getBook().getSellingPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
    }

    default BigDecimal calculateTotalPriceOfItems(List<CartItem> cartItems) {
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            totalPrice = totalPrice.add(cartItem.getSubTotal());
        }
        return totalPrice;
    }

}