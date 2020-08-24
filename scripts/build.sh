#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PLATFORM=${1:-linux}
NODE_VER=${2:-node10}
echo building ${PLATFORM} platform for ${NODE_VER}
cp "${DIR}/../platform/syncthing-${PLATFORM}" "${DIR}/../helpers/syncthing/syncthing"
"${DIR}/../node_modules/.bin/pkg" --options no-warnings -t ${NODE_VER}-${PLATFORM} -o "${DIR}/../output/hkubectl-${PLATFORM}" "${DIR}/../" 