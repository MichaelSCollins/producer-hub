package mike.dev.project_api.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "channels")
class Channel(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    var project: Project,
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
} 