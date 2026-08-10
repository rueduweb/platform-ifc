import { CarouselHoverState } from "./carousel-hover.model";

export type CarouselHoverReceiver = {
  setHoverState(
    state: CarouselHoverState
  ): void;
}
