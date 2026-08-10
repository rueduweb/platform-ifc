export type CarouselHoverState = {
	readonly isHovered: boolean;
	readonly itemId: string | null;
}

export type CarouselHoverListener = (state: CarouselHoverState) => void;
