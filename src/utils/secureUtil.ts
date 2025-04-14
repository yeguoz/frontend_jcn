// import SparkMD5 from "spark-md5";

import SparkMD5 from "spark-md5";

export const calculateSha2561 = async (file: Blob): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const calculateMD51 = (blob: Blob): Promise<string> => {
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

let hashWorker: Worker | null;
export function initHashWorker() {
  if (!hashWorker) {
    hashWorker = new Worker(new URL('../workers/hashWorker.ts', import.meta.url), { type: 'module' });
  }
  return hashWorker;
}

export function calculateSha256(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = initHashWorker();
    
    worker.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'sha256') {
        resolve(e.data.result);
      }
    };
    
    worker.onerror = (error) => {
      reject(`Worker 错误: ${error.message}`);
    };

    // 直接将 Blob 传递给 Worker
    worker.postMessage({ type: 'sha256', blob });
  });
}

export function calculateMD5(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = initHashWorker();

    worker.onmessage = (e: MessageEvent) => {
      if (e.data.type === 'md5') {
        resolve(e.data.result);
      }
    };

    worker.onerror = (error) => {
      reject(`Worker 错误: ${error.message}`);
    };

    // 直接将 Blob 传递给 Worker
    worker.postMessage({ type: 'md5', blob });
  });
}


// export function calculateSha256(blob: Blob): Promise<string> {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const buffer = reader.result as ArrayBuffer;
//       const worker = initHashWorker();
//       worker.onmessage = (e: MessageEvent) => {
//         if (e.data.type === 'sha256') resolve(e.data.result);
//       };
//       worker.postMessage({ type: 'sha256', buffer });
//     };
//     reader.readAsArrayBuffer(blob);
//   });
// }

// export function calculateMD5(blob: Blob): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const buffer = reader.result as ArrayBuffer;

//       const worker = initHashWorker();  // 确保每个分片使用独立的 worker
//       worker.onmessage = (e: MessageEvent) => {
//         if (e.data.type === 'md5') {
//           resolve(e.data.result);
//         }
//       };

//       worker.onerror = (error) => {
//         reject(`Worker 错误: ${error.message}`);
//       };

//       worker.postMessage({ type: 'md5', buffer }, [buffer]);
//     };
//     reader.onerror = (e) => reject(`FileReader 错误: ${e.target?.error}`);
//     reader.readAsArrayBuffer(blob);
//   });
// }
