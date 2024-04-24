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
	onLoad?: ()=> void
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
	const ref = useRef<HTMLDivElement>(null);
	const { webpSupported } = useAppContext();
	
	useEffect(() => {
		console.log(id)
		const baseUrl = `${config.baseUrl?.replace("graphql", "media")}/${id}`;
		console.log(baseUrl)
		const parameters = [...(webpSupported ? ["format=webp"] : [])];
		const width = ref.current?.offsetWidth ?? 0;
		const height = ref.current?.offsetHeight ?? 0;
		console.log(width, height)
        if(width==0 && height == 0) return;
		const srcTemp = `${baseUrl}/${width}x${height}${fit ? "/fit" : ""}${
			parameters.length > 0 ? "?" + parameters.join("&") : ""
		}`;
		console.log(srcTemp);
		setSrc(srcTemp);
		setSrc2x(
			`${baseUrl}/${width * 2}x${height* 2}${fit ? "/fit" : ""}${
				parameters.length > 0 ? "?" + parameters.join("&") : ""
			}`
		);
	}, [ref.current?.offsetHeight, ref.current?.offsetWidth, id]);
	return (
		<ImageContainer className={`img2x ${className}`} ref={ref} rounded={rounded}>
			{src &&
				ref.current &&
				(ref.current.offsetHeight > 0 || ref.current.offsetWidth > 0) &&
				src2x && (
					<img
						src={src}
						alt={alt ?? `${id}`}
						srcSet={`${src2x} 2x`}
						loading={lazy ? "lazy" : "eager"}
						onLoad={()=>onLoad && onLoad()}
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
