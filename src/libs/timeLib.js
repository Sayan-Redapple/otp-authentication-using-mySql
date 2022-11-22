const moment = require('moment')
const momenttz = require('moment-timezone')
const timeZone = process.env.TIME_ZONE


let now = () => {
  return moment.utc().format()
}

let getLocalTime = () => {
  return moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
}

let getCurrentTimeStamp = ()=>{
  console.log(moment().tz(timeZone).unix())
    return moment().tz(timeZone).unix();
}

let convertToLocalTime = (time) => {
  return momenttz.tz(time, timeZone).format('YYYY-MM-DD HH:mm:ss')
}

let calculateTime = (diff)=>{  
    const diffDuration = moment.duration(diff);
    return {
      days:diffDuration.days(),
      hours:diffDuration.hours(),
      minutes:diffDuration.minutes(),
      seconds:diffDuration.seconds()
    }
}

let calculateTimeDiff = (firstdatetime,seconddatetime)=>{  
  const diff  = moment(seconddatetime,"DD/MM/YYYY HH:mm:ss").diff(moment(firstdatetime,"DD/MM/YYYY HH:mm:ss"));
  return diff;
}

let calculateExpTime = (time)=>{
  let finaldatetime = moment().add(time,'s');
  return momenttz.tz(finaldatetime, timeZone).unix();
}

let calculateTrackerTime = (input)=>{
  let initialdatetime = moment(getLocalTime());
  let finaldatetime = moment(input);
  console.log(`input : ${input} initialdatetime : ${initialdatetime} finaldatetime : ${finaldatetime}`);
  let counter = finaldatetime.diff(initialdatetime, 'seconds');
  return counter;
}

let checkExpTime = (time)=>{
  let diff = moment.tz(time * 1000,timeZone).unix() - moment().tz(timeZone).unix();
  if(diff > 0){
    return true;
  }else{
    return false;
  }
}

module.exports = {
  getLocalTime: getLocalTime,
  convertToLocalTime: convertToLocalTime,
  calculateTime:calculateTime,
  calculateExpTime:calculateExpTime,
  calculateTimeDiff:calculateTimeDiff,
  calculateTrackerTime:calculateTrackerTime,
  checkExpTime:checkExpTime,
  now:now,
  getCurrentTimeStamp:getCurrentTimeStamp
}
