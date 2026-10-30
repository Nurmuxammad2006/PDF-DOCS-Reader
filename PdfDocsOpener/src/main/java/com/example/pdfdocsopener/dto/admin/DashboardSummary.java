package com.example.pdfdocsopener.dto.admin;

public record DashboardSummary(
        long totalUsers,
        long totalFiles,
        long totalStorageBytes,
        long activeUsers
) {
}
