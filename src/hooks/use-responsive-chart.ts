import { useState, useEffect } from 'react';

const useResponsiveChartSize = () => {
  const [chartSize, setChartSize] = useState({ width: 260, height: 65 });

  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 400) {
        setChartSize({ width: screenWidth - 40, height: 50 });
      } else if (screenWidth < 768) {
        setChartSize({ width: 300, height: 60 });
      } else {
        setChartSize({ width: 400, height: 70 });
      }
    };

    updateSize(); // initial run
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return chartSize;
};

export default useResponsiveChartSize;
