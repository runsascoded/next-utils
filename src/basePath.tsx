import getConfig from "next/config";

export function getBasePath() {
    const { publicRuntimeConfig: config } = getConfig()
    const { basePath = "" } = config
    return basePath
}
