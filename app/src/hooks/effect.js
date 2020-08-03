import { useEffect } from 'react';

//  capture react useEffect aborted
const useAsyncEffect = (asyncFunc, deps) => useEffect(() => {
  const callbacks = [
    () => controller.aborted = true
  ];
  const controller = {
    aborted: false,
    addAbortCallback: (callback) => callbacks.push(callback)
  };
  asyncFunc(controller);
  return () => callbacks.forEach((callback) => callback());
}, deps); // eslint-disable-line react-hooks/exhaustive-deps

export {
  useAsyncEffect
};