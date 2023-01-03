#!/usr/bin/env bash

set -e

direct=
if [ "$1" == "-d" ]; then
    direct=1; shift
fi

if [ $# -eq 1 ]; then
    NEXT_UTILS_HOME="$1"; shift
fi

if [ -z "$NEXT_UTILS_HOME" ]; then
    NEXT_UTILS_HOME=next-utils
    for _ in 1 2 3; do
        if [ -d "$NEXT_UTILS_HOME" ]; then
            break
        fi
        NEXT_UTILS_HOME="../$NEXT_UTILS_HOME"
    done
    if [ -z "$NEXT_UTILS_HOME" ]; then
        echo "Couldn't find a \$NEXT_UTILS_HOME" >&2
        exit 1
    fi
fi

path="$NEXT_UTILS_HOME/dist"
if [ -n "$direct" ]; then
    url="file:$path"
    echo "Setting direct; \"next-utils\": \"$url\""
    cat package.json | jq --indent 4 ".dependencies.\"next-utils\" = \"$url\"" > package.json.new
    mv package.json{.new,}
else
    set -x
    npm install "$path"
fi
