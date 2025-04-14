import SparkMD5 from 'spark-md5';
import * as Comlink from 'comlink';

export const calculateSha256 = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const calculateMD5 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target && e.target.result) {
        const result = e.target.result as ArrayBuffer;

        const md5 = SparkMD5.ArrayBuffer.hash(result);
        resolve(md5);
      } else {
        reject(new Error("FileReader result is null"));
      }
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsArrayBuffer(blob);
  });
}

Comlink.expose({ calculateSha256, calculateMD5 });