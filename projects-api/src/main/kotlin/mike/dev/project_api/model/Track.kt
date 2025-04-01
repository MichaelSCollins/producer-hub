package mike.dev.project_api.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
class Track(
    @Column(nullable = true)
    var name: String,
    @Column(name = "audio_file_id", nullable =true)
    var audioFileId: Long? = null,
    @Column(nullable = true)
    var startTime: BigDecimal,
    @Column(nullable = true)
    var position: Int,

    @Column(nullable = true)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = true)
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    @JoinColumn(name = "channel_id", nullable = false)
    var channel: Channel
) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long = 0

    // No-args constructor for Jackson deserialization
    constructor() : this(
        name = "",
        startTime = BigDecimal.ZERO,
        position = 0,
        channel = Channel()
    )
}
