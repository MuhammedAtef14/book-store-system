package org.bookstore.bookstore.controllers;

import org.bookstore.bookstore.services.ReportService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // GET TOTAL SALES FOR PREVIOUS MONTH
    @GetMapping("/totalSales/previousMonth")
    public BigDecimal totalSalesPreviousMonth() {
        return reportService.getTotalSalesPreviousMonth();
    }

    // GET TOTAL SALES FOR SPECIFIC DATE
    @GetMapping("/totalSales/date/{date}")
    public BigDecimal totalSalesByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return reportService.getTotalSalesByDate(localDate);
    }

    // GET TOP 5 CUSTOMERS LAST 3 MONTHS
    @GetMapping("/top5Customers")
    public List<Map<String, Object>> top5CustomersLast3Months() {
        return reportService.getTop5CustomersLast3Months();
    }

    // GET TOP 10 SELLING BOOKS LAST 3 MONTHS
    @GetMapping("/top10Books")
    public List<Map<String, Object>> top10SellingBooksLast3Months() {
        return reportService.getTop10SellingBooksLast3Months();
    }
}
