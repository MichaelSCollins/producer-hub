package mike.dev.service

import mike.dev.model.AudioFile
import mike.dev.model.AudioFileResponse
import mike.dev.model.StorageType
import mike.dev.audioservice.repository.AudioFileRepository
import mike.dev.audioservice.service.S3StorageService
import mike.dev.audioservice.service.StorageService
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.lang.Long.parseLong
import java.util.*

@Service
class AudioFileService(
    private val audioFileRepository: AudioFileRepository,
    private val s3StorageService: S3StorageService,
//    private val localStorageService: LocalStorageService,
    @Value("\${audio.base.url}")
    private val baseUrl: String,
    @Value("\${storage.type:s3}")
    private val storageType: String
) {
    private val logger = KotlinLogging.logger {}

    fun store(file: MultipartFile, metadata: Map<String, Any> = mapOf()): AudioFileResponse {
        val storageService = getStorageService()
        val location = storageService.store(file)
        
        val audioFile = AudioFile(
            filename = file.originalFilename ?: "unknown",
            originalFilename = file.originalFilename ?: "unknown",
            contentType = file.contentType ?: "application/octet-stream",
            size = file.size,
            storageType = if (storageType == "s3") StorageType.S3 else StorageType.LOCAL,
            storageLocation = location,
            userId = "guest"
        )

        val savedFile = audioFileRepository.save(audioFile)
        return createAudioFileResponse(savedFile)
    }

    fun storeAudioFallback(file: MultipartFile, metadata: Map<String, Any>, e: Exception): AudioFileResponse {
        logger.error(e) { "Primary storage failed, falling back to local storage" }
        return store(file, metadata, forceLocal = true)
    }

    fun load(id: Long): Resource? {
        try {
            val file = audioFileRepository.findById(id).orElse(null) ?: return null
            return getStorageService(file.storageType).load(file.storageLocation)
        } catch (e: IllegalArgumentException) {
            logger.error(e) { "Invalid UUID format: $id" }
            return null
        }
    }

    fun delete(id: Long): Boolean {
        try {
            val file = audioFileRepository.findById(id).orElse(null) ?: return false
            val success = getStorageService(file.storageType).delete(file.storageLocation)
            
            if (success) {
                audioFileRepository.deleteById(id)
            }
            
            return success
        } catch (e: IllegalArgumentException) {
            logger.error(e) { "Invalid UUID format: $id" }
            return false
        }
    }

    fun getMetadata(id: Long): AudioFileResponse? {
        try {
            return audioFileRepository.findById(id)
                .map { createAudioFileResponse(it) }
                .orElse(null)
        } catch (e: IllegalArgumentException) {
            logger.error(e) { "Invalid UUID format: $id" }
            return null
        }
    }

    fun listAll(userId: String? = null): List<AudioFileResponse> {
        return if(userId == null)
            audioFileRepository.findAll().map {
                createAudioFileResponse(it)
        } else {
            audioFileRepository.findByUserId(userId).map {
                createAudioFileResponse(it)
            }}
    }

    private fun store(file: MultipartFile, metadata: Map<String, Any>, forceLocal: Boolean): AudioFileResponse {
        val storageService = getStorageService()
        val location = storageService.store(file)
        
        val audioFile = AudioFile(
            filename = file.originalFilename ?: "unknown",
            originalFilename = file.originalFilename ?: "unknown",
            contentType = file.contentType ?: "application/octet-stream",
            size = file.size,
            storageType = if (forceLocal) StorageType.LOCAL else if (storageType == "s3") StorageType.S3 else StorageType.LOCAL,
            storageLocation = location,
            userId = "af_guest"
        )

        val savedFile = audioFileRepository.save(audioFile)
        return createAudioFileResponse(savedFile)
    }

    private fun getStorageService(type: StorageType = if (storageType == "s3") StorageType.S3 else StorageType.LOCAL): StorageService {
        return s3StorageService
    }

    private fun createAudioFileResponse(audioFile: AudioFile): AudioFileResponse {
        return AudioFileResponse(
            id = audioFile.id!!,
            filename = audioFile.filename,
            originalFilename = audioFile.originalFilename,
            contentType = audioFile.contentType,
            size = audioFile.size,
            duration = audioFile.duration,
            uploadedAt = audioFile.uploadedAt,
            downloadUrl = "$baseUrl/api/audio/${audioFile.id}/download"
        )
    }
} 