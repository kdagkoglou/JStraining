# Node.js debugging

Start Node applications with the `--inspect` switch. This starts a debugging host at the default address of `127.0.0.1:9229`.

An address can be specified, e.g. `node --inspect 0.0.0.0:9229 app.js` allows any client on the network to attach.

Most editors can attach to the process or you can open <chrome://inspect/> in Chrome, then click **Open dedicated DevTools for Node**.

## Trace warnings

The Node `--trace-warnings` switch shows additional information when warnings are encountered. This is especially useful when using Promises which fail.

## VS Code

VS Code has an excellent debugger which stores configuration defaults in the project's `.vscode/launch.json` file. This can be edited by opening the Debug panel and clicking the cog icon.

Multiple configurations can be set - example for running Guardian4 using different parameters:

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "G4 nofollow",
      "runtimeArgs": [
        "--trace-warnings"
      ],
      "program": "${workspaceFolder}\\guardian4.js",
      "cwd": "${workspaceFolder}",
      "args": [
        "--url", "https://www.theguardian.com/",
        "--proxy", "local",
        "--device", "wdc",
        "--verbose", "2",
        "--nofollow"
      ]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "G4 hop",
      "runtimeArgs": [
        "--trace-warnings"
      ],
      "program": "${workspaceFolder}\\guardian4.js",
      "cwd": "${workspaceFolder}",
      "args": [
        "--url", "https://www.autotrader.co.uk/",
        "--proxy", "local",
        "--device", "wdc",
        "--verbose", "2",
        "--hop", "3",
        "--nofollow"
      ]
    }
  ]
}
```

## ndb

ndb is an improved debugging experience developed by the Chrome team at <https://github.com/GoogleChromeLabs/ndb>

This may be the only option which handles forked cluster processes. However, it requires Puppeteer and a separate Chrome installation so dependencies can total 300MB.

## Links

* <https://nodejs.org/en/docs/guides/debugging-getting-started/>
