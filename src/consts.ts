export const DEFAULT_TEMPLATE_WEIGHT = 1;
export const TemplateModes = ["text", "json"] as const;
export const NetworkOutputTypes = ["udp", "tcp"] as const;
export const OutputTypes = ["file", ...NetworkOutputTypes] as const;
