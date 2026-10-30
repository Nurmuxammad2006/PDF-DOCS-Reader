package com.example.pdfdocsopener.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "storage")
public class StorageProperties {

    private String uploadDir = "uploads";
    private long maxSize = 50L * 1024 * 1024;
    private long defaultQuota = 1024L * 1024 * 1024;

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public long getMaxSize() {
        return maxSize;
    }

    public void setMaxSize(long maxSize) {
        this.maxSize = maxSize;
    }

    public long getDefaultQuota() {
        return defaultQuota;
    }

    public void setDefaultQuota(long defaultQuota) {
        this.defaultQuota = defaultQuota;
    }
}
