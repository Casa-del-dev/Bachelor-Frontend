import { useEffect, useRef } from "react";
import "./Network.css";

const Network = ({ condition }: { condition: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let lastTime = performance.now();
    let nodes: Node[] = [];

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const prevWidth = canvas.width;
      const prevHeight = canvas.height;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      if (nodes.length === 0) {
        nodes = generateNodes(50, canvas.width, canvas.height).map((node) => ({
          ...node,
          baseX: node.x,
          baseY: node.y,
          phase: Math.random() * Math.PI * 2,
        }));
      } else {
        const scaleX = canvas.width / prevWidth;
        const scaleY = canvas.height / prevHeight;

        nodes.forEach((node) => {
          node.baseX = node.baseX! * scaleX;
          node.baseY = node.baseY! * scaleY;
        });
      }
    };

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      angle += delta;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#f3d9b0");
      gradient.addColorStop(1, "#c5d9c8");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fluctuatedNodes = nodes.map((node) => ({
        x: node.baseX! + Math.sin(angle * 2 + node.phase!) * 5,
        y: node.baseY! + Math.cos(angle * 2 + node.phase!) * 5,
      }));

      drawLinesBetweenNodes(ctx, fluctuatedNodes, 200);
      drawNodes(ctx, fluctuatedNodes);

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate(performance.now());

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  function generateNodes(count: number, width: number, height: number) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
    }));
  }

  type Node = {
    x: number;
    y: number;
    baseX?: number;
    baseY?: number;
    phase?: number;
  };

  function drawLinesBetweenNodes(
    ctx: CanvasRenderingContext2D,
    nodes: Node[],
    maxDist: number
  ) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawNodes(ctx: CanvasRenderingContext2D, nodes: Node[]) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  return (
    <canvas
      ref={canvasRef}
      className={`team-background ${condition ? "bg-visible" : ""}`}
      style={{
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default Network;
