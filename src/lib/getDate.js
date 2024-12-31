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
