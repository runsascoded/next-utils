#!/usr/bin/env bash

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

pushd $NEXT_UTILS_HOME
sha="$(git log -1 --format=%h)"
popd

url="https://gitpkg.now.sh/runsascoded/next-utils/dist?$sha"
echo "Setting \"next-utils\": \"$url\""
cat package.json | jq --indent 4 ".dependencies.\"next-utils\" = \"$url\"" > package.json.new && mv package.json{.new,}
