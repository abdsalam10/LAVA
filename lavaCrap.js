const { spawn } = require('child_process');

const filesToRun = [
  'axelar.js',
  'ethereum.js',
  'near.js',
  'starknet.js'
];

function runFile(file) {
  return new Promise((resolve, reject) => {
    console.log(`Running ${file}...`);
    const process = spawn('node', [file]);

    process.stdout.on('data', (data) => {
      console.log(`${file} output: ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`${file} error: ${data}`);
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`${file} completed successfully.`);
        resolve();
      } else {
        console.error(`${file} exited with code ${code}`);
        reject(new Error(`${file} exited with code ${code}`));
      }
    });
  });
}

//Run all files concurrently
async function runAllFiles() {
  const promises = filesToRun.map(runFile);
  await Promise.all(promises);
}

process.setMaxListeners(20);

// Run all files
runAllFiles()
  .then(() => console.log('All files completed successfully.'))
  .catch((error) => console.error('Error running files:', error));
