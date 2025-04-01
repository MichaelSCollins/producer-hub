import AudioUpload from '@/components/features/AudioUpload';
import AudioList from '@/components/features/AudioList';
import { audioStorageApi } from '@/lib/audioStorage';

export default async function Home() {
  const tracks = await audioStorageApi.getAllAudioFiles();
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Audio Tracks</h1>
      <AudioUpload />
      <p className="text-lg font-semibold mb-4">Available Audio Files:</p>
      {/* Display the list of audio files */}
      <AudioList tracks={tracks} />
    </main>
  );
}
