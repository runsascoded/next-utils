import getConfig from "next/config";

export function useBasePath() {
    const { publicRuntimeConfig: config } = getConfig()
    const { basePath = "" } = config
    return basePath
}
