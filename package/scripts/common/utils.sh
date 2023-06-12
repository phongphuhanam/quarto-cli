# DENOFILES is only required at configure.sh, but DENO_DIR is used in many places

if [[ $OSTYPE == 'darwin'* ]]; then
  DENOURL=https://github.com/denoland/deno/releases/download
  FULLARCH=$(uname -sm)
  DENOFILES="deno-x86_64-apple-darwin.zip deno-aarch64-apple-darwin.zip"
  
  if [[ $FULLARCH == "Darwin x86_64" ]]; then
    DENO_DIR=deno-x86_64-apple-darwin
  elif [[ $FULLARCH == "Darwin arm64" ]]; then
    DENO_DIR=deno-aarch64-apple-darwin
  else
    echo "configure script failed: unrecognized architecture " ${FULLARCH}
    exit 1
  fi
else
  
  NIXARCH=$(uname -m)
  if [[ $NIXARCH == "x86_64" ]]; then
    DENOURL=https://github.com/denoland/deno/releases/download
    DENOFILES=deno-x86_64-unknown-linux-gnu.zip
    DENO_DIR=deno-x86_64-unknown-linux-gnu
  elif [[ $NIXARCH == "aarch64" ]]; then
    DENOURL=https://github.com/LukeChannings/deno-arm64/releases/download
    DENOFILES=deno-linux-arm64.zip
    DENO_DIR=deno-aarch64-unknown-linux-gnu
  else
    echo "configure script failed: unrecognized architecture " ${NIXARCH}
    exit 1
  fi
fi
