import React from 'react';
import routes from '../../config/routes.config'; // Adjust the import path as necessary

interface MicroserviceFrameProps {
    serviceName: string;
}

const MicroserviceFrame: React.FC<MicroserviceFrameProps> = ({ serviceName: service }) => {
    const microserviceUrl = routes[service]?.ui?.endpoint?.local;
    if (!microserviceUrl)
    {
        return <div className='h-screen w-screen'>
            <div className="m-auto text-center font-bold text-xl py-2">
                Error: Microservice URL not found.
            </div>
        </div>;
    }
    const url = microserviceUrl;
    return (
        <iframe
            src={url}
            title="Microservice"
            className="w-full h-screen"
        />
    );
};

export default MicroserviceFrame;
