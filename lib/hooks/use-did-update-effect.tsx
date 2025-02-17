import { useRef, useEffect } from 'react';

export function useDidUpdateEffect(effect: React.EffectCallback, deps: React.DependencyList) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      effect(); // 仅在依赖变化时触发
    } else {
      isMounted.current = true;
    }
  }, deps); // 依赖变化触发
}
