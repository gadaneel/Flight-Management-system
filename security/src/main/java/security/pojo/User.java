package security.pojo;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection= "users")
public class User {
	  @Id
	  private String id;

	  @NotBlank
	  private int confirmation_number;

	  @Size(min=10,max=20)
	  private String phone;

	  @NotBlank
	  @Size(max = 20)
	  private String username;

	  @NotBlank
	  @Size(max = 20)
	  private String name;

	  @NotBlank
	  @Size(max = 50)
	  @Email
	  private String email;
	  @NotBlank
	  @Size(max = 120)
	  private String password;
	  @DBRef
	  private Set<Role> roles = new HashSet<>();
	  @DBRef
	  private Set<Coupon> coupons = new HashSet<>();

	  public User() {
	  }
		public User(String name, String phone, String email, String password, int confirmation_number) {
			this.name = name;
			this.username = email;
			this.email=email;
			this.password = password;
			this.phone=phone;
			this.confirmation_number=confirmation_number;
		}
	  public String getId() {
	    return id;
	  }
	  public void setId(String id) {
	    this.id = id;
	  }
	  public String getUsername() {
	    return username;
	  }
	  public void setUsername(String username) {
	    this.username = username;
	  }
	  public String getEmail() {
	    return email;
	  }
	  public void setEmail(String email) {
	    this.email = email;
	  }
	  public String getPassword() {
	    return password;
	  }
	  public void setPassword(String password) {
	    this.password = password;
	  }
	  public Set<Role> getRoles() {
	    return roles;
	  }
	  public void setRoles(Set<Role> roles) {
	    this.roles = roles;
	  }
	  public Set<Coupon> getCoupons() {
		return coupons;
	}
	  public void setCoupons(Set<Coupon> coupons) {
		this.coupons = coupons;
	}

	public int getConfirmation_number() {
		return confirmation_number;
	}

	public void setConfirmation_number(int confirmation_number) {
		this.confirmation_number = confirmation_number;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}