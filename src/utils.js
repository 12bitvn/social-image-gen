const path = require('path')
const args = require('minimist')(process.argv.slice(2))

module.exports = {
  getOutputPath() {
    let outputPath = './'
    if (args['output']) {
      outputPath = args['output']
    }
    return outputPath
  },
  getTemplatePath() {
    let templatePath = path.resolve(__dirname, '../templates/default.html')
    if (args['template']) {
      templatePath = path.resolve(args['template'])
    }
    return templatePath
  },
  getImageType() {
    let imageType = args['type'] || 'png'
    if (!['png', 'jpeg'].includes(imageType)) {
      throw new Error('Image type must be `png` or `jpeg`')
    }
    return imageType
  },
  getImageName(type) {
    let imageName = args['name'] || 'thumbnail'
    imageName += '.' + type
    return imageName
  },
}
