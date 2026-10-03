package com.civicroad.service;

import com.civicroad.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class StorageService {

    private final Path rootLocation;
    private final List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "webp", "mp4");

    public StorageService(@Value("${civicroad.upload.dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
        try {
            if (!Files.exists(this.rootLocation)) {
                Files.createDirectories(this.rootLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new BadRequestException("Invalid file name");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        if (!allowedExtensions.contains(extension)) {
            throw new BadRequestException("Unsupported file type: " + extension + ". Allowed: " + String.join(", ", allowedExtensions));
        }

        String uniqueFileName = UUID.randomUUID().toString() + "." + extension;
        try {
            Path destinationFile = this.rootLocation.resolve(Paths.get(uniqueFileName)).normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new BadRequestException("Cannot store file outside current directory");
            }
            Files.copy(file.getInputStream(), destinationFile);
            return "/uploads/" + uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    public String determineFileType(String filePath) {
        if (filePath == null) return "IMAGE";
        String lower = filePath.toLowerCase();
        if (lower.endsWith(".mp4") || lower.endsWith(".mov")) {
            return "VIDEO";
        }
        return "IMAGE";
    }
}
