"use client";

import type React from "react";
import { useEffect, useRef, useState, useCallback } from "react";

interface ChartProps {
  data: number[];
  width: number;
  height: number;
  lineColor?: string;
  fillColor?: string;
  gridColor?: string;
  isDarkMode?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  onHover?: (value: number | null, x: number, y: number) => void;
  onReload?: () => void; // Add reload callback prop
  refreshInterval?: number; // Add refresh interval prop
}

export default function EnhancedChart({
  data,
  width,
  height,
  lineColor = "#4f8eff",
  fillColor = "rgba(79, 142, 255, 0.2)",
  gridColor = "#1a2635",
  isDarkMode = true,
  showGrid = true,
  showTooltip = true,
  animate = true,
  onHover,
  onReload,
  refreshInterval = 20000, // Default to 20 seconds
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(animate ? 0 : 1);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    value: number;
  } | null>(null);
  const requestRef = useRef<number | null>(null);
  const previousDataRef = useRef<number[]>([]);
  const pointsRef = useRef<{ x: number; y: number; value: number }[]>([]);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDrawingRef = useRef(false);
  const animationStartTimeRef = useRef<number | null>(null);

  // Calculate points only when data changes - memoized for performance
  const calculatePoints = useCallback(() => {
    if (!data || !data.length) return [];

    // Ensure we have valid data
    const validData = data.filter(
      (value) => !isNaN(value) && value !== null && value !== undefined
    );
    if (validData.length === 0) return [];

    const max = Math.max(...validData);
    const min = Math.min(...validData);
    const range = max - min > 0 ? max - min : 1; // Prevent division by zero

    // Remove padding to use full chart area
    return validData.map((value, index) => {
      const x = index * (width / (validData.length - 1));
      const y = height - ((value - min) / range) * height;
      return { x, y, value };
    });
  }, [data, width, height]);

  // Draw chart - optimized to prevent flickering
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isDrawingRef.current) return;

    isDrawingRef.current = true;
    const ctx = canvas.getContext("2d", { alpha: false });
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

    // Clear canvas with background color to prevent flickering
    ctx.fillStyle = isDarkMode ? "#0f172a" : "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Skip drawing if no data or points
    if (!data || !data.length || pointsRef.current.length === 0) {
      isDrawingRef.current = false;
      return;
    }

    // Draw grid lines if enabled
    if (showGrid) {
      // Draw horizontal grid lines
      ctx.strokeStyle = isDarkMode ? gridColor : "#e2e8f0";
      ctx.lineWidth = 0.5;

      const horizontalGridLines = Math.min(5, Math.floor(height / 30)); // Adjust grid lines based on height
      for (let i = 0; i <= horizontalGridLines; i++) {
        const y = (i * height) / horizontalGridLines;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw vertical grid lines
      const verticalGridLines = Math.min(6, Math.floor(width / 50)); // Adjust grid lines based on width
      for (let i = 0; i <= verticalGridLines; i++) {
        const x = (i * width) / verticalGridLines;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Only draw up to the current animation progress
    const visiblePoints = animate
      ? pointsRef.current.slice(
          0,
          Math.ceil(pointsRef.current.length * animationProgress)
        )
      : pointsRef.current;

    if (visiblePoints.length < 2) {
      isDrawingRef.current = false;
      return;
    }

    // Draw filled area under the line
    ctx.beginPath();
    ctx.moveTo(visiblePoints[0].x, height); // Start at the bottom left
    visiblePoints.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(visiblePoints[visiblePoints.length - 1].x, height); // End at the bottom right
    ctx.closePath();

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    const fillColorStart = fillColor.replace(/[^,]+(?=\))/, "0.3"); // More opacity at top
    const fillColorEnd = fillColor.replace(/[^,]+(?=\))/, "0.05"); // Less opacity at bottom
    gradient.addColorStop(0, fillColorStart);
    gradient.addColorStop(1, fillColorEnd);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw the line with bezier curves for smoothness
    ctx.beginPath();
    ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);

    // Use bezier curves for smoother lines
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

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2; // Increased line width for better visibility
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Draw hovered point if any
    if (hoveredPoint) {
      // Draw vertical line
      ctx.beginPath();
      ctx.strokeStyle = isDarkMode
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(hoveredPoint.x, 0);
      ctx.lineTo(hoveredPoint.x, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw point
      ctx.beginPath();
      ctx.fillStyle = lineColor;
      ctx.arc(hoveredPoint.x, hoveredPoint.y, 4, 0, Math.PI * 2); // Larger point for better visibility
      ctx.fill();
      ctx.strokeStyle = isDarkMode ? "#fff" : "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    isDrawingRef.current = false;
  }, [
    data,
    width,
    height,
    lineColor,
    fillColor,
    gridColor,
    isDarkMode,
    showGrid,
    animationProgress,
    hoveredPoint,
    animate,
  ]);

  // Update points when data changes
  useEffect(() => {
    // Only recalculate points if data has actually changed and is valid
    if (data && data.length > 0) {
      // Instead of comparing stringified data which can cause unnecessary rerenders,
      // check if the data is significantly different to warrant a recalculation
      let shouldUpdate = false;

      // If lengths are different, definitely update
      if (previousDataRef.current.length !== data.length) {
        shouldUpdate = true;
      } else {
        // Check if data has changed significantly (more than 0.5% difference)
        const significantChanges = data.filter((value, index) => {
          const prevValue = previousDataRef.current[index];
          if (prevValue === undefined) return true;

          // Calculate percent difference
          const diff = Math.abs((value - prevValue) / prevValue);
          return diff > 0.005; // 0.5% threshold
        });

        // If we have significant changes, update
        shouldUpdate = significantChanges.length > 0;
      }

      if (shouldUpdate) {
        const calculatedPoints = calculatePoints();

        // Smoothly transition between old and new points
        if (pointsRef.current.length > 0 && calculatedPoints.length > 0) {
          // Store the new target points but don't immediately replace current points
          // This allows for animation between states
          const currentPoints = [...pointsRef.current];
          const targetPoints = calculatedPoints;

          // Update points with smooth transition
          pointsRef.current = currentPoints.map((point, i) => {
            if (i < targetPoints.length) {
              // Blend between current and target (start with 20% of the way there)
              return {
                x: point.x,
                y: point.y * 0.8 + targetPoints[i].y * 0.2,
                value: point.value * 0.8 + targetPoints[i].value * 0.2,
              };
            }
            return point;
          });
        } else {
          // If no existing points, just set the new ones
          pointsRef.current = calculatedPoints;
        }

        previousDataRef.current = [...data];

        // Trigger a redraw without full animation reset
        drawChart();
      }
    }
  }, [data, calculatePoints, drawChart]);

  // Improve animation smoothness with RAF-based timing
  const animateChart = useCallback(
    (timestamp: number) => {
      if (!animate) {
        setAnimationProgress(1);
        return;
      }

      if (animationStartTimeRef.current === null) {
        animationStartTimeRef.current = timestamp;
      }

      const elapsed = timestamp - (animationStartTimeRef.current || 0);
      const duration = 1000; // Animation duration in ms
      const progress = Math.min(elapsed / duration, 1);

      setAnimationProgress(progress);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animateChart);
      }
    },
    [animate]
  );

  // Start animation
  useEffect(() => {
    if (animate && animationProgress < 1) {
      requestRef.current = requestAnimationFrame(animateChart);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, animateChart, animationProgress]);

  // Draw chart when needed
  useEffect(() => {
    drawChart();
  }, [drawChart, isDarkMode, animationProgress, hoveredPoint]);

  // Debounced hover handler to prevent flickering
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (
        !showTooltip ||
        !data ||
        !data.length ||
        pointsRef.current.length === 0
      )
        return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Debounce the hover calculation
      hoverTimeoutRef.current = setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * width;

        // Find closest point with a buffer to prevent jumpy behavior
        let closestPoint = pointsRef.current[0];
        let closestDistance = Math.abs(closestPoint.x - x);
        const hoverBuffer = 5; // Buffer in pixels to prevent jumpy behavior

        for (let i = 1; i < pointsRef.current.length; i++) {
          const distance = Math.abs(pointsRef.current[i].x - x);
          if (distance < closestDistance) {
            closestPoint = pointsRef.current[i];
            closestDistance = distance;
          }
        }

        // Only update if the point is significantly different or if there was no previous point
        if (
          !hoveredPoint ||
          Math.abs(hoveredPoint.x - closestPoint.x) > hoverBuffer ||
          Math.abs(hoveredPoint.value - closestPoint.value) > 0.1
        ) {
          setHoveredPoint(closestPoint);
          if (onHover) {
            // Format the value to a reasonable number of decimal places
            const formattedValue =
              closestPoint.value > 1
                ? Math.round(closestPoint.value * 100) / 100 // 2 decimal places for values > 1
                : closestPoint.value; // Keep full precision for small values
            onHover(formattedValue, closestPoint.x, closestPoint.y);
          }
        }
      }, 10); // Small delay to smooth out hover
    },
    [data, width, hoveredPoint, onHover, showTooltip]
  );

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredPoint(null);
    if (onHover) {
      onHover(null, 0, 0);
    }
  }, [onHover]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Add auto-refresh functionality
  useEffect(() => {
    if (!onReload) return;

    const intervalId = setInterval(() => {
      if (onReload) onReload();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [onReload, refreshInterval]);

  // Add a new useEffect for smooth data transitions
  useEffect(() => {
    if (!data || data.length === 0 || pointsRef.current.length === 0) return;

    // Create a smooth transition animation
    let animationFrame: number;
    let progress = 0;

    const animateTransition = () => {
      progress += 0.05; // Increment by 5% each frame

      if (progress >= 1) {
        // Animation complete, set final values
        const calculatedPoints = calculatePoints();
        pointsRef.current = calculatedPoints;
        drawChart();
        return;
      }

      // Calculate intermediate points
      const calculatedPoints = calculatePoints();
      if (calculatedPoints.length > 0 && pointsRef.current.length > 0) {
        pointsRef.current = pointsRef.current.map((point, i) => {
          if (i < calculatedPoints.length) {
            // Smooth transition using easing function
            const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
            return {
              x: point.x,
              y: point.y * (1 - ease) + calculatedPoints[i].y * ease,
              value:
                point.value * (1 - ease) + calculatedPoints[i].value * ease,
            };
          }
          return point;
        });

        // Redraw with updated points
        drawChart();

        // Continue animation
        animationFrame = requestAnimationFrame(animateTransition);
      }
    };

    // Start animation
    animationFrame = requestAnimationFrame(animateTransition);

    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [data, calculatePoints, drawChart]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        imageRendering: "crisp-edges",
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "fill",
      }}
      onMouseMove={showTooltip ? handleMouseMove : undefined}
      onMouseLeave={showTooltip ? handleMouseLeave : undefined}
    />
  );
}
