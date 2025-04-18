export type HotkeyHandler = (e: Partial<KeyboardEvent>) => void;
export type HotkeyHandlers = Record<string, HotkeyHandler>;

/**
 * @reference view js keycode here: https://www.toptal.com/developers/keycode
 * @example
 * hotkeyMapper(
 *   {
 *     "alt+1": () => openLinkByCount(2 ** 1),
 *     "alt+2": () => openLinkByCount(2 ** 2),
 *     "alt+3": () => openLinkByCount(2 ** 3),
 *     "shift+alt+1": () => tryCopyLinkByCount(2 ** 1),
 *     "shift+alt+2": () => tryCopyLinkByCount(2 ** 2),
 *     "shift+alt+3": () => tryCopyLinkByCount(2 ** 3),
 *   },
 *   {capture: true}
 * )
 * // or if you want use react
 * export function useHotkeyMapper(...args: Parameters<typeof hotkeyMapper>) {
 *   useEffect(() => {
 *     return hotkeyMapper(...args);
 *   }, [args]);
 * }
 */
export default function hotkeyMapper<
  K extends keyof GlobalEventHandlersEventMap
>(
  mapping: HotkeyHandlers,
  options?: AddEventListenerOptions & { on?: K; target?: EventTarget }
) {
  const handler: HotkeyHandler = (event) => {
    if (!event.key) return; // throw new Error("Invalid KeyboardEvent");
    if (!event.code) return; // throw new Error("Invalid KeyboardEvent");
    const key = event.key?.toLowerCase();
    const code = event.code?.toLowerCase();
    const simp = event.code?.replace(/^(?:Key|Digit|Numpad)/, "").toLowerCase();
    const map = new Proxy(event, {
      get: (target, p: string) =>
        Boolean(
          {
            [`${key}Key`]: true,
            [`${code}Key`]: true,
            [`${simp}Key`]: true,
          }[p] ?? (target as any)[p]
        ),
    }) as unknown as Record<keyof KeyboardEvent, boolean>;
    const mods = "meta+alt+shift+ctrl";
    Object.entries(mapping).map(
      ([hotkey, fn]: readonly [string, HotkeyHandler]) => {
        const conds = `${mods}+${hotkey.toLowerCase()}`
          .replace(/win|cmd|command|search/, "meta")
          .replace(/control/, "ctrl")
          .split("+")
          .map((key) => key.toLowerCase().trim())
          .map((k, i) => [k, i >= 4 === (map as any)[`${k}Key`]]);
        if (!Object.entries(Object.fromEntries(conds)).every(([, ok]) => ok))
          return;
        event.preventDefault?.();
        event.stopPropagation?.();
        return fn(event);
      }
    );
  };

  const target = options?.target ?? globalThis;
  target.addEventListener(options?.on ?? "keydown", handler, options);
  return function unload() {
    if (options?.signal) return; //by pass unload if a signal is defined
    target.removeEventListener(options?.on ?? "keydown", handler, options);
  };
}
export { hotkeyMapper };
export function hotkeyDown(hotkey: string, options?: AddEventListenerOptions) {
  return new Promise<void>((r) =>
    hotkeyMapper(
      { [hotkey]: () => r() },
      { once: true, ...options, on: "keydown" }
    )
  );
}
export function hotkeyUp(hotkey: string, options?: AddEventListenerOptions) {
  return new Promise<void>((r) =>
    hotkeyMapper(
      { [hotkey]: () => r() },
      { once: true, ...options, on: "keyup" }
    )
  );
}
