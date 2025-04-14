import { useCallback, useEffect, useRef, useState } from 'react';
import * as Comlink from 'comlink';

export function useWorker<T extends object>() {
  const workerRef = useRef<Comlink.Remote<T> | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  
  const getHashWorker = useCallback(() => {
    let hashWorker: Worker | null = null;
    if (!hashWorker) {
      hashWorker = new Worker(new URL('/src/workers/hashWorker.ts', import.meta.url), { type: 'module' });
    }
    return hashWorker;
  }, []);

  useEffect(() => {
    const worker =  getHashWorker();
    const workerAPI = Comlink.wrap<T>(worker);
    workerRef.current = workerAPI;
    setWorker(worker);
  }, [getHashWorker]);

  const terminate = () => {
    if (worker) {
      worker.terminate();
      setWorker(null);
    }
  };

  return { workerAPI: workerRef.current!, terminate };
}
