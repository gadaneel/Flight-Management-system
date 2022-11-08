package security.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import security.pojo.Coupon;

import java.util.Optional;

public interface CouponRepository extends MongoRepository<Coupon, String> {
    Optional<Coupon> findByCode(String code);
    Boolean existsByCode(String code);
}