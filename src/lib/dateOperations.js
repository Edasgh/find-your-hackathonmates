export const getDate=()=>{
    const timestamp = Date.now();
    const currentDate = new Date(timestamp);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const ampm = `${hours >= 12 ? "PM" : "AM"}`;
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    const formattedTimeStamp = `${formattedDate} ${formattedTime}`;

    return formattedTimeStamp;
}

export const timeDiff=(date, endDate)=> {
 const secondsElapsed = (new Date() - new Date(date)) / 1000;
 const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
 const intervals = [
   { unit: "year", seconds: 31536000 },
   { unit: "month", seconds: 2592000 },
   { unit: "week", seconds: 604800 },
   { unit: "day", seconds: 86400 },
   { unit: "hour", seconds: 3600 },
   { unit: "minute", seconds: 60 },
   { unit: "second", seconds: 1 },
 ];

 for (const interval of intervals) {
   if (secondsElapsed >= interval.seconds) {
     const delta = Math.floor(secondsElapsed / interval.seconds);
     // Format uses negative for past dates (ago)
     return formatter.format(-delta, interval.unit);
   }
 }
 return "just now";
}
