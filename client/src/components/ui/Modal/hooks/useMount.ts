import { useEffect, useState } from 'react';

interface useMountProps {
  opened: boolean;
  animationTime: number;
}

export const useMount = ({ opened, animationTime }: useMountProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (opened && !mounted) {
      setMounted(true);
    } else if (!opened && mounted) {
      setTimeout(() => setMounted(false), animationTime);
    }
  }, [opened]);

  return {
    mounted,
  };
};
