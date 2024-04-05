import { useEffect, useMemo, useState } from 'react';
import { SlCard } from '@shoelace-style/shoelace/dist/react';
import { getPresaleRoundInfo } from '../utils/presale';

export const Countdown = () => {
  const [secondsToEnd, setSecondsToEnd] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [countdownName, setCountdownName] = useState<string | null>(null);
  useEffect(() => {
    let interval: NodeJS.Timer;
    let outinterval: NodeJS.Timer;

    const getTokenCountdown = async () => {
      const roundInfo = await getPresaleRoundInfo();
      const currentDate = new Date();
      const endDate = new Date(roundInfo.roundEnd * 1000);
      const secondsLeft = endDate.valueOf() - currentDate.valueOf();
      if (secondsLeft > 0) {
        interval = setInterval(() => {
          setSecondsToEnd((prev) => {
            if (prev === 1) {
              setIsActive(() => false);
              clearInterval(interval);
            }
            return prev ? prev - 1 : 0;
          });
        }, 1000);
      }
      setSecondsToEnd(Math.floor(secondsLeft / 1000));
      setIsActive(secondsLeft > 0);
      setCountdownName(`PRESALE ROUND ${roundInfo.currentRound}`);
    };
    getTokenCountdown();

    outinterval = setInterval(() => {
      clearInterval(interval);
      getTokenCountdown();
    }, 60000);

    return () => {
      interval && clearInterval(interval);
      outinterval && clearInterval(outinterval);
    };
  }, []);

  const timeLeft = useMemo(
    () => ({
      days: isActive && secondsToEnd ? Math.floor(secondsToEnd / 86400) : 0,
      hours: isActive && secondsToEnd ? Math.floor((secondsToEnd % 86400) / 3600) : 0,
      minutes: isActive && secondsToEnd ? Math.floor((secondsToEnd % 3600) / 60) : 0,
      seconds: isActive && secondsToEnd ? secondsToEnd % 60 : 0,
    }),
    [isActive, secondsToEnd]
  );

  return (
    <SlCard data-hidden={secondsToEnd === null} className={`countdown ${isActive === false ? 'done' : ''}`}>
      <div className="countdown__inner">
        <div className="countdown__title">
          <h2>
            <span>{countdownName}</span>
          </h2>
          <span>end{isActive ? `s In:` : 'ed!'}</span>
        </div>
        <div className="countdown__timer">
          <span className="countdown__timer__value">{timeLeft.days}</span>
          <span className="countdown__timer__label">Days</span>
        </div>
        <div className="countdown__timer">
          <span className="countdown__timer__value">{timeLeft.hours}</span>
          <span className="countdown__timer__label">Hours</span>
        </div>
        <div className="countdown__timer">
          <span className="countdown__timer__value">{timeLeft.minutes}</span>
          <span className="countdown__timer__label">Minutes</span>
        </div>
        <div className="countdown__timer">
          <span className="countdown__timer__value">{timeLeft.seconds}</span>
          <span className="countdown__timer__label">Seconds</span>
        </div>
      </div>
    </SlCard>
  );
};
