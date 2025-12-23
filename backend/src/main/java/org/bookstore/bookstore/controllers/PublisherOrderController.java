package org.bookstore.bookstore.controllers;

import org.bookstore.bookstore.services.PublisherOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publisherOrders")
public class PublisherOrderController {

    private final PublisherOrderService publisherOrderService;

    public PublisherOrderController(PublisherOrderService publisherOrderService) {
        this.publisherOrderService = publisherOrderService;
    }

    // PLACE A PUBLISHER ORDER
    @PostMapping("/place/{bookId}/{quantity}")
    public void placeOrder(@PathVariable Integer bookId, @PathVariable Integer quantity) {
        publisherOrderService.placeOrder(bookId, quantity);
    }

    // CONFIRM A PUBLISHER ORDER
    @PutMapping("/confirm/{orderId}")
    public void confirmOrder(@PathVariable Integer orderId) {
        publisherOrderService.confirmOrder(orderId);
    }

    // DELETE A PUBLISHER ORDER
    @DeleteMapping("/delete/{orderId}")
    public void deleteOrder(@PathVariable Integer orderId) {
        publisherOrderService.deleteOrder(orderId);
    }

    // GET ORDERS FOR A SPECIFIC BOOK
    @GetMapping("/book/{bookId}")
    public List<?> getOrdersByBook(@PathVariable Integer bookId) {
        return publisherOrderService.getOrdersByBook(bookId);
    }

    // GET PENDING ORDERS
    @GetMapping("/pending")
    public List<?> getPendingOrders() {
        return publisherOrderService.getPendingOrders();
    }

    // GET COMPLETED ORDERS
    @GetMapping("/completed")
    public List<?> getCompletedOrders() {
        return publisherOrderService.getCompletedOrders();
    }

    // COUNT ORDERS FOR A BOOK
    @GetMapping("/count/{bookId}")
    public int countOrdersForBook(@PathVariable Integer bookId) {
        return publisherOrderService.countOrdersForBook(bookId);
    }
}
