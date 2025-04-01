package mike.dev.project_api.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "projects")
class Project(
    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var createdBy: String,

    @Column(nullable = false)
    var bpm: Int,

    @Column(nullable = false)
    var quantizeDivision: String,

    @Column(nullable = false)
    var masterVolume: BigDecimal,

    @Column(nullable = false)
    var masterMuted: Boolean = false,

    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL], orphanRemoval = true)
    var channels: MutableList<Channel> = mutableListOf(),

    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL], orphanRemoval = true)
    var effects: MutableList<Effect> = mutableListOf(),

    @Column(nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    constructor():
        this(
                "New Project",
                "Anonymous",
                120,
                "4/4",
                BigDecimal.ONE,
                false,
                mutableListOf<Channel>(),
                mutableListOf<Effect>(),
                LocalDateTime.now(),
                LocalDateTime.now()
                )
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long = 0
}