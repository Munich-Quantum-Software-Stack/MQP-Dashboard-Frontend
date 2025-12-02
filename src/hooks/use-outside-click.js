/**
 * Hook to detect clicks outside a referenced element
 */
import { useRef, useEffect } from 'react';

const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (
        (ref.current !== null || ref.current !== undefined) &&
        !ref.current.contains(event.target)
      ) {
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
