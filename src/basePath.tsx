import getConfig from "next/config";

export function getBasePath() {
    const { publicRuntimeConfig: config } = getConfig()
    if (!config) return ""
    const { basePath = "" } = config
    return basePath
}
