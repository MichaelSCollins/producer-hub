'use server';

import { ProjectControls } from '@/components/project/ProjectControls';
import TimeLineControls from '@/components/ui/TimeLineControls';
import TimeLineEditor from '@/components/ui/TimeLineEditor';

export default async function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Producer<span className="text-blue-500">HUB</span></h1>
      <div className="flex gap-4 items-center justify-between">

        <ProjectControls /><TimeLineControls />
      </div>
      {/* <div className="mb-8">
          <input
            type="range"
            min="0"
            max="100"
            value={currentTime}
            className="w-full"
            onChange={(e) => setCurrentTime(parseInt(e.target.value, 10))}
          />
        </div> */}
      <TimeLineEditor />
    </div>
  );
}
