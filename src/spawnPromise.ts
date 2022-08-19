import * as cp from 'child_process';
export default async function spawnPromise(
  command: string,
  args?: readonly string[],
  options?: cp.SpawnOptionsWithoutStdio
) {
  const raw = await new Promise((resolve, reject) => {
    const childProcess = cp.spawn(command, args, options);

    setTimeout(function () {
      childProcess.kill();
      reject('Execution timeout.');
    }, options.timeout);

    let stdout = '',
      stderr = '';

    childProcess.stdout.on('data', function (data) {
      stdout += data?.toString();
    });

    childProcess.stderr.on('data', function (data) {
      stderr += data?.toString();
      console.log('stderr', data?.toString());
    });

    childProcess.on('exit', function (code) {
      console.log('child process exited with code ' + code?.toString());
      if (code == undefined) {
        reject('Execution timeout.');
      } else if (code === 0) {
        resolve(stdout);
      } else if (stderr) {
        reject(stderr);
      } else {
        reject(stdout);
      }
    });
  });
  return raw;
}
