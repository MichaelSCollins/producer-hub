package mike.dev.model

//import com.fasterxml.jackson.core.type.TypeReference
//import com.fasterxml.jackson.databind.ObjectMapper
//import com.fasterxml.jackson.module.kotlin.KotlinModule
import jakarta.persistence.*
import java.time.Instant
//import org.postgresql.util.PGobject

@Entity
@Table(name = "audio_files")    
data class AudioFile(
    @Column(nullable = false)
    val filename: String,
    @Column(nullable = false)
    val originalFilename: String,
    @Column(nullable = false)
    val contentType: String,
    @Column(nullable = false)
    val size: Long,
    @Column
    val duration: Double? = null,
    @Column(nullable = false)
    val uploadedAt: Instant = Instant.now(),
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val storageType: StorageType = StorageType.S3,
    @Column(nullable = false)
    val storageLocation: String,
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    val id: Long? = null
//    @Convert(converter = MetadataConverter::class)
//    @Column(columnDefinition = "jsonb")
//    val metadata: Map<String, Any> = mapOf()
)

data class AudioFileResponse(
    val id: Long,
    val filename: String,
    val originalFilename: String,
    val contentType: String,
    val size: Long,
    val duration: Double?,
    val uploadedAt: Instant,
    val downloadUrl: String,
//    val metadata: Map<String, Any>
)

enum class StorageType {
    S3, LOCAL
}
//
//@Converter
//class MetadataConverter : AttributeConverter<Map<String, Any>, Any> {
//    private val objectMapper = ObjectMapper().registerModule(KotlinModule.Builder().build())
//
//    override fun convertToDatabaseColumn(attribute: Map<String, Any>?): Any {
//        val jsonString = objectMapper.writeValueAsString(attribute ?: mapOf<String, Any>())
//        return PGobject().apply {
//            type = "jsonb"
//            value = jsonString
//        }
//    }
//
//    override fun convertToEntityAttribute(dbData: Any?): Map<String, Any> {
//        if (dbData == null) {
//            return mapOf()
//        }
//        val jsonString = when (dbData) {
//            is PGobject -> dbData.value
//            else -> dbData.toString()
//        }
//        return if (jsonString.isNullOrBlank()) {
//            mapOf()
//        } else {
//            objectMapper.readValue(jsonString, object : TypeReference<Map<String, Any>>() {})
//        }
//    }
//}