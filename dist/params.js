import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import _ from "lodash";
export const pathnameRegex = /[^?#]+/u;
export function stringParam(push = true) {
    return {
        encode: v => v,
        decode: v => v,
        push,
    };
}
export function defStringParam(init, push = true) {
    return {
        encode: v => v,
        decode: v => v || init,
        push,
    };
}
export function floatParam(init, push = true) {
    return {
        encode: v => v === init ? undefined : v.toString(),
        decode: v => v ? parseFloat(v) : init,
        push,
    };
}
const { entries, fromEntries, keys, } = Object;
export function enumMultiParam(init, mapper, delim) {
    const delimiter = delim === undefined ? '_' : delim;
    const t2s = (mapper instanceof Array) ? fromEntries(mapper) : mapper;
    const s2t = fromEntries(entries(t2s).map(([k, v,]) => [v, k,]));
    function verify(values) {
        return Array.from(values).filter((v) => {
            if (v in t2s) {
                return true;
            }
            else {
                console.warn(`Invalid value: ${v} not in ${keys(t2s).join(", ")}`);
                return false;
            }
        });
    }
    const encode = (values) => {
        return verify(values).map(v => t2s[v]).join(delimiter);
    };
    const encodedInit = encode(init);
    return {
        encode: values => {
            const enc = encode(values);
            if (enc === encodedInit)
                return undefined;
            return enc;
        },
        decode: s => {
            if (!s && s !== '') {
                return init;
            }
            let values = s.split(delimiter).filter(v => {
                if (v in s2t) {
                    return true;
                }
                else {
                    console.warn(`Unrecognized value: ${v} not in ${keys(s2t).join(",")}`);
                    return false;
                }
            }).map(v => s2t[v]);
            values = verify(values);
            return values;
        },
    };
}
export function enumParam(init, mapper) {
    const t2s = (mapper instanceof Array) ? fromEntries(mapper) : mapper;
    const s2t = fromEntries(entries(t2s).map(([k, v,]) => [v, k,]));
    return {
        encode(t) {
            if (t == init)
                return undefined;
            return t2s[t];
        },
        decode(v) {
            if (v === undefined)
                return init;
            if (!(v in s2t)) {
                console.warn(`Invalid enum: ${v} not in ${keys(s2t).join(",")}`);
                return init;
            }
            return s2t[v];
        },
    };
}
export const boolParam = {
    encode(t) {
        return t ? '' : undefined;
    },
    decode(v) {
        return v !== undefined;
    },
};
export function numberArrayParam(defaultValue = []) {
    const eq = _.isEqual;
    return {
        encode(value) {
            if (eq(value, defaultValue))
                return undefined;
            return value.map(v => v.toString()).join(',');
        },
        decode(value) {
            if (value === undefined)
                return defaultValue;
            if (value === '')
                return [];
            return value.split(',').map(parseInt);
        },
    };
}
export function llParam({ init, places, push }) {
    return {
        encode: ({ lat, lng }) => (lat === init.lat && lng === init.lng)
            ? undefined
            : (places
                ? `${lat.toFixed(places)}_${lng.toFixed(places)}`
                : `${lat}_${lng}`),
        decode: v => {
            if (!v)
                return init;
            const [lat, lng] = v.split("_").map(parseFloat);
            return { lat, lng };
        },
        push,
    };
}
export function parseQueryParams({ params }) {
    const router = useRouter();
    const { isReady } = router;
    const path = router.asPath;
    const searchStr = path.replace(pathnameRegex, '');
    const searchObj = Object.fromEntries(new URLSearchParams(searchStr).entries());
    const state = Object.fromEntries(Object.entries(params).map(([k, param]) => {
        const [val, set] = useState(param.decode(searchObj[k]));
        return [k, { val, set, param }];
    }));
    useEffect(() => {
        window.onpopstate = e => {
            const newUrl = e.state.url;
            const newSearchStr = newUrl.replace(pathnameRegex, '');
            console.log("onpopstate:", e, "newUrl:", newUrl, "newSearchStr:", newSearchStr, "oldSearchStr:", searchStr);
            const newSearchObj = Object.fromEntries(new URLSearchParams(newSearchStr).entries());
            Object.entries(params).forEach(([k, param]) => {
                const val = param.decode(newSearchObj[k]);
                const { val: cur, set } = state[k];
                const eq = _.isEqual(cur, val);
                if (!eq) {
                    console.log(`back! setting: ${k}, ${cur} -> ${val} (change: ${!eq})`);
                    set(val);
                }
            });
        };
    }, [path,]);
    useEffect(() => {
        if (!isReady) {
            console.log("Skipping state initialization, router !isReady");
            return;
        }
        console.log("updating states: path", path, ", searchStr:", searchStr);
        //const newSearchObj = Object.fromEntries(new URLSearchParams(searchStr).entries())
        Object.entries(params).forEach(([k, param]) => {
            const val = param.decode(searchObj[k]);
            const { val: cur, set } = state[k];
            const eq = _.isEqual(cur, val);
            if (!eq) {
                console.log(`update state: ${k}, ${cur} -> ${val} (change: ${!eq})`);
                set(val);
            }
        });
    }, [path, isReady]);
    const match = path.match(pathnameRegex);
    const pathname = match ? match[0] : path;
    const query = {};
    Object.entries(state).map(([k, { val, param, }]) => {
        const s = param.encode(val);
        if (s !== undefined) {
            query[k] = s;
        }
    });
    const search = new URLSearchParams(query).toString();
    console.log(`path: ${path}, searchStr: ${searchStr}, searchObj: `, searchObj, `, search: ${search}, query:`, query);
    useEffect(() => {
        const hash = '';
        const changedKeys = [];
        for (const [key, value] of entries(searchObj)) {
            if (!(key in query) || !_.isEqual(value, query[key])) {
                changedKeys.push(key);
            }
        }
        for (const [key, value] of entries(query)) {
            if (!changedKeys.includes(key) && (!(key in searchObj) || !_.isEqual(value, searchObj[key]))) {
                changedKeys.push(key);
            }
        }
        let push = false;
        for (const key of changedKeys) {
            const param = params[key];
            if (param.push) {
                push = true;
                break;
            }
        }
        const url = { pathname: router.pathname, hash, search };
        const as = { pathname, hash, search, };
        const options = { shallow: true, scroll: false, };
        const method = push ? "push" : "replace";
        console.log(`router.${method}:`, { pathname: router.pathname, hash, search }, "changedKeys:", changedKeys);
        if (push) {
            router.push(url, as, options);
        }
        else {
            router.replace(url, as, options);
        }
    }, [pathname, router.pathname, search,]);
    return fromEntries(entries(state)
        .map(([k, { val, set, }]) => [k, [val, set,]]));
}
