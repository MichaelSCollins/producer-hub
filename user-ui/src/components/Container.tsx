import React from "react";

const FlexContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="min-h-screen  flex items-center justify-center bg-background">
        {children}
    </div>;
};

export default FlexContainer;