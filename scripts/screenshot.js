/**
 * This script used to generate svg via json file.
 */

const fs = require('fs');
const path = require('path');
const { render } = require('svg-term');

function cut(origin, start, end) {
  const head = origin.slice(0, start + 1);
  let foot = origin.slice(end);
  const timeStart = JSON.parse(head[start])[0];
  const timeEnd = JSON.parse(foot[0])[0];
  const cap = timeEnd - timeStart - 1;

  foot = foot.map(f => {
    if (f) {
      const parsed = f && JSON.parse(f);
      parsed[0] -= cap;

      return JSON.stringify(parsed);
    }
    return f;
  });
  return head.concat(foot);
}


fs.readFile(path.resolve(__dirname, '..', 'screenshot.json'), 'utf8', (err, data) => {
  if (err) throw err;
  console.log('\nRendering to svg file...\n');
  const verbose = data.split('\n');
  const start = verbose.findIndex(v => /Installing packages, This might take a couple of minutes.../.test(v));
  const end = verbose.findIndex(v => /added \w+ packages in .+s/.test(v));

  const afterCut = cut(verbose, start, end);

  const svg = render(afterCut.join('\n'), {
    window: true
  });
  fs.writeFile(path.resolve(__dirname, '..', 'screenshot.svg'), svg, (e) => {
    if (e) throw e;
    console.log('Generate svg scuccess!');
  });
});
