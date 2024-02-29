/* eslint-disable */

const { withDangerousMod, withPlugins } = require("@expo/config-plugins");
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");
const fs = require("fs");
const path = require("path");

async function readFileAsync(path) {
  return fs.promises.readFile(path, "utf8");
}

async function saveFileAsync(path, content) {
  return fs.promises.writeFile(path, content, "utf8");
}

const withFixedDeploymentTarget = (c) => {
  return withDangerousMod(c, [
    "ios",
    async (config) => {
      const file = path.join(config.modRequest.platformProjectRoot, "Podfile");
      const contents = await readFileAsync(file);
      await saveFileAsync(file, fixDeploymentTarget(contents));
      return config;
    },
  ]);
};

function fixDeploymentTarget(src) {
  return mergeContents({
    tag: `rn-fix-deployment-target`,
    src,
    newSrc: `
   installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
               config.build_settings['SWIFT_VERSION'] = '5.0'
               config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    end
  end
`,
    anchor: /post_install/,
    offset: 1,
    comment: "#",
  }).contents;
}

module.exports = (config) => withPlugins(config, [withFixedDeploymentTarget]);
