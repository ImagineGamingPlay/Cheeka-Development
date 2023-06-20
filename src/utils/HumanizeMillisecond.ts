const { floor } = Math;

export const humanizeMillisecond = (ms: number) => {
    // const milliseconds = ms / 100;
    const seconds = (ms / 1000) % 60;
    const minutes = (ms / (1000 * 60)) % 60;
    const hours = (ms / (1000 * 60 * 60)) % 24;

    const humanizedHours = floor(hours < 10 ? 0 + hours : hours);
    const humanizedMinutes = floor(minutes < 10 ? 0 + minutes : minutes);
    const humanizedSeconds = floor(seconds < 10 ? 0 + seconds : seconds);

    const res = {
        hours: humanizedHours,
        minutes: humanizedMinutes,
        seconds: humanizedSeconds,
    };

    return res;
};
