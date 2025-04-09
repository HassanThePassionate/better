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
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(animate ? 0 : 1);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    value: number;
  } | null>(null);
  const requestRef = useRef<number | null>(null);
  const previousDataRef = useRef<number[]>(data);
  const pointsRef = useRef<{ x: number; y: number; value: number }[]>([]);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDrawingRef = useRef(false);

  // Calculate points only when data changes
  const calculatePoints = useCallback(() => {
    if (!data.length) return [];

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min > 0 ? max - min : 1; // Prevent division by zero

    return data.map((value, index) => {
      const x = index * (width / (data.length - 1));
      const y = height - ((value - min) / range) * height * 0.9 + height * 0.05; // Add 5% padding top and bottom
      return { x, y, value };
    });
  }, [data, width, height]);

  // Update points when data changes
  useEffect(() => {
    // Only recalculate points if data has actually changed
    if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
      pointsRef.current = calculatePoints();
      previousDataRef.current = [...data];

      // Reset animation if data changes
      if (animate) {
        setAnimationProgress(0);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        requestRef.current = requestAnimationFrame(animateChart);
      }
    }
  }, [data, calculatePoints, animate]);

  // Animation function with smoother transitions
  const animateChart = useCallback(() => {
    if (!animate) {
      setAnimationProgress(1);
      return;
    }

    setAnimationProgress((prev) => {
      const newProgress = Math.min(prev + 0.03, 1); // Slower animation
      if (newProgress < 1) {
        requestRef.current = requestAnimationFrame(animateChart);
      }
      return newProgress;
    });
  }, [animate]);

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
    if (!data.length || pointsRef.current.length === 0) {
      isDrawingRef.current = false;
      return;
    }

    // Draw horizontal grid lines if enabled
    if (showGrid) {
      ctx.strokeStyle = isDarkMode ? gridColor : "#e2e8f0";
      ctx.lineWidth = 0.5;

      const gridLines = Math.min(5, height / 20); // Adjust grid lines based on height
      for (let i = 0; i < gridLines; i++) {
        const y = i * (height / (gridLines - 1));
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
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
    if (isDarkMode) {
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, "rgba(79, 142, 255, 0)");
    } else {
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, "rgba(79, 142, 255, 0)");
    }
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
    ctx.lineWidth = 1.5;
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
      ctx.arc(hoveredPoint.x, hoveredPoint.y, 3, 0, Math.PI * 2);
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

  // Draw chart when needed
  useEffect(() => {
    drawChart();
  }, [drawChart, isDarkMode, animationProgress, hoveredPoint]);

  // Debounced hover handler to prevent flickering
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!showTooltip || !data.length || pointsRef.current.length === 0)
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
            onHover(closestPoint.value, closestPoint.x, closestPoint.y);
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

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        imageRendering: "crisp-edges",
      }}
      onMouseMove={showTooltip ? handleMouseMove : undefined}
      onMouseLeave={showTooltip ? handleMouseLeave : undefined}
    />
  );
}
