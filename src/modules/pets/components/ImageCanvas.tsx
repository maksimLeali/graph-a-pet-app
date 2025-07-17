import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { $uw } from "@theme";

interface ImageCanvasProps {
  imageUrl: string;
  onCropChange: (croppedImageUrl: string) => void;
  maxScale?: number;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({
  imageUrl,
  onCropChange,
  maxScale = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(new Image());

  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);

  // Pinch-to-zoom state
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null);
  const [pinchStartScale, setPinchStartScale] = useState<number>(1);
  const [pinchCenter, setPinchCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Carica immagine e inizializza scale + posizione
  useEffect(() => {
    const img = imgRef.current;
    img.src = imageUrl;
    img.onload = () => {
      const cw = containerRef.current!.clientWidth;
      const ch = containerRef.current!.clientHeight;
      const newMin = Math.max(cw / img.width, ch / img.height);
      setMinScale(newMin);
      setScale(newMin);
      setPosition({
        x: (cw - img.width * newMin) / 2,
        y: (ch - img.height * newMin) / 2,
      });
    };
  }, [imageUrl]);

  // Funzione di disegno
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width: cw, height: ch } = canvas;
    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, cw / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      imgRef.current,
      position.x,
      position.y,
      imgRef.current.width * scale,
      imgRef.current.height * scale
    );
    ctx.restore();
  }, [position, scale]);

  // Redraw su cambio posizione o scala
  useEffect(() => {
    requestAnimationFrame(drawImage);
  }, [drawImage]);

  // Calcola coordinate interne al canvas
  const toCanvasCoords = (x: number, y: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  };

  // Drag handlers
  const startDrag = (x: number, y: number) => {
    setLastPos({ x, y });
    setIsDragging(true);
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e && e.touches.length === 2) {
      // @ts-ignore
      const [t1, t2] = e.touches;
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const dist = Math.hypot(dx, dy);
      setPinchStartDist(dist);
      setPinchStartScale(scale);
      const center = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
      setPinchCenter(toCanvasCoords(center.x, center.y));
    } else {
      const p =
        "touches" in e
          ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
          : {
              x: (e as React.MouseEvent).clientX,
              y: (e as React.MouseEvent).clientY,
            };
      startDrag(p.x, p.y);
    }
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    // Pinch-to-zoom
    if (
      "touches" in e &&
      e.touches.length === 2 &&
      pinchStartDist &&
      pinchCenter
    ) {
      // @ts-ignore
      const [t1, t2] = e.touches;
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const dist = Math.hypot(dx, dy);
      let newScale = (pinchStartScale * dist) / pinchStartDist;
      newScale = Math.max(minScale, Math.min(newScale, maxScale));
      const factor = newScale / scale;
      setPosition((pos) => ({
        x: pinchCenter.x - (pinchCenter.x - pos.x) * factor,
        y: pinchCenter.y - (pinchCenter.y - pos.y) * factor,
      }));
      setScale(newScale);
      return;
    }

    // Drag
    if (!isDragging || !lastPos) return;
    const p =
      "touches" in e
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : {
            x: (e as React.MouseEvent).clientX,
            y: (e as React.MouseEvent).clientY,
          };
    const dx2 = p.x - lastPos.x;
    const dy2 = p.y - lastPos.y;
    setPosition((pos) => ({ x: pos.x + dx2, y: pos.y + dy2 }));
    setLastPos(p);
  };

  const onPointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e && e.touches.length > 1) return;
    setIsDragging(false);
    setLastPos(null);
    setPinchStartDist(null);

    // Emissione del crop
    const dataUrl = canvasRef.current!.toDataURL();
    onCropChange(dataUrl);
  };

  return (
    <Container ref={containerRef}>
      <canvas
        ref={canvasRef}
        width={containerRef.current?.clientWidth ?? 300}
        height={containerRef.current?.clientHeight ?? 300}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      />
    </Container>
  );
};

const Container = styled.div`
  width: ${$uw(24)};
  height: ${$uw(24)};
  margin: 0 auto;
  overflow: hidden;
  border-radius: 50%;
  position: relative;
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`;
