import { useEffect, useMemo, useState } from "react";
import { env } from "../utils/env";

export const Countdown = () => {
  const [secondsToEnd, setSecondsToEnd] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [countdownName, setCountdownName] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timer;
    const getTokenCountdown = async () => {
      const response = await fetch(`${env.API_URL}/rounds`);
      const { data } = await response.json();
      if (data.isActive) {
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
      setSecondsToEnd(data.secondsToEnd);
      setIsActive(data.isActive);
      setCountdownName(data.name);
    };
    getTokenCountdown();

    return () => {
      interval && clearInterval(interval);
    };
  }, []);

  const timeLeft = useMemo(
    () => ({
      days: isActive && secondsToEnd ? Math.floor(secondsToEnd / 86400) : 0,
      hours:
        isActive && secondsToEnd
          ? Math.floor((secondsToEnd % 86400) / 3600)
          : 0,
      minutes:
        isActive && secondsToEnd ? Math.floor((secondsToEnd % 3600) / 60) : 0,
      seconds: isActive && secondsToEnd ? secondsToEnd % 60 : 0,
    }),
    [isActive, secondsToEnd]
  );

  return (
    <div
      data-hidden={secondsToEnd === null}
      className={`countdown ${isActive === false ? "done" : ""}`}
    >
      <div className="countdown__inner">
        <div className="countdown__title">
          <h2>
            <span>{countdownName}</span>
          </h2>
          <span>end{isActive ? `s In:` : "ed!"}</span>
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
    </div>
  );
};
