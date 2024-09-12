import { message } from "antd";

export function copyToClipboard(text, msg) {
    navigator.clipboard.writeText(text).then(() => {
      message.success(msg);
    });
}

export function replaceValueInArray(array, value, newValue) {
  let idx = array.indexOf(value);
  if (idx >= 0) {
    array.splice(idx, 1, newValue);
  } else {
    throw `Value ${value} not found in array ${array}`
  }
}

export function formatTimestamp(timestamp) {
  if (timestamp && timestamp !== "N/A") {
    timestamp = timestamp.replace('T', ' ');
    return timestamp.split('.')[0]
  }
  else {
    return "N/A"
  }
}
