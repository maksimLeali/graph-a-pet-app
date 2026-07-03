import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
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

  // bitmap size = CSS size (square). Measured, not hard-coded,
  // così coordinate puntatore e disegno coincidono anche su mobile.
  const [size, setSize] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

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

  // Misura il container e allinea la bitmap del canvas alla sua size CSS.
  // Su mobile $uw(24) != 300px: senza questo la bitmap resterebbe 300x300.
  useLayoutEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const s = Math.round(Math.min(el.clientWidth, el.clientHeight));
      if (s > 0) setSize((prev) => (prev === s ? prev : s));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Carica immagine. onload PRIMA di src + fallback img.complete:
  // su mobile il blob può risolversi prima dell'assegnazione del handler.
  useEffect(() => {
    const img = imgRef.current;
    setImgLoaded(false);
    img.onload = () => setImgLoaded(true);
    img.src = imageUrl;
    if (img.complete && img.naturalWidth) setImgLoaded(true);
  }, [imageUrl]);

  // Inizializza scale + posizione una volta noti immagine e size
  useEffect(() => {
    if (!imgLoaded || !size) return;
    const img = imgRef.current;
    const newMin = Math.max(size / img.width, size / img.height);
    setMinScale(newMin);
    setScale(newMin);
    setPosition({
      x: (size - img.width * newMin) / 2,
      y: (size - img.height * newMin) / 2,
    });
  }, [imgLoaded, size]);

  // Funzione di disegno
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imgLoaded) return;

    const { width: cw, height: ch } = canvas;
    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.beginPath();
    ctx.drawImage(
      imgRef.current,
      position.x,
      position.y,
      imgRef.current.width * scale,
      imgRef.current.height * scale
    );
    ctx.restore();
  }, [position, scale, imgLoaded]);

  // Redraw su cambio posizione/scala/size + emissione crop
  // (così il crop iniziale è disponibile anche senza interazione utente)
  useEffect(() => {
    requestAnimationFrame(() => {
      drawImage();
      const canvas = canvasRef.current;
      if (canvas && imgLoaded) onCropChange(canvas.toDataURL());
    });
  }, [drawImage, size, imgLoaded]);

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
    const canvas = canvasRef.current;
    if (canvas && imgLoaded) onCropChange(canvas.toDataURL());
  };

  return (
    <Container ref={containerRef}>
      <canvas
        ref={canvasRef}
        width={size || 300}
        height={size || 300}
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
