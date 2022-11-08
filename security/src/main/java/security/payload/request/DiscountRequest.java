package security.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.sql.Date;

public class DiscountRequest {
    @NotBlank
    @Size(max=20)
    private String code;

    @NotBlank
    private Integer discountValue;

    @NotBlank
    private Date expiryDate;

    @NotBlank
    @Size(max=50)
    private String emailAddress;

    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }

    public Integer getDiscountValue() { return discountValue; }
    public void setDiscountValue(Integer discountValue) { this.discountValue = discountValue; }

    public String getEmailAddress() { return emailAddress; }
    public void setEmailAddress(String emailAddress) { this.emailAddress = emailAddress; }

}