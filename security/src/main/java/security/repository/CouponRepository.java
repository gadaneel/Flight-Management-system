package security.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import security.pojo.Coupon;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends MongoRepository<Coupon, String> {
    Optional<Coupon> findByCode(String code);
    Boolean existsByCode(String code);

    @Query("{'isPublic' : :#{#isPublic}")
    List<Coupon> findByData(@Param("isPublic") Boolean isPublic);
}