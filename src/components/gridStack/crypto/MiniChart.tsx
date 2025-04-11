"use client";

import { useEffect, useRef, useCallback } from "react";

interface MiniChartProps {
  data: number[];
  width: number;
  height: number;
  color: string;
  animate?: boolean;
  showTooltip?: boolean;
}

export default function MiniChart({
  data,
  width,
  height,
  color,
  animate = true,
}: //   showTooltip = false,
MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const previousDataRef = useRef<number[]>([]);
  const isDrawingRef = useRef(false);
  const currentDataRef = useRef<number[]>(data);
  const targetDataRef = useRef<number[]>(data);
  const animationProgressRef = useRef(animate ? 0 : 1);
  const transitionStartTimeRef = useRef<number | null>(null);
  const lastRenderTimeRef = useRef<number>(0);

  // Memoize the normalized data to avoid recalculations
  //   const normalizedData = useMemo(() => {
  //     if (!data || data.length === 0) return [];

  //     const max = Math.max(...data);
  //     const min = Math.min(...data);
  //     const range = max - min > 0 ? max - min : 1;

  //     return data.map((value) => (value - min) / range);
  //   }, [data]);

  // Draw the chart with current data and animation progress
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isDrawingRef.current) return;

    isDrawingRef.current = true;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      isDrawingRef.current = false;
      return;
    }

    // Set canvas dimensions with higher resolution for sharper rendering
    if (canvas.width !== width * 2 || canvas.height !== height * 2) {
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2); // Scale for high DPI displays
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Skip drawing if no data
    if (currentDataRef.current.length < 2) {
      isDrawingRef.current = false;
      return;
    }

    // Calculate points based on data
    const currentData = currentDataRef.current;
    const max = Math.max(...currentData);
    const min = Math.min(...currentData);
    const range = max - min > 0 ? max - min : 1; // Prevent division by zero

    const points = currentData.map((value, index) => {
      const x = index * (width / (currentData.length - 1));
      const y = height - ((value - min) / range) * height * 0.8 + height * 0.1; // Add 10% padding top and bottom
      return { x, y };
    });

    // Only draw up to the current animation progress
    const visiblePoints = animate
      ? points.slice(0, Math.ceil(points.length * animationProgressRef.current))
      : points;

    if (visiblePoints.length < 2) {
      isDrawingRef.current = false;
      return;
    }

    // Draw the line with improved styling
    ctx.beginPath();
    ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);

    // For fewer data points, use a smoother curve
    if (visiblePoints.length <= 12) {
      // Use bezier curves for smoother lines with fewer points
      for (let i = 0; i < visiblePoints.length - 1; i++) {
        const current = visiblePoints[i];
        const next = visiblePoints[i + 1];

        // Calculate control points for the curve
        const controlPointX1 = current.x + (next.x - current.x) / 3;
        const controlPointX2 = current.x + ((next.x - current.x) * 2) / 3;

        ctx.bezierCurveTo(
          controlPointX1,
          current.y,
          controlPointX2,
          next.y,
          next.x,
          next.y
        );
      }
    } else {
      // For more points, use a simpler line to improve performance
      for (let i = 1; i < visiblePoints.length; i++) {
        ctx.lineTo(visiblePoints[i].x, visiblePoints[i].y);
      }
    }

    // Improved line styling
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Add subtle area fill under the line for better visualization
    if (visiblePoints.length > 0) {
      ctx.lineTo(visiblePoints[visiblePoints.length - 1].x, height);
      ctx.lineTo(visiblePoints[0].x, height);
      ctx.closePath();
      ctx.fillStyle = `${color}15`; // Very transparent fill
      ctx.fill();
    }

    isDrawingRef.current = false;
  }, [width, height, color, animate]);

  // Main animation loop - handles both initial animation and data transitions
  const animationLoop = useCallback(
    (timestamp: number) => {
      // Throttle rendering to 60fps
      if (timestamp - lastRenderTimeRef.current < 16) {
        animationRef.current = requestAnimationFrame(animationLoop);
        return;
      }

      lastRenderTimeRef.current = timestamp;

      // Handle initial animation
      if (animate && animationProgressRef.current < 1) {
        animationProgressRef.current = Math.min(
          animationProgressRef.current + 0.05,
          1
        );
      }

      // Handle data transition
      if (transitionStartTimeRef.current !== null) {
        const elapsed = timestamp - transitionStartTimeRef.current;
        const transitionDurationMs = 1000; // 1 second transition
        const progress = Math.min(elapsed / transitionDurationMs, 1);

        // Interpolate between previous and target data
        if (previousDataRef.current.length === targetDataRef.current.length) {
          currentDataRef.current = previousDataRef.current.map((prev, i) => {
            const target = targetDataRef.current[i];
            return prev + (target - prev) * progress;
          });
        } else {
          // If lengths don't match, just use target data
          currentDataRef.current = [...targetDataRef.current];
        }

        // Transition complete
        if (progress >= 1) {
          transitionStartTimeRef.current = null;
        }
      }

      // Draw the current state
      drawChart();

      // Continue animation if needed
      if (
        (animate && animationProgressRef.current < 1) ||
        transitionStartTimeRef.current !== null
      ) {
        animationRef.current = requestAnimationFrame(animationLoop);
      } else {
        animationRef.current = null;
      }
    },
    [animate, drawChart]
  );

  // Set up the canvas and start animation on mount
  useEffect(() => {
    // Initial draw
    drawChart();

    // Start animation if needed
    if (animate || transitionStartTimeRef.current !== null) {
      animationRef.current = requestAnimationFrame(animationLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawChart, animationLoop, animate]);

  // Handle data changes
  useEffect(() => {
    // Only update if data has actually changed
    if (
      JSON.stringify(data) !== JSON.stringify(previousDataRef.current) &&
      data.length > 0
    ) {
      // Store current data as previous for transition
      previousDataRef.current = [...currentDataRef.current];

      // Set new target data
      targetDataRef.current = [...data];

      // Start transition
      transitionStartTimeRef.current = performance.now();

      // Start animation loop if not already running
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animationLoop);
      }
    }
  }, [data, animationLoop]);

  // Handle color changes
  useEffect(() => {
    drawChart();
  }, [color, drawChart]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        imageRendering: "crisp-edges",
      }}
    />
  );
}
