type BeginsWithOn = `on${string}`;

export type EventFor<
  TElement extends keyof JSX.IntrinsicElements,
  THandler extends Extract<keyof JSX.IntrinsicElements[TElement], BeginsWithOn>,
> = JSX.IntrinsicElements[TElement][THandler] extends
  | ((e: infer TEvent) => any)
  | undefined
  ? TEvent
  : never;
