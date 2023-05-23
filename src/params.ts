import {useRouter} from "next/router";
import {Dispatch, useEffect, useState} from "react";
import _ from "lodash";
import {mapEntries, mapValues, o2a} from "./objs";
import {Actions, OptActions, useOptSet, useSet} from "./use-set";

export const pathnameRegex = /[^?#]+/u;
export const pathQueryRegex = /[^#]+/u;

export type Param<T, U = Dispatch<T>> = {
    encode: (t: T) => string | undefined
    decode: (v: string | undefined) => T
    push?: boolean
    use?: (init: T) => [ T, U ]
}

export type ParsedParam<T> = [ T, Dispatch<T> ]

export function stringParam(push: boolean = true): Param<string | undefined> {
    return {
        encode: v => v,
        decode: v => v,
        push,
    }
}

export function defStringParam(init: string, push: boolean = true): Param<string> {
    return {
        encode: v => v,
        decode: v => v || init,
        push,
    }
}

export function floatParam(init: number, push: boolean = true): Param<number> {
    return {
        encode: v => v === init ? undefined : v.toString(),
        decode: v => v ? parseFloat(v) : init,
        push,
    }
}

const { entries, fromEntries, keys, } = Object

export function stringsParam(props?: { init?: string[], delimiter?: string }): Param<string[], Actions<string>> {
    const { init = [], delimiter = ' ' } = props || {}
    const encodedInit = init.join(delimiter)
    return {
        encode: values => {
            const enc = values.join(delimiter)
            if (enc === encodedInit) return undefined
            return enc
        },
        decode: s => {
            if (!s && s !== '') {
                return init
            }
            return s.split(delimiter)
        },
        use: useSet,
    }
}

export function optStringsParam(props?: { emptyIsUndefined?: boolean, delimiter?: string }): Param<null | string[], OptActions<string>> {
    const { emptyIsUndefined = false, delimiter = ' ' } = props || {}
    return {
        encode: (values: string[] | null) => {
            if (values === null) {
                return emptyIsUndefined ? '' : undefined
            } else if (values.length == 0) {
                return emptyIsUndefined ? undefined : ''
            } else {
                return values.join(delimiter)
            }
        },
        decode: (s: string | undefined): string[] | null => {
            if (s === undefined) {
                return emptyIsUndefined ? [] : null
            } else if (s === '') {
                return emptyIsUndefined ? null : []
            } else {
                return s.split(delimiter)
            }
        },
        use: useOptSet,
    }
}

export function enumMultiParam<T extends string>(
    init: T[],
    mapper: { [k in T]: string } | [ T, string ][],
    delim?: string,
): Param<T[]> {
    const delimiter: string = delim === undefined ? '_' : delim
    const t2s: { [k in T]: string } = (mapper instanceof Array) ? fromEntries(mapper) as { [k in T]: string } : mapper
    const s2t: { [key: string]: T } = fromEntries(entries(t2s).map(([ k, v, ]) => [ v, k, ]))

    function verify(values: string[]): T[] {
        return Array.from(values).filter(
            (v): v is T => {
                if (v in t2s) {
                    return true
                } else {
                    console.warn(`Invalid value: ${v} not in ${keys(t2s).join(", ")}`)
                    return false
                }
            }
        )
    }

    const encode = (values: T[]) => {
        return verify(values).map(v => t2s[v]).join(delimiter)
    }

    const encodedInit = encode(init)

    return {
        encode: values => {
            const enc = encode(values)
            if (enc === encodedInit) return undefined
            return enc
        },
        decode: s => {
            if (!s && s !== '') {
                return init
            }
            let values = s.split(delimiter).filter(v => {
                if (v in s2t) {
                    return true
                } else {
                    console.warn(`Unrecognized value: ${v} not in ${keys(s2t).join(",")}`)
                    return false
                }
            }).map(v => s2t[v])
            values = verify(values)
            return values
        },
    }
}

export function enumParam<T extends string>(
    init: T,
    mapper: { [k in T]: string } | [ T, string ][]
): Param<T> {
    const t2s: { [k in T]: string } = (mapper instanceof Array) ? fromEntries(mapper) as { [k in T]: string } : mapper
    const s2t: { [key: string]: T } = fromEntries(entries(t2s).map(([ k, v, ]) => [ v, k, ]))
    return {
        encode(t: T): string | undefined {
            if (t == init) return undefined
            return t2s[t];
        },
        decode(v: string | undefined): T {
            if (v === undefined) return init
            if (!(v in s2t)) {
                console.warn(`Invalid enum: ${v} not in ${keys(s2t).join(",")}`)
                return init
            }
            return s2t[v]
        },
    }
}

export const boolParam: Param<boolean> = {
    encode(t: boolean): string | undefined {
        return t ? '' : undefined;
    },
    decode(v: string | undefined): boolean {
        return v !== undefined;
    },
}

export function numberArrayParam(
    defaultValue: number[] = [],
): Param<number[]> {
    const eq = _.isEqual
    return {
        encode(value: number[]): string | undefined {
            if (eq(value, defaultValue)) return undefined
            return value.map(v => v.toString()).join(',')
        },
        decode(value: string | undefined): number[] {
            if (value === undefined) return defaultValue
            if (value === '') return []
            return value.split(',').map(parseInt)
        },
    }
}

export function parseLLs(str: string): number[] {
    const matches = Array.from(str.matchAll(/[ +\-_]/g))
    const lls = [] as number[]
    let prvMatch: RegExpMatchArray | null = null
    let startIdx = 0
    function parseLL(endIdx: number) {
        startIdx = prvMatch ? prvMatch.index || str.length : 0
        let sep = prvMatch ? prvMatch[0] : ''
        if (sep != '-') {
            startIdx += sep.length
        }
        let piece = str.substring(startIdx, endIdx)
        startIdx = endIdx
        const float = parseFloat(piece)
        if (isNaN(float)) {
            throw new Error(`Invalid piece ${piece}, parsing ${str}`)
        }
        lls.push(float)
    }
    matches.forEach((match, idx) => {
        let endIdx = match.index || str.length
        parseLL(endIdx)
        prvMatch = match
    })
    if (startIdx < str.length) {
        parseLL(str.length)
    }
    // console.log("parsed LLs:", str, lls)
    return lls
}

export type LL = { lat: number, lng: number }
export type LLParam = { init: LL, places?: number, push?: boolean }
export function llParam({ init, places, push }: LLParam): Param<LL> {
    return {
        encode: ({ lat, lng }) => {
            if (lat === init.lat && lng === init.lng) return undefined
            const [ l, L ] = places ? [ lat.toFixed(places), lng.toFixed(places) ] : [ lat, lng ]
            return (lng < 0) ? `${l}${L}` : `${l}_${L}`
        },
        decode: v => {
            if (!v) return init
            const lls = parseLLs(v)
            if (lls.length != 2) {
                console.warn(`Unrecognized ll value: ${v}`)
            }
            const [ lat, lng ] = lls
            return { lat, lng }
        },
        push,
    }
}

export type BB = { sw: LL, ne: LL }
export type BBParam = { init: BB, places?: number, push?: boolean }
export function bbParam({ init, places, push }: BBParam): Param<BB> {
    return {
        encode: ({ sw, ne }) => {
            if (sw.lat === init.sw.lat && sw.lng === init.sw.lng && ne.lat == init.ne.lat && ne.lng == init.ne.lng) return undefined
            const sws = places ? [ sw.lat.toFixed(places), sw.lng.toFixed(places) ] : [ sw.lat, sw.lng ]
            const nes = places ? [ ne.lat.toFixed(places), ne.lng.toFixed(places) ] : [ ne.lat, ne.lng ]
            const lls = [ ...sws, ...nes ]
            let str = ''
            lls.forEach((ll, idx) => {
                if (idx > 0) {
                    str += ll > 0 ? ' ' : ''
                }
                str += ll.toString()
            })
            // console.log("encoded", sw, ne, str)
            return str
        },
        decode: v => {
            if (!v) return init
            const lls = parseLLs(v)
            if (lls.length != 4) {
                console.warn(`Unrecognized ll value: ${v}, ${JSON.stringify(lls)}`)
            }
            const [ swLat, swLng, neLat, neLng ] = lls
            return { sw: { lat: swLat, lng: swLng }, ne: { lat: neLat, lng: neLng } }
        },
        push,
    }
}


export function parseQueryParams<Params extends { [k: string]: Param<any, any> }, ParsedParams>({ params }: { params: Params }): ParsedParams {
    const router = useRouter()
    const { isReady, query } = router
    const [ initialized, setInitialized ] = useState(false)
    const path = router.asPath
    const pathSearchStr = path.replace(pathnameRegex, '')
    const pathSearchParams = new URLSearchParams(pathSearchStr)
    const pathQuery = fromEntries(pathSearchParams.entries()) as { [k: string]: string }
    const [ initialQuery, setInitialQuery ] = useState(pathQuery)
    const state = mapEntries(
        params,
        (k, param) => {
            // Using the query string value (`pathQuery[k]`) initializes useState with a value that matches what it's
            // supposed to be (given the URL query params), but it can trigger
            // https://legacy.reactjs.org/docs/error-decoder.html/?invariant=418 ("Hydration failed because the initial
            // UI does not match what was rendered on the server", because the server is generally statically rendered
            // with no query params.
            //
            // We pass `undefined` instead, which lets hydration proceed as normal, but then once `router.isReady`, we
            // go through all the params and set them to the page's initial query-param values. That seems to work in
            // all cases.
            const init = param.decode(undefined)
            const [ val, set ] = (param.use || useState)(init)
            // console.log(`param-${k} init`, val, set)
            return [ k, { val, set, param } ]
        }
    )

    // console.log(`parseQueryParams init: query:`, query, "pathQuery:", pathQuery, "state vals:", mapEntries(state, (k, { val }) => [ k, val ]))

    // Configure browser "back" button
    useEffect(
        () => {
            window.onpopstate = e => {
                const newUrl = e.state.url
                const newSearchStr = newUrl.replace(pathnameRegex, '')
                // console.log("onpopstate:", e, "newUrl:", newUrl, "newSearchStr:", newSearchStr, "oldSearchStr:", pathSearchStr)
                const newSearchObj = fromEntries(new URLSearchParams(newSearchStr).entries())
                Object.entries(params).forEach(([ k, param ]) => {
                    const val = param.decode(newSearchObj[k])
                    const { val: cur, set } = state[k]
                    const eq = _.isEqual(cur, val)
                    // console.log(`param-${k} eq? (back)`, eq, cur, val)
                    if (!eq) {
                        // console.log(`back! setting: ${k}, ${cur} -> ${val} (change: ${!eq})`)
                        if (set instanceof Function) {
                            set(val)
                        } else {
                            set.set(val)
                        }
                    }
                })
            };
        },
        [ path, ]
    );

    // Initial URL query -> state values, once `router.isReady`. This sets `initialized`, which allows subsequent
    // effects to run.
    useEffect(
        () => {
            if (!isReady) return
            // console.log("Setting state to initial query values:", initialQuery)
            entries(initialQuery).forEach(([ k, str ]) => {
                const param = params[k]
                if (!param) {
                    console.warn(`Unrecognized param: ${k}=${str}`)
                    return
                }
                const init = initialQuery[k]
                const newVal = param.decode(init)
                const { val, set } = state[k]
                const eq = _.isEqual(val, newVal)
                // console.log(`param-${k} eq? (init from URL)`, eq, val, newVal)
                if (!eq) {
                    // console.log(`${k}: setting initial query state:`, val, newVal)
                    if (set instanceof Function) {
                        set(newVal)
                    } else {
                        set.set(newVal)
                    }
                }
            })
            setInitialized(true)
        },
        [ isReady ]
    )

    // URL -> state values
    useEffect(
        () => {
            if (!initialized) {
                console.log("Skipping state initialization, !initialized")
                return
            }
            // console.log("updating states: path", path, ", searchStr:", pathSearchStr)
            Object.entries(params).forEach(([ k, param ]) => {
                const qv = query[k]
                const qval: string | undefined = (qv && qv instanceof Array) ? qv[0] : qv
                const val = param.decode(qval)
                const { val: cur, set } = state[k]
                const eq = _.isEqual(cur, val)
                // console.log(`param-${k} eq? (URL)`, eq, cur, val)
                if (!eq) {
                    // console.log(`update state: ${k}, ${cur} -> ${val} (change: ${!eq})`)
                    if (set instanceof Function) {
                        set(val)
                    } else {
                        set.set(val)
                    }
                }
            })
        },
        [ path, initialized ]
    );

    const match = path.match(pathnameRegex);
    const pathname = match ? match[0] : path;

    // State -> URL query values
    const stateQuery: {[k: string]: string} = {}
    Object.entries(state).forEach(([ k, { val, param, } ]) => {
        const s = param.encode(val)
        // console.log(`param-${k} state->URL:`, val, s)
        if (s !== undefined) {
            stateQuery[k] = s
        }
    })

    const search = o2a(stateQuery, (k, v) => v == '' ? k : `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`).join("&")
    // console.log(`path: ${path}, searchStr: ${pathSearchStr}, query: `, query, `, search: ${search}, stateQuery:`, stateQuery)

    useEffect(
        () => {
            if (!initialized) {
                console.log("Skipping url update!! !initialized")
                return
            }
            const hash = ''
            const changedKeys = []
            for (const [key, value] of entries(stateQuery)) {
                if (key in params && (!(key in query) || !_.isEqual(value, stateQuery[key]))) {
                    changedKeys.push(key)
                }
            }
            for (const [key, value] of entries(query)) {
                if (key in params && !changedKeys.includes(key) && (!(key in stateQuery) || !_.isEqual(value, query[key]))) {
                    changedKeys.push(key)
                }
            }
            let push = false
            for (const key of changedKeys) {
                const param = params[key]
                if (param.push) {
                    push = true
                    break
                }
            }
            const url = { pathname: router.pathname, hash, search}
            const as = { pathname, hash, search, }
            const options = { shallow: true, scroll: false, }
            // const method = push ? "push" : "replace"
            console.log(`router.${push ? "push" : "replace"}:`, { pathname: router.pathname, hash, search}, "changedKeys:", changedKeys)
            if (push) {
                router.push(url, as, options)
            } else {
                router.replace(url, as, options)
            }
        },
        [ pathname, router.pathname, search, initialized ]
    )

    return mapValues(state, (k, { val, set, }) => [ val, set, ]) as ParsedParams
}
