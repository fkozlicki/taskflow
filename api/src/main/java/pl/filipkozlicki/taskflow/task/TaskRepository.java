package pl.filipkozlicki.taskflow.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    @Modifying
    @Query("UPDATE Task t SET t.position = t.position + 1 WHERE t.status = :column AND t.position BETWEEN :from AND :to")
    void incrementPositions(String column, int from, int to);

    @Modifying
    @Query("UPDATE Task t SET t.position = t.position - 1 WHERE t.status = :column AND t.position BETWEEN :from AND :to")
    void decrementPositions(String column, int from, int to);
}
