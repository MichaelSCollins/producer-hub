package mike.dev.project_api.dto

import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*


data class ProjectDto(
    val id: Long,
    val name: String,
    val createdBy: String,
    val bpm: Int,
    val quantizeDivision: String,
    val masterVolume: BigDecimal,
    val masterMuted: Boolean,
    val channels: List<ChannelDto>,
    val effects: List<EffectDto>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class ChannelDto(
    val id: Long,
    val name: String,
    val volume: BigDecimal,
    val muted: Boolean,
    val solo: Boolean,
    val position: Int,
    val effects: List<EffectDto>,
    val tracks: List<TrackDto>
)

data class EffectDto(
    val id: Long,
    val type: String,
    val enabled: Boolean,
    val parameters: Map<String, Double>,
    val position: Int
)

data class TrackDto(
    val id: Long,
    val name: String,
    val audioFileId: Long?,
    val startTime: BigDecimal
)

data class CreateProjectRequest(
    val name: String,
    val bpm: Int,
    val quantizeDivision: String,
    val masterVolume: BigDecimal = BigDecimal.ONE,
    val masterMuted: Boolean = false
)

data class UpdateProjectRequest(
    val name: String?,
    val bpm: Int?,
    val quantizeDivision: String?,
    val masterVolume: BigDecimal?,
    val masterMuted: Boolean?
)

data class CreateChannelRequest(
    val name: String,
    val volume: BigDecimal = BigDecimal.ONE,
    val muted: Boolean = false,
    val solo: Boolean = false,
    val position: Int
)

data class UpdateChannelRequest(
    val name: String?,
    val volume: BigDecimal?,
    val muted: Boolean?,
    val solo: Boolean?,
    val position: Int?
)

data class CreateEffectRequest(
    val type: String,
    val enabled: Boolean = true,
    val parameters: Map<String, Double>,
    val position: Int
)

data class UpdateEffectRequest(
    val enabled: Boolean?,
    val parameters: Map<String, Double>?,
    val position: Int?
)

data class CreateTrackRequest(
    val name: String,
    val audioFileId: Long?,
    val startTime: BigDecimal
) 