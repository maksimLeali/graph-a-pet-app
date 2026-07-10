import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { config } from "../config";
import { useAppContext } from "../contexts";

type props = {
    id: string;
    alt?: string;
    fit?: boolean;
    rounded?: boolean;
    className?: string;
    lazy?: boolean;
    onLoad?: () => void;
};

export const Image2x: React.FC<props> = ({
    id,
    alt,
    fit = false,
    rounded = false,
    className,
    onLoad,
    lazy,
}) => {
    const [src, setSrc] = useState<string>();
    const [src2x, setSrc2x] = useState<string>();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const ref = useRef<HTMLDivElement>(null);
    const { webpSupported } = useAppContext();

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        // quantizza a step di 8px: assorbe il jitter di sub-pixel del layout
        // (es. scrollbar/dvh dentro modali) che altrimenti rigenera src ad ogni resize
        // e fa oscillare all'infinito l'altezza del contenitore
        const STEP = 8;
        const updateSize = () => {
            const { offsetWidth, offsetHeight } = element;
            const width = Math.ceil(offsetWidth / STEP) * STEP;
            const height = Math.ceil(offsetHeight / STEP) * STEP;
            setDimensions((prev) =>
                prev.width === width && prev.height === height
                    ? prev
                    : { width, height },
            );
        };

        updateSize();

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(() => updateSize());
            observer.observe(element);
            return () => observer.disconnect();
        }

        if (typeof window !== "undefined") {
            window.addEventListener("resize", updateSize);
            return () => window.removeEventListener("resize", updateSize);
        }

        return;
    }, [ref]);

    useEffect(() => {
        const baseUrl = `${config.baseUrl?.replace("graphql", "media")}/${id}`;
        const parameters = [...(webpSupported ? ["format=webp"] : [])];
        const { width, height } = dimensions;
        if (width === 0 || height === 0) {
            return;
        }
        const srcTemp = `${baseUrl}/${width}x${height}${fit ? "/fit" : ""}${
            parameters.length > 0 ? "?" + parameters.join("&") : ""
        }`;
        setSrc(srcTemp);
        setSrc2x(
            `${baseUrl}/${width * 2}x${height * 2}${fit ? "/fit" : ""}${
                parameters.length > 0 ? "?" + parameters.join("&") : ""
            }`,
        );
    }, [dimensions.height, dimensions.width, fit, id, webpSupported]);
    return (
        <ImageContainer
            className={`img2x ${className ?? ""}`.trim()}
            ref={ref}
            rounded={rounded}
        >
            {src && src2x && dimensions.width > 0 && dimensions.height > 0 && (
                <img
                    src={src}
                    alt={alt ?? `${id}`}
                    srcSet={`${src2x} 2x`}
                    loading={lazy ? "lazy" : "eager"}
                    onLoad={() => onLoad && onLoad()}
                />
            )}
        </ImageContainer>
    );
};

const ImageContainer = styled.div<{ rounded: boolean }>`
    ${({ rounded }) => rounded && `border-radius: 999px; overflow: hidden;`}
    width:100%;
    height: 100%;
    > img {
        width: 100%;
        height: 100%;
    }
`;
