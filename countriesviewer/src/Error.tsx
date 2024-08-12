import React from 'react';

interface ErrorProps { children?: React.ReactNode, retryMessage?: string, retry: () => void }
function Error({ children, retryMessage = "click here to retry.", retry }: ErrorProps) {
    return (
        <div className="error">
            {children}
            <button onClick={retry}>{retryMessage}</button>
        </div>
    );
}

export default Error;