package com.civicroad.service;

import com.civicroad.dto.request.LoginRequest;
import com.civicroad.dto.request.RegisterRequest;
import com.civicroad.dto.response.AuthResponse;
import com.civicroad.dto.response.UserResponse;
import com.civicroad.entity.*;
import com.civicroad.exception.BadRequestException;
import com.civicroad.exception.ResourceNotFoundException;
import com.civicroad.repository.AuthorityOfficerRepository;
import com.civicroad.repository.CitizenProfileRepository;
import com.civicroad.repository.DepartmentRepository;
import com.civicroad.repository.UserRepository;
import com.civicroad.security.CustomUserDetails;
import com.civicroad.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CitizenProfileRepository citizenProfileRepository;
    private final AuthorityOfficerRepository authorityOfficerRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepository,
            CitizenProfileRepository citizenProfileRepository,
            AuthorityOfficerRepository authorityOfficerRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.citizenProfileRepository = citizenProfileRepository;
        this.authorityOfficerRepository = authorityOfficerRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        Role userRole = Role.ROLE_CITIZEN;
        if (request.getRole() != null) {
            String roleUpper = request.getRole().toUpperCase();
            if (roleUpper.contains("OFFICER")) userRole = Role.ROLE_OFFICER;
            else if (roleUpper.contains("ADMIN")) userRole = Role.ROLE_ADMIN;
        }

        User user = new User(
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                request.getPhone(),
                userRole
        );
        user = userRepository.save(user);

        if (userRole == Role.ROLE_CITIZEN) {
            CitizenProfile profile = new CitizenProfile(user);
            citizenProfileRepository.save(profile);
        } else if (userRole == Role.ROLE_OFFICER) {
            Department dept = departmentRepository.findAll().stream().findFirst().orElse(null);
            AuthorityOfficer officer = new AuthorityOfficer(user, dept, "OFF-" + System.currentTimeMillis() % 10000, null);
            authorityOfficerRepository.save(officer);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new BadRequestException("No authenticated user found");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(), user.getRole().name(), user.getIsActive());
    }

    @Transactional(readOnly = true)
    public User getUserEntity(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new BadRequestException("User is not authenticated");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
