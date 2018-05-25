const args = process.argv;

const dev = args.indexOf('dev');
const start = args.indexOf('start');

if(dev) {
  console.log('dev script!');
}
