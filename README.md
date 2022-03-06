<h3 align="center">Terminal</h3>
This is my personal website, inspired by retro computer terminals. It's primarily just a fun project I've wanted to build for awhile. I hope you enjoy playing around with it!

### Getting started
Assuming you have node and yarn installed, clone the repo and run:
```sh
yarn install
yarn serve
```

### How does it work?

The site is built using Vue 3. Most programs (or "binaries") are simply async JavaScript functions that use "kernel" methods, allowing for rapid development. More advanced programs can be defined as standalone Vue components that run outside of the shell environment.

### Adding additional binaries

All the binaries can be found in the `src/bin` directory. You can create additional `.js` and `.vue` files in there to add extra commands. They'll be automatically picked up by the shell, no need to wire them up anywhere.
