const formatBytesUtil = (bytes: number) => {

  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(1)} TB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(1)} PB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toFixed(1)} EB`;
  }
};

const formatBytesToUnit = (bytes: number, targetUnit: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB') => {
  const unitMap = {
    'B': 1,
    'KB': 2 ** 10,
    'MB': 2 ** 20,
    'GB': 2 ** 30,
    'TB': 2 ** 40,
    'PB': 2 ** 50,
    'EB': 2 ** 60
  };

  const result = bytes / unitMap[targetUnit];
  return `${result.toFixed(1)}`;
};

export { formatBytesUtil, formatBytesToUnit };