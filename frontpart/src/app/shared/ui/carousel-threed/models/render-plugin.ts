export type RenderPlugin = {
  update(deltaTime: number): void;
  dispose(): void;
}
