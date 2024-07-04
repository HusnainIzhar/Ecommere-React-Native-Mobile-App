export default function formatTimestamp(isoString) {
    const date = new Date(isoString);
  
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear().toString().slice(-2);
  
    return `${day}th ${month} ${year}`;
  }
 