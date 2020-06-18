#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PLATFORM=${1:-linux}
echo building ${PLATFORM} platform
cp "${DIR}/../platform/syncthing-${PLATFORM}" "${DIR}/../helpers/syncthing/syncthing"
"${DIR}/../node_modules/.bin/pkg" -t ${PLATFORM} -o "${DIR}/../output/hkubectl-${PLATFORM}" "${DIR}/../" 