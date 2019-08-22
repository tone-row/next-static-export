const fs = require('fs');
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
const { exportPathMap } = require('./next.config');

// Settings
const DATA_DIRECTORY = './data';
const TMP_PAGES = 'TMP_PAGES';

async function createEmptyDir() {
  // Create directory if it doesn't exist
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
  } else {
    // remove files from directory
    fs.readdir(DATA_DIRECTORY, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(DATA_DIRECTORY, file), err => {
          if (err) throw err;
        });
      }
    });
  }
}

function replaceRequirePath(filename, newRequirePath) {
  return new Promise((res, rej) => {
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) {
        rej(err);
      }
      var result = data.replace(
        /(withAPI\([^,]*,[^,]*,)([^\)]*)(\))/gm,
        `$1 '${newRequirePath}'$3`
      );

      fs.writeFile(filename, result, 'utf8', function(err) {
        if (err) rej(err);
        res(true);
      });
    });
  });
}

function copyToPath(fileToCopy, newFilePath) {
  // Create directory if it doesn't exist
  if (fs.existsSync(fileToCopy)) {
    return new Promise((res, rej) => {
      fs.copyFile(fileToCopy, newFilePath, err => {
        if (err) rej(err);
        res(true);
      });
    });
  }
  return false;
}

async function exportData() {
  // prep dorectory
  await createEmptyDir();

  // pages to delete after
  const tmpPages = [];

  //paths
  const exportPaths = await exportPathMap();
  const staticPaths = Object.keys(exportPaths).filter(
    path => 'static' in exportPaths[path]
  );

  for (const path of staticPaths) {
    const { static, page, query } = exportPaths[path];
    const { filename, getInitialProps } = static;

    // If the path doesn't exist temporarily create it by copying the page
    if (path !== `/` && !fs.existsSync(`pages${path}.js`)) {
      const pageToCopy = page === '/' ? 'pages/index.js' : `pages${page}.js`;
      const newPath = `pages${path}.js`;
      const success = await copyToPath(pageToCopy, newPath);
      // add it to tmp pages
      if (success) {
        tmpPages.push(newPath);
        // augment the property passed to withAPI with the filename to be
        await replaceRequirePath(newPath, filename);
      }
    }

    if (process.env.STATIC_EXPORT_DATA) {
      const data = await getInitialProps({ query });
      fs.writeFileSync(
        `${DATA_DIRECTORY}/${filename}.json`,
        JSON.stringify(data)
      );
    }
  }

  // write tmpPages to a file so that export cleanup can delete them
  fs.writeFileSync(
    `${DATA_DIRECTORY}/${TMP_PAGES}.json`,
    JSON.stringify(tmpPages)
  );
}

function deleteFile(filepath) {
  try {
    fs.unlinkSync(filepath);
    //file removed
  } catch (err) {
    console.error(err);
  }
}

async function exportCleanup() {
  if (fs.existsSync(`${DATA_DIRECTORY}/${TMP_PAGES}.json`)) {
    // read tmp pages
    const tmpPages = JSON.parse(
      fs.readFileSync(`${DATA_DIRECTORY}/${TMP_PAGES}.json`, 'utf8')
    );
    // delete tmp pages
    for (const tmpPagePath of tmpPages) {
      deleteFile(tmpPagePath);
    }
    // delete the tmpp pages file
    deleteFile(`${DATA_DIRECTORY}/${TMP_PAGES}.json`);
  } else {
    console.log('No cleanup file');
  }
}


if (process.env.STATIC_EXPORT) {
  exportData();
}

if (process.env.STATIC_CLEANUP) {
  exportCleanup();
}