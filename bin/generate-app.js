#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

if (process.argv.length < 3) {
  console.log('You have to provide a name to your app.');
  console.log('For example :');
  console.log('    npx create-project my-app');
  process.exit(1);
}
const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = 'https://github.com/JonnyVaine/app-boilerplate.git';

try {
  fs.mkdirSync(projectPath);
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log(`The project ${projectName} already exists in the current directory, please choose another name.`);
  } else {
    console.log('Oops, an error: ', error);
  }
  process.exit(1);
}

async function main() {
  try {
    console.log('Downloading files...');
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    fs.readFile('./package.json', function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        var json = JSON.parse(data);
        json.name = projectName;
        console.log('"' + json.name + '": "' + json.version + '",');
      }
    });

    console.log('Installing dependencies...');
    execSync('npm install');

    console.log('Removing setup files');
    execSync('npx rimraf ./.git');
    fs.rmSync(path.join(projectPath, 'bin'), { recursive: true});

    console.log('Installation complete, run "npm start" to run your application.');

  } catch (error) {
    console.log(error);
  }
}
main();