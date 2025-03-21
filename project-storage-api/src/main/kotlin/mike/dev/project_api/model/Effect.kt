package mike.dev.project_api.model

import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.time.LocalDateTime

@Entity
@Table(name = "effects")
class Effect(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id")
    var channel: Channel? = null,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    var project: Project? = null,
    @Column(nullable = false)
    var type: String,
    @Column(nullable = false)
    var enabled: Boolean = true,
    @Column(nullable = false, columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    var parameters: Map<String, Double>,
    @Column(nullable = false)
    var position: Int,
    @Column(nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long = 0
} 