package mike.dev.audioservice.repository

import mike.dev.model.AudioFile
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface AudioFileRepository : JpaRepository<AudioFile, Long> {
    fun findByUserId(userId: String): List<AudioFile>
}