package mike.dev.project_api.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "tracks")
class Track(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id", nullable = false)
    var channel: Channel,

    @Column(nullable = false)
    var name: String,

    @Column(name = "audio_file_id")
    var audioFileId: Long? = null,

    @Column(nullable = false)
    var startTime: BigDecimal,

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