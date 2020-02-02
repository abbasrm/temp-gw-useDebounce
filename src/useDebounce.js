import { useRef, useCallback } from "react";

export const useDebounce = (callback, delay) => {
  const ref = useRef({});

  return useCallback(
    (...args) => {
      console.time("1");
      const promise = new Promise((resolve, reject) => {
        ref.current.resolve = resolve;
        ref.current.reject = reject;
      });

      ref.current.promise = promise;

      if (ref.current.timeout) {
        clearTimeout(ref.current.timeout);
      }

      ref.current.timeout = setTimeout(() => {
        callback(...args)
          .then(res => {
            const isLastRequest = ref.current.promise === promise;
            console.log(
              isLastRequest
                ? `last: update tp "${res.data}"`
                : `not last: don't update to "${res.data}"`
            );

            isLastRequest && ref.current.resolve(res);
          })
          .catch(error => {
            ref.current.promise === promise && ref.current.reject(error);
          });

        ref.current.timeout = undefined;
      }, delay);

      console.timeEnd("1"); // 0.3-0.5
      return ref.current.promise;
    },
    [callback, delay]
  );
};

export const useDebounce2 = (callback, delay) => {
  const ref = useRef({});

  return useCallback(
    (...args) => {
      console.time("2");
      if (!ref.current.promise) {
        ref.current.promise = new Promise((resolve, reject) => {
          // Object.assign((ref.current, { resolve, reject })); // didn't work!!
          ref.current.resolve = resolve;
          ref.current.reject = reject;
        });
      }

      if (ref.current.timeout) {
        clearTimeout(ref.current.timeout);
      }

      ref.current.timeout = setTimeout(() => {
        const promise = callback(...args);
        ref.current.lastPromise = promise;

        ref.current.lastPromise
          .then(res => {
            const lastRequest = promise === ref.current.lastPromise;
            console.log(
              lastRequest
                ? `last: update tp "${res.data}"`
                : `not last: don't update to "${res.data}"`
            );

            lastRequest && ref.current.resolve(res);
            delete ref.current.promise;
          })
          .catch(error => {
            promise === ref.current.lastPromise && ref.current.reject(error);
            delete ref.current.promise;
          });

        ref.current.timeout = undefined;
      }, delay);

      console.timeEnd("2"); // 0.3-0.4
      return ref.current.promise;
    },
    [callback, delay]
  );
};
