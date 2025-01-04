import { EffectCallback, DependencyList, useEffect, useRef, RefObject } from 'react';


export function useEffectOnce(cb: (r: RefObject<any>) => any, condition?: DependencyList) {
  const isTriggered = useRef(false);
  useEffect(() => {
    if (isTriggered.current) return;
    return cb(isTriggered);
  }, condition);
}
