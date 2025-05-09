import AudioUpload from '@/components/features/AudioUpload';
import AudioList from '@/components/features/AudioList';
let error: string | undefined
export default async function Home() {
  // const token = await audioStorageApi.getUser();
  // console.log('token');
  // console.log(token);
  return (
    <main className="container mx-auto px-4 py-8 bg-slate-800">
      <h1 className="text-3xl font-bold mb-8">Audio Tracks</h1>
      {error && (
        <p className="bg-red-500 text-white p-4 rounded mb-4">
          {error}
        </p>)}
      <AudioUpload />
      <p className="text-lg font-semibold mb-4">Available Audio Files:</p>
      {/* Display the list of audio files */}
      <AudioList />
    </main>
  );
}
