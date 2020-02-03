// from https://github.com/syonip/svelte-cordova
const os = require('os');
const ipLogic = require('./services/ip-logic.js')

if (!process.env.CORDOVA_PLATFORM) {
  console.log('process.env.CORDOVA_PLATFORM not defined. Not running before-prepare.js hook.')
  return;
}

const fs = require('fs-extra')
const production = process.env.CORDOVA_PROD;
let networkInterfaces = os.networkInterfaces()

function info(msg) {
  console.log(msg)
}

function updateConfigUrl(cordovaConfigPath, url) {
  fs.copyFileSync(cordovaConfigPath, `${cordovaConfigPath}.backup`)
  info(`updating ${cordovaConfigPath} content to ${url}`)

  let cordovaConfig = fs.readFileSync(cordovaConfigPath, 'utf-8')
  const lines = cordovaConfig.split(/\r?\n/g).reverse()

  const contentIndex = lines.findIndex(line => line.match(/\s*<content/))
  let allowNavigationIndex = lines.findIndex(line => line.match(/\s*<allow-navigation/))
  if (contentIndex >= 0) {
    lines[contentIndex] = `    <content src="${url}" />`
  }

  let allowNavigation = `    <allow-navigation href="${url}" />`
  if (allowNavigationIndex >= 0) {
    if (production) {
      lines.splice(allowNavigationIndex, 1)
    } else {
      lines[allowNavigationIndex] = allowNavigation
    }
  } else {
    if (!production) {
      lines.splice(contentIndex, 0, allowNavigation)
    }
  }
  cordovaConfig = lines.reverse().join('\n')
  fs.writeFileSync(cordovaConfigPath, cordovaConfig)
}

function generateIndexHtml(ctx) {
  let htmlContent = fs.readFileSync(`${publicFolder}/index.html`, 'utf-8')
  let lines = htmlContent.split(/\r?\n/g)

  lines.forEach((v, i, a) => {
    // cordova script
    if (v.match('<div class="__cordova_script"></div>')) {
      if (ctx.opts.platforms.includes('ios')) {
        a[i] = `    <script type="text/javascript" src="cdvfile://localhost/bundle/www/cordova.js"></script>`
      } else if (ctx.opts.platforms.includes('android')) {
        a[i] = `    <script type="text/javascript" src="cdvfile://localhost/assets/www/cordova.js"></script>`
      } else {
        a[i] = '    <script type="text/javascript" src="cordova.js"></script>';
      }
    }
  })

  htmlContent = lines.join('\n')
  fs.writeFileSync('www/index.html', htmlContent)
}

function clearWWW() {

  fs.readdirSync('www').forEach(file => {
    if (file == 'README.md') return;
    if (svelteFiles.includes(file)) return;

    console.log(`removing ${file}`)
    fs.removeSync(`www/${file}`)
  })
}

function copyPublicFiles() {

  fs.readdirSync(publicFolder).forEach(file => {
    if (svelteFiles.includes(file)) return;

    console.log(`copying ${file} to src-cordova/www folder`)
    fs.copySync(`${publicFolder}/${file}`, `www/${file}`)
  });
}

const publicFolder = '../public'
const ip = ipLogic.getIP(networkInterfaces);
const url = (production || process.env.CORDOVA_PLATFORM === 'browser')
  ? 'index.html'
  : `http://${ip}:5000`
let svelteFiles = [
  'index.html',
  'bundle.js',
  'bundle.js.map',
  'bundle.css',
  'bundle.css.map'
]

function runHook(ctx) {
  const cordovaConfigPath = 'config.xml'
  if (!url || !cordovaConfigPath) {
    console.error(`url or config path don't exist`)
    return
  }

  updateConfigUrl(cordovaConfigPath, url)

  clearWWW()
  copyPublicFiles()
  generateIndexHtml(ctx)
}

module.exports = runHook
