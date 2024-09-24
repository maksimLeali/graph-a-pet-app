import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { $uw } from "@theme";

interface ImageResizerProps {
	imageUrl: string;
	onCropChange: (croppedImageUrl: string) => void;
}

export const ImageResizer: React.FC<ImageResizerProps> = ({
	imageUrl,
	onCropChange,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);
	const [lastTouchPosition, setLastTouchPosition] = useState<{
        x: number;
		y: number;
	} | null>(null);
	const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
	const imageRef = useRef<HTMLImageElement>(new Image());
	const [minScale, setMinScale] = useState(1);
	const [initialized, setInitialized] = useState(false);
	
    const setup = useCallback(() => {
		const containerWidth = containerRef.current?.clientWidth ?? 300;
		const containerHeight = containerRef.current?.clientHeight ?? 300;
		const img = imageRef.current;

		// Calculate the minimum scale to ensure the image covers the container
		const tempMinScale = Math.max(
			containerWidth / img.width,
			containerHeight / img.height
		);

		setMinScale(tempMinScale);
		setScale(tempMinScale);  // Initialize the scale with the minimum scale

		// Calculate the centered position for the image
		const initialX = (containerWidth - img.width * tempMinScale) / 2;
		const initialY = (containerHeight - img.height * tempMinScale) / 2;
		setImagePosition({ x: initialX, y: initialY });

		setInitialized(true);
	}, [containerRef, imageRef]);

	// Load the image on mount
	useEffect(() => {
		const img = imageRef.current;
		img.src = imageUrl;
		img.onload = () => {
			if (!initialized) setup();
			drawImage();
		};
	}, [imageUrl, scale, imagePosition]);

	const drawImage = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || !imageRef.current) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw the image with current scale and position
		ctx.save();
		ctx.beginPath();
		ctx.arc(
			canvas.width / 2,
			canvas.height / 2,
			canvas.width / 2,
			0,
			Math.PI * 2,
			true
		);
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
	}, [imagePosition, scale]);

	// Handle dragging to move the image
	const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
		event.preventDefault();
		if (isDragging && lastTouchPosition && event.touches.length === 1) {
			const touch = event.touches[0];
			const deltaX = touch.clientX - lastTouchPosition.x;
			const deltaY = touch.clientY - lastTouchPosition.y;

			// Update image position while checking boundaries
			setImagePosition((prevPos) => ({
				x: clamp(
					prevPos.x + deltaX,
					canvasRef.current!.width - imageRef.current.width * scale,
					0
				),
				y: clamp(
					prevPos.y + deltaY,
					canvasRef.current!.height - imageRef.current.height * scale,
					0
				),
			}));

			setLastTouchPosition({ x: touch.clientX, y: touch.clientY });
		} else if (event.touches.length === 2) {
			const distance = getDistance(event.touches);
			if (lastTouchDistance) {
				let deltaScale = distance / lastTouchDistance;
				let newScale = clamp(scale * deltaScale, minScale, 4); // clamp scale between minScale and max zoom level (e.g., 4)

				setScale(newScale);
			}
			setLastTouchDistance(distance);
		}
	};

	const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
		event.preventDefault();
		if (event.touches.length === 1) {
			const touch = event.touches[0];
			setLastTouchPosition({ x: touch.clientX, y: touch.clientY });
			setIsDragging(true);
		} else if (event.touches.length === 2) {
			setLastTouchDistance(getDistance(event.touches));
		}
	};

	const handleTouchEnd = () => {
		setIsDragging(false);
		setLastTouchPosition(null);
		setLastTouchDistance(null);

		// Generate the cropped image URL and call onCropChange
		const canvas = canvasRef.current;
		if (canvas) {
			const croppedImageUrl = canvas.toDataURL();
			onCropChange(croppedImageUrl); // Pass the base64 cropped image string back to the parent component
		}
	};

	// Calculate the distance between two touch points (for zoom)
	const getDistance = (touches: React.TouchList) => {
		const [touch1, touch2] = [touches[0], touches[1]];
		return Math.sqrt(
			Math.pow(touch1.clientX - touch2.clientX, 2) +
				Math.pow(touch1.clientY - touch2.clientY, 2)
		);
	};

	// Clamp a value between a min and max range
	const clamp = (value: number, min: number, max: number) => {
		return Math.max(min, Math.min(value, max));
	};

	return (
		<Container ref={containerRef}>
			<canvas
				ref={canvasRef}
				width={containerRef.current?.clientWidth ?? 300}
				height={containerRef.current?.clientHeight ?? 300}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
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
