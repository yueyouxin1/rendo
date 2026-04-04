export function getProviderDescriptor(mode: string) {
  return {
    mode,
    kind: mode === "managed" ? "managed-adapter" : "local-adapter",
  };
}
