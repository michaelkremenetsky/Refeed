const fs = require("fs");
const path = require("path");

// Thanks to https://github.com/mbdev3/rws!

const directoriesToIgnore = ["node_modules", ".git", ".next"];
const acceptedFileExtensions = [".js", ".jsx", ".ts", ".tsx"];
const defaultRootDirectory = "./";

function removeWhiteSpaceFromJSX(jsxString) {
  const regex = /\s+/g;
  return jsxString.replace(regex, " ").trim();
}

function shouldIgnoreDirectory(directoryName) {
  return directoriesToIgnore.includes(directoryName);
}

function processDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isDirectory()) {
          if (!shouldIgnoreDirectory(file)) {
            processDirectory(filePath);
          }
        } else if (acceptedFileExtensions.includes(path.extname(file))) {
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error("Error reading file:", err);
              return;
            }

            const modifiedContent = data.replace(
              /className="(.*?)"/g,
              (match, className) => {
                const compactedClassName = removeWhiteSpaceFromJSX(className);
                return `className="${compactedClassName}"`;
              }
            );

            fs.writeFile(filePath, modifiedContent, "utf8", (err) => {
              if (err) {
                console.error("Error writing file:", err);
              } else {
                console.log(`Modified and saved: ${file}`);
              }
            });
          });
        }
      });
    });
  });
}

const rootDirectory = process.argv[2] || defaultRootDirectory;

processDirectory(rootDirectory);