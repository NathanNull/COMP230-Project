export const toTimestamp = (time) => {
    // 10:00:00 *date stuff*
    //      ^ split here
    let colon_split = new Date(time).toTimeString().split(':');
    colon_split.pop();
    return colon_split.join(":")
}

export const toDate = (time) => {
    return new Date(time).toDateString();
}

export const mergeDateAndTime = (date, time) => {
    let d = new Date(date);
    let [h, m] = time.split(":");
    d.setHours(h);
    d.setMinutes(m);
    return d;
}

export const parseDuration = (dur) => {
    let num;
    let time;
    if (dur > 24 * 60 * 60 * 1000) {
        num = Math.floor(dur / (24 * 60 * 60 * 1000));
        time = 'day';
    } else if (dur > 60 * 60 * 1000) {
        num = Math.floor(dur / (60 * 60 * 1000));
        time = 'hour';
    } else if (dur > 60 * 1000) {
        num = Math.floor(dur / (60 * 1000));
        time = 'minute';
    } else {
        num = Math.floor(dur / (1000));
        time = 'second';
    }
    return `${num} ${time}${num > 1 ? 's' : ''}`
}