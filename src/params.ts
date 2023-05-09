import {useRouter} from "next/router";
import {Dispatch, useEffect, useState} from "react";
import _ from "lodash";
import {mapEntries, mapValues} from "./objs";

export const pathnameRegex = /[^?#]+/u;
export const pathQueryRegex = /[^#]+/u;

export type Param<T> = {
    encode: (t: T) => string | undefined
    decode: (v: string | undefined) => T
    push?: boolean
    // use?: (init: Set<T>) => [Set<T>, SetSet<T>]
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

export function stringsParam(init: string[], delim?: string): Param<string[]> {
    const delimiter: string = delim === undefined ? '_' : delim

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
    }
}

export function optStringsParam(delim?: string): Param<undefined | string[]> {
    const delimiter: string = delim === undefined ? '_' : delim
    return {
        encode: values => values && values.join(delimiter),
        decode: s => s ? s.split(delimiter) : ((s == '') ? [] : undefined),
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

export type LL = { lat: number, lng: number }

export function llParam({ init, places, push }: { init: LL, places?: number, push?: boolean }): Param<LL> {
    return {
        encode: ({ lat, lng }) =>
            (lat === init.lat && lng === init.lng)
                ? undefined
                : (
                    places
                        ? `${lat.toFixed(places)}_${lng.toFixed(places)}`
                        : `${lat}_${lng}`
                ),
        decode: v => {
            if (!v) return init
            const [ lat, lng ] = v.split("_").map(parseFloat)
            return { lat, lng }
        },
        push,
    }
}

export function parseQueryParams<Params extends { [k: string]: Param<any> }, ParsedParams>({ params }: { params: Params }): ParsedParams {
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
            const [ val, set ] = useState(init)
            return [ k, { val, set, param } ]
        }
    )

    // console.log(`init: query:`, query, "pathQuery:", pathQuery, "state vals:", mapEntries(state, (k, { val }) => [ k, val ]))

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
                    if (!eq) {
                        // console.log(`back! setting: ${k}, ${cur} -> ${val} (change: ${!eq})`)
                        set(val)
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
                if (!_.isEqual(val, newVal)) {
                    // console.log(`${k}: setting initial query state:`, val, newVal)
                    set(newVal)
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
                if (!eq) {
                    // console.log(`update state: ${k}, ${cur} -> ${val} (change: ${!eq})`)
                    set(val)
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
        if (s !== undefined) {
            stateQuery[k] = s
        }
    })
    const search = new URLSearchParams(stateQuery).toString()
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
            // console.log(`router.${method}:`, { pathname: router.pathname, hash, search}, "changedKeys:", changedKeys)
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
