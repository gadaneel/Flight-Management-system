package security.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import security.jwt.jwt.JwtUtils;
import security.jwt.services.UserDetailsImpl;
import security.payload.request.DiscountRequest;
import security.payload.request.LoginRequest;
import security.payload.request.SignUpRequest;
import security.payload.request.NotificationRequest;
import security.payload.response.MessageResponse;
import security.payload.response.UserInfoResponse;
import security.pojo.Coupon;
import security.pojo.ERole;
import security.pojo.Role;
import security.pojo.User;
import security.repository.CouponRepository;
import security.repository.RoleRepository;
import security.repository.UserRepository;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;
  @Autowired
  UserRepository userRepository;
  @Autowired
  RoleRepository roleRepository;
  @Autowired
  CouponRepository couponRepository;
  @Autowired
  PasswordEncoder encoder;
  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
    SecurityContextHolder.getContext().setAuthentication(authentication);
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
    List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .body(new UserInfoResponse(userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }
    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }
    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword()));
    Set<String> strRoles = signUpRequest.getRoles();
    Set<Role> roles = new HashSet<>();
    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
          case "admin":
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);
            break;
          case "attendee":
            Role attendeeRole = roleRepository.findByName(ERole.ROLE_ATTENDEE)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(attendeeRole);
            break;
          default:
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }
      });
    }
    user.setRoles(roles);
    userRepository.save(user);
    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @PostMapping("/addUserNotification")
  public String addUserNotification(@Valid @RequestBody NotificationRequest notificationRequest) {
    Role userRole = null;
    if (notificationRequest.getUserType().equals("ROLE_USER")) {
      userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    } else if (notificationRequest.getUserType().equals("ROLE_ATTENDEE")) {
      userRole = roleRepository.findByName(ERole.ROLE_ATTENDEE)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    }
    userRole.setMessage(notificationRequest.getMessage());
    roleRepository.save(userRole);
    return "Notification Updated Successfully!";
  }

  @GetMapping("/user/{userType}")
  public ResponseEntity<?> getNotification(@PathVariable("userType") String userType) {
    Role userRole = null;
    if (userType.equals("ROLE_USER")) {
      userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    } else if (userType.equals("ROLE_ATTENDEE")) {
      userRole = roleRepository.findByName(ERole.ROLE_ATTENDEE)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    }
    return ResponseEntity.ok(new MessageResponse(userRole.getMessage()));
  }

  @PostMapping("/addDiscountCode")
  public String addDiscountCode(@Valid @RequestBody DiscountRequest discountRequest) {
    if (couponRepository.existsByCode(discountRequest.getCode())) {
      return "Discount Code already exists";
    } else {
      if (discountRequest.getEmailAddress().equals("all")) {
        Coupon coupon = new Coupon(
                discountRequest.getCode(),
                discountRequest.getExpiryDate(),
                discountRequest.getDiscountValue(),
                true
        );
        couponRepository.save(coupon);
      } else {
        Coupon coupon = new Coupon(
                discountRequest.getCode(),
                discountRequest.getExpiryDate(),
                discountRequest.getDiscountValue(),
                false
        );

        couponRepository.save(coupon);
        User user = userRepository.findByUsername(discountRequest.getEmailAddress()).get();
        Set<Coupon> coupons = user.getCoupons();
        coupons.add(coupon);
        user.setCoupons(coupons);
        userRepository.save(user);
      }
    }
    return "Discount Code added successfully";
  }
}
