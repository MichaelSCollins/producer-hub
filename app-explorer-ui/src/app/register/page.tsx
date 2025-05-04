import { Suspense, lazy } from "react";
const MicroserviceLoader = lazy(() => import('../../components/microservices/frame'));
const Home = () => <div className="">
    <Suspense fallback={<div>Loading Microservice...</div>}>
        <MicroserviceLoader serviceName={"register"} />
    </Suspense>
</div>;

export default Home;
