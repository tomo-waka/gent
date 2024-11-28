# Start developing

1. clone repository
2. run npm install
3. you can test program with following npm scripts.
    ```shell
    npm run start
    ```
4. or directory execute TypeScript source with npx.
    ```shell
    tsx src/cli.ts --template sample/syslog_RFC3164(ISO_Date).template.log --count 5 --out out/out.log --debug 
    ```
5. build.
    ```shell
   npm run build
   ```
6. execute JavaScript.
    ```shell
   node dist/src/cli.js --template sample/syslog_RFC3164(ISO_Date).template.log --count 5 --out out/out.log --debug
   ```