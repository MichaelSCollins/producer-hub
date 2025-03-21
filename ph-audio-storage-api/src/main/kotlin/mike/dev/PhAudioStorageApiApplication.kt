package mike.dev

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PhAudioStorageApiApplication

fun main(args: Array<String>) {
	runApplication<PhAudioStorageApiApplication>(*args)
}
