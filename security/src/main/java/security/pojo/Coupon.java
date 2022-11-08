package security.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.sql.Date;

@Document(collection= "coupons")
public class Coupon {
    @Id
    private String id;
    @NotBlank
    @Size(max = 20)
    private String code;
    @NotBlank
    private Date expiryDate;
    @NotBlank
    @Size(max = 120)
    private Integer discountValue;
    @NotBlank
    private Boolean isPublic;

    public Coupon() {
    }
    public Coupon(String code, Date expiryDate, Integer discountValue, Boolean isPublic) {
        this.code = code;
        this.expiryDate = expiryDate;
        this.discountValue = discountValue;
        this.isPublic = isPublic;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

    public Date getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getDiscountValue() {
        return discountValue;
    }
    public void setDiscountValue(Integer discountValue) {
        this.discountValue = discountValue;
    }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

}