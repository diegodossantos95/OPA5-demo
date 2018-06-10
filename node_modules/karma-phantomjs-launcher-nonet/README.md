# karma-phantomjs-launcher-nonet

> Launcher for [PhantomJS] - without dependency on [phantomjs npm package].

Original [karma-phantomjs-launcher] depends on the `phantomjs` package. This can be sometimes problematic as `phantomjs` package downloads [PhantomJS] from the third-party website. While this download can be prevented by making sure that you have correct [PhantomJS] version in the `PATH`, this is not always practical.

This package removes `phantomjs` from dependencies and requires you to set the path to [PhantomJS] explicitly.

## Installation

The easiest way is to keep `karma-phantomjs-launcher-nonet` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-phantomjs-launcher-nonet": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-phantomjs-launcher-nonet --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],

    phantomjsLauncher: {
      // configure PhantomJS executable for each platform
      cmd: {
        linux: path.join(__dirname, 'target/phantomjs/linux64/phantomjs'),
        darwin: path.join(__dirname, 'target/phantomjs/darwin/phantomjs'),
        win32: path.join(__dirname, 'target/phantomjs/win/phantomjs.exe')
      }
    }
  });
};
```
----

For more information on Karma see the original [karma-phantomjs-launcher] package or [Karma homepage].


[Karma homepage]: http://karma-runner.github.com
[PhantomJS]: http://phantomjs.org/
[phantomjs npm package]: https://www.npmjs.org/package/phantomjs
[karma-phantomjs-launcher]: https://github.com/karma-runner/karma-phantomjs-launcher