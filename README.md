# Sketch

Code templates.

## Usage

```sh
# Step 1: download this repository:
git clone git@github.com:sfi0zy/sketch.git
cd sketch

# Step 2: install npm dependencies:
make install

# Step 3: init the sketch (choose one):
make init-css
make init-cssjs
make init-medium
make init-preact
make init-canvas2d
make init-three

# Step 4: run html-validator, stylelint, doiuse and eslint:
make check

# Step 5: delete node_modules/ if you don't need them anymore:
make clean
```

## License

MIT License

Copyright (c) 2023 Ivan Bogachev
