package mike.dev.project_api.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

@Entity
@Table(name = "channels")
class Channel(
    @Column(nullable = false)
    var name: String,
    @Column(nullable = false)
    var volume: BigDecimal,
    @Column(nullable = false)
    var muted: Boolean = false,
    @Column(nullable = false)
    var solo: Boolean = false,
    @Column(nullable = false)
    var position: Int,
    @OneToMany(mappedBy = "channel", cascade = [CascadeType.ALL], orphanRemoval = true)
    var effects: MutableList<Effect> = mutableListOf(),
    @OneToMany(mappedBy = "channel", cascade = [CascadeType.ALL], orphanRemoval = true)
    var tracks: MutableList<Track> = mutableListOf(),
    @Column(nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long = 0

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    lateinit var project: Project

    // No-args constructor for Jackson deserialization
    constructor() : this(
//        project = Project(), // This will be set by the service layer
        name = "",
        volume = BigDecimal.ZERO,
        muted = false,
        solo = false,
        position = 0
    )

    companion object {
        @JsonCreator
        fun fromJson(
            @JsonProperty("id") id: Long,
            @JsonProperty("name") name: String,
            @JsonProperty("volume") volume: BigDecimal,
            @JsonProperty("muted") muted: Boolean,
            @JsonProperty("solo") solo: Boolean,
            @JsonProperty("position") position: Int,
            @JsonProperty("effects") effects: MutableList<Effect>,
            @JsonProperty("tracks") tracks: MutableList<Track>
        ): Channel {
            return Channel(
//                project = Project(), // This will be set by the service layer
                name = name,
                volume = volume,
                muted = muted,
                solo = solo,
                position = position
            ).apply {
                this.id = id
                this.effects = effects
                this.tracks = tracks
            }
        }
    }
} 