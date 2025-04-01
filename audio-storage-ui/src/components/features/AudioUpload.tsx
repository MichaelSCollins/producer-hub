"use client"
import UIJob from "@/lib/facade/UIJob";
import { audioStorageApi } from "@/lib/audioStorage";
import { useState, ChangeEvent } from "react";

const AudioUpload = () => {
  const [audio, setAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const handleError = (error: string) => {
    setError(error);
  }
  const handleSuccess = (message: string) => {
    setSuccess(message);
  }
  const beforeAll = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  }
  const afterAll = () => {
    setLoading(false);
  }
  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Audio change event", e);
    const [file] = e.target.files!;
    if (file)
    {
      setAudio(file);
      setAudioUrl(URL.createObjectURL(file));
      setAudioName(file.name);
    }
  };
  const changeFileJob = new UIJob();
  changeFileJob.setJobFunction(handleAudioChange)
    .before(beforeAll)
    .after(afterAll)
    .error(handleError)
    .success(handleSuccess);
  const uploadJob = new UIJob()
    .before(beforeAll)
    .setJobFunction(async () => {
      if (audio)
      {
        // Upload audio file
        console.log("Uploading audio file:", audio);
        await audioStorageApi.uploadAudio(audio);
      }
    })
    .after(afterAll)
    .error(handleError)
    .success(() => {
      window.location.reload();
      handleSuccess(audio?.name || "Audio uploaded");
    });
  return (
    <div className={`relative h-full flex flex-col cursor-pointer
      bg-slate-900/40 rounded-lg p-2 mb-2
      cursor-pointer-800/40`}>
      <h1>Upload Local File:</h1>
      <div className="flex flex-col gap-2 justify-left">
        {error && <p className="text-red-400">Error: {error}</p>}
        {success && <p className="text-green-400">Success: {success}</p>}
        {loading && <p>Loading...</p>}
      </div>
      <div className="flex gap-2 justify-between w-full">
        {!loading
          && <div
            className="flex flex-col justify-left border-4 h-full border-slate-400 text-center rounded-lg p-2"
          >
            {audioName && <p className="text-xs px-3">{audioName}</p>}
            {!audioUrl && <input type="file" accept="audio/*" className="cursor-pointer" src={audioUrl ?? undefined} onChange={changeFileJob.execute} />}
            {audioUrl && <audio src={audioUrl} controls
              className="rounded-lg cursor-pointer shadow-lg p-2 bg-none"
            />}
          </div>
        }
        <div>
          <button
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-indigo-700"
            onClick={uploadJob.execute}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioUpload;