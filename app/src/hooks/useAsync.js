import React, { useState, useEffect, useCallback } from 'react';

const useAsync = (asyncFunc, immediate=true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setStatus('pending');
    return asyncFunc().then((res) => {
      setStatus('success');
      setValue(res);
    }).catch((err) =>{
      setStatus('error');
      setError(err);
    });
  }, [asyncFunc]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  
  return {
    execute,
    status,
    value, 
    error,
  }
};
