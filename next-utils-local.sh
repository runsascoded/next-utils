#!/usr/bin/env bash

set -e

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

set -x
npm install "$NEXT_UTILS_HOME/dist"
