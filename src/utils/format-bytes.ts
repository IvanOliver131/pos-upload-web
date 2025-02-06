export function formatBytes(bytes: number): string {
  let bytesFormatted = bytes;
  if (bytes < 0) {
    throw new Error("Size in bytes cannot be negative");
  }
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let index = 0;
  while (bytes >= 1024 && index < units.length - 1) {
    bytesFormatted /= 1024;
    index++;
  }
  return `${bytesFormatted.toFixed(2)} ${units[index]}`;
}
