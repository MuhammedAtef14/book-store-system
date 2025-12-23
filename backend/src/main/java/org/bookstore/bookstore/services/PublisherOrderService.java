package org.bookstore.bookstore.services;

import org.bookstore.bookstore.entities.PublisherOrder;
import org.bookstore.bookstore.repositories.PublisherOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublisherOrderService {

    private final PublisherOrderRepository publisherOrderRepository;

    public PublisherOrderService(PublisherOrderRepository publisherOrderRepository) {
        this.publisherOrderRepository = publisherOrderRepository;
    }

    public void placeOrder(Integer bookId, Integer quantity) {
        publisherOrderRepository.placePublisherOrder(bookId, quantity);
    }

    public void confirmOrder(Integer orderId) {
        publisherOrderRepository.confirmPublisherOrder(orderId);
    }

    public void deleteOrder(Integer orderId) {
        publisherOrderRepository.deletePublisherOrder(orderId);
    }

    public List<PublisherOrder> getOrdersByBook(Integer bookId) {
        return publisherOrderRepository.findOrdersByBook(bookId);
    }

    public List<PublisherOrder> getPendingOrders() {
        return publisherOrderRepository.findPendingOrders();
    }

    public List<PublisherOrder> getCompletedOrders() {
        return publisherOrderRepository.findCompletedOrders();
    }

    public int countOrdersForBook(Integer bookId) {
        return publisherOrderRepository.countOrdersForBook(bookId);
    }
}
