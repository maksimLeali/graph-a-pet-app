import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { $uw } from "@theme";

interface ImageCanvasProps {
	imageUrl: string;
	onCropChange: (croppedImageUrl: string) => void;
}
export const ImageCanvas: React.FC<ImageCanvasProps> = ({
    imageUrl,
    onCropChange,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [lastPointerPosition, setLastPointerPosition] = useState<{ x: number; y: number } | null>(null);
    const imageRef = useRef<HTMLImageElement>(new Image());
    const [minScale, setMinScale] = useState(1);

    useEffect(() => {
        const img = imageRef.current;
        img.src = imageUrl;
        img.onload = () => {
            const containerWidth = containerRef.current?.clientWidth ?? 300;
            const containerHeight = containerRef.current?.clientHeight ?? 300;

            const tempMinScale = Math.max(
                containerWidth / img.width,
                containerHeight / img.height
            );
            setMinScale(tempMinScale);
            setScale(tempMinScale);

            const initialX = (containerWidth - img.width * tempMinScale) / 2;
            const initialY = (containerHeight - img.height * tempMinScale) / 2;
            setImagePosition({ x: initialX, y: initialY });

            drawImage();
        };
    }, [imageUrl]);

    const drawImage = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageRef.current) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
            imageRef.current,
            imagePosition.x,
            imagePosition.y,
            imageRef.current.width * scale,
            imageRef.current.height * scale
        );

        ctx.restore();
    };

    const handlePointerDown = (event: React.MouseEvent | React.TouchEvent) => {
        const point = getPointerPosition(event);
        if (point) {
            setLastPointerPosition(point);
            setIsDragging(true);
        }
    };

    const handlePointerMove = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !lastPointerPosition) return;

        const point = getPointerPosition(event);
        if (point) {
            const deltaX = point.x - lastPointerPosition.x;
            const deltaY = point.y - lastPointerPosition.y;

            setImagePosition((prevPos) => ({
                x: prevPos.x + deltaX,
                y: prevPos.y + deltaY,
            }));

            setLastPointerPosition(point);
            drawImage();
        }
    };

    const handlePointerUp = () => {
        setIsDragging(false);
        setLastPointerPosition(null);

        const canvas = canvasRef.current;
        if (canvas) {
            const croppedImageUrl = canvas.toDataURL();
            onCropChange(croppedImageUrl);
        }
    };

    const getPointerPosition = (event: React.MouseEvent | React.TouchEvent) => {
        if ("touches" in event && event.touches.length > 0) {
            const touch = event.touches[0];
            return { x: touch.clientX, y: touch.clientY };
        } else if ("clientX" in event) {
            return { x: event.clientX, y: event.clientY };
        }
        return null;
    };

    return (
        <Container ref={containerRef}>
            <canvas
                ref={canvasRef}
                width={containerRef.current?.clientWidth ?? 300}
                height={containerRef.current?.clientHeight ?? 300}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
            />
        </Container>
    );
};


const Container = styled.div`
	width: ${$uw(24)};
	height: ${$uw(24)};
	margin-left: auto;
	margin-right: auto;
	overflow: hidden;
	border-radius: 50%;
	touch-action: none;
	position: relative;
	canvas {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
`;
