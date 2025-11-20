import { useRef, useEffect } from 'react';

const useOutsideClick = (callback) => {
  const ref = useRef();
  // console.log("current ref: ");
  // console.log(ref.current);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        (ref.current !== null || ref.current !== undefined) &&
        !ref.current.contains(event.target)
      ) {
        // console.log("callback for current: ");
        // console.log(ref.current);
        callback();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [callback]);

  return ref;
};

export default useOutsideClick;
