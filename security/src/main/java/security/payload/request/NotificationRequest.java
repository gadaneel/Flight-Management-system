package security.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class NotificationRequest {
    @NotBlank
    private String userType;

    @NotBlank
    @Size(max = 100)
    private String message;

//    private Set<String> roles;

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}