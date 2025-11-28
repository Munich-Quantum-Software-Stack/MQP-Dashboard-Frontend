import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTokenDuration, getSeconds, getMinutes } from '@utils/auth';
import { authActions } from '@store/auth-slice';

const Timer = () => {
  const dispatch = useDispatch();
  const fs = useSelector((state) => state.accessibilities.font_size);

  const tokenDuration = getTokenDuration();
  const [minutes, setMinutes] = useState(getMinutes(tokenDuration));
  const [seconds, setSeconds] = useState(getSeconds(tokenDuration));

  useEffect(() => {
    const getTime = () => {
      const tokenDuration = getTokenDuration();
      setMinutes(getMinutes(tokenDuration));
      setSeconds(getSeconds(tokenDuration));
    };
    // display Timer
    const interval = setInterval(() => getTime(), 1000);

    // Count down to trigger Modal
    const timeout = setTimeout(
      () => {
        //setIsExpired(true);
        dispatch(authActions.set_expired());
      },
      tokenDuration - 10 * 1000,
    );
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [tokenDuration, dispatch]);

  return (
    <div id="timer" style={{ fontSize: +fs }} title="Session expiration">
      <span className="timer_icon"></span>
      <span>
        {minutes < 10 ? '0' + minutes : minutes} : {seconds < 10 ? '0' + seconds : seconds}
      </span>
    </div>
  );
};

export default Timer;
