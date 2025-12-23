package org.bookstore.bookstore.service;

import org.bookstore.bookstore.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    // GET TOTAL SALES FOR PREVIOUS MONTH
    public BigDecimal getTotalSalesPreviousMonth() {
        BigDecimal total = reportRepository.totalSalesPreviousMonth();
        return total != null ? total : BigDecimal.ZERO;
    }

    // GET TOTAL SALES FOR SPECIFIC DATE
    public BigDecimal getTotalSalesByDate(LocalDate date) {
        BigDecimal total = reportRepository.totalSalesByDate(date);
        return total != null ? total : BigDecimal.ZERO;
    }

    // GET TOP 5 CUSTOMERS LAST 3 MONTHS
    public List<Map<String, Object>> getTop5CustomersLast3Months() {
        return reportRepository.top5CustomersLast3Months();
    }

    // GET TOP 10 SELLING BOOKS LAST 3 MONTHS
    public List<Map<String, Object>> getTop10SellingBooksLast3Months() {
        return reportRepository.top10SellingBooksLast3Months();
    }
}
