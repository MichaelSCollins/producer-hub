import React, { Suspense, lazy } from 'react';
const MicroserviceLoader = lazy(() => import('../components/microservices/frame'));
// import Link from 'next/link';
const Home = () => {
  return (
    <div className="">
      {/* //   <h1 className="text-3xl font-bold mb-4">Welcome to ProducerHub</h1> *
    //   <p className="text-lg mb-4">This is the app shell for managing your microservices.</p>
    //   {/* Example UI for selecting a microservice */}{/*
    //   <div className="mb-4">
    //     <Link href="?key=users" className="mr-2 px-4 py-2 bg-blue-500 text-white rounded mr-2 px-4 py-2 bg-blue-500 text-white rounded">
    //       Load User UI
    //     </Link>
    //     <button
          //       className="mr-2 px-4 py-2 bg-green-500 text-white rounded"
          //     >
          //       Load Subscription UI
          //     </button>
          //   </div>

          {/* Render the selected microservice dynamically */ }

      <Suspense fallback={<div>Loading Microservice...</div>}>
        <MicroserviceLoader serviceName="subscriptions" />
      </Suspense>
    </div >
  );
};

export default Home;
