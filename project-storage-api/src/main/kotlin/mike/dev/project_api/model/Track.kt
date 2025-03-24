package mike.dev.project_api.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
class Track(
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
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    @JoinColumn(name = "channel_id", nullable = true)
    var channel: Channel? = null
) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long = 0

    // No-args constructor for Jackson deserialization
    constructor() : this(
        name = "",
        startTime = BigDecimal.ZERO,
        position = 0
    )
}
