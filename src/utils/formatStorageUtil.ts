const formatStorageUtil = (bytes?: number) => {
  if (!bytes) 
    return;
  
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2)} PB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2)} EB`;
  }
};
export default formatStorageUtil;