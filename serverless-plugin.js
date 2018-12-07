const path = require('path');
const fs = require('fs');

const JSZip = require('JSZip');

class ServerlessPlugin {

  constructor(serverless, options) {

    this.serverless = serverless;

    this.hooks = {
      'after:package:createDeploymentArtifacts': this.run.bind(this),
      // 'after:package:createDeploymentArtifacts': this.clean.bind(this),
    };
  }

  run() {

    const service = this.serverless.service;
    const allFunctions = service.getAllFunctions();

    allFunctions.map(async (name) => {

      const tempFolder = './.tmp';
      const functionObject = service.getFunction(name);
      const artifactPath = path.resolve(tempFolder, 'bootstrap.zip')
      const bootstrapPath = path.resolve(tempFolder, 'bootstrap')


      fs.copyFileSync('./target/x86_64-unknown-linux-musl/release/lambda-rust-real', bootstrapPath);

      const zip = new JSZip();

      zip.file('bootstrap', fs.readFileSync(bootstrapPath))

      const data = await zip.generateAsync({ type: 'nodebuffer' });

      fs.writeFileSync(artifactPath, data);
    // console.log(functionObject)
    //   functionObject.package = {
    //     artifact: './.tmp/bootstrap.zip',
    //     individually: true,
    //     include: [ './.tmp/bootstrap.zip']
    //       // - liblambda.so
    //   }

    });

  }
}

module.exports = ServerlessPlugin;