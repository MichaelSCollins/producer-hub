import React from 'react';
import { Route, Routes } from 'react-router-dom';

const UsersHome = React.lazy(() => import('./pages/Home'));

const UsersRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<UsersHome />} />
        </Routes>
    );
};

export default UsersRoutes;
