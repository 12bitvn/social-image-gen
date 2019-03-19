const matter = require('gray-matter')
const mustache = require('mustache')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const fileUrl = require('file-url')
const formatDate = require('date-fns/format')

require('dotenv').config()

let markdownPath = process.env.MARKDOWN_PATH
if (!markdownPath) {
  throw new Error('Please provide `process.env.MARKDOWN_PATH')
}
let templatePath = process.env.TEMPLATE_PATH
if (!templatePath) {
  templatePath = 'templates/default.html'
}

/**
 * Get content from markdonw file
 *
 * @param {String} path
 */
const getDataFromMarkdown = markdownFile => {
  return matter(fs.readFileSync(markdownFile))
}

/**
 * Get preview html from the given data
 *
 * @param {Object} data
 */
const getPreviewHTML = data => {
  try {
    let html = fs.readFileSync(templatePath, 'utf-8')
    let output = mustache.render(html, formatPreviewData(data))
    return output
  } catch (error) {
    throw new Error('Cannot get the HTML of preview.')
  }
}

const formatPreviewData = data => {
  let formatedData = data
  formatedData.title = data.title || 'untitled'
  formatedData.font_size_title = 15 - (((formatedData.title.length ** 0.89) + 85) / 16)
  formatedData.date = data.date ? formatDate(data.date, 'DD-MM-YYYY') : 'DD/MM/YYYY'
  return formatedData
}

/**
 * Using puppeteer to take a screenshot via the url in local
 * `url` takes the format like `file://`
 *
 * @param {String} dir
 * @param {String} url
 */
const generateImageFromHTML = async (dir, url) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  let imageWidth = process.env.IMAGE_WIDTH
  if (!imageWidth) {
    imageWidth = 400
  }
  let imageHeight = process.env.IMAGE_HEIGHT
  if (!imageHeight) {
    imageHeight = 800
  }

  imageWidth = parseInt(imageWidth)
  imageHeight = parseInt(imageHeight)
  page.setViewport({
    width: imageWidth,
    height: imageHeight
  })

  await page.goto(url)
  return page.screenshot({
    path: path.resolve(`${dir}/preview.png`),
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight
    }
  })
}

/**
 * Generate image
 * if the `file` is markdown format, we will proceed the image generation
 * if the `file` isn't markdown format, maybe it's a directory. We will try to recursive lookup through that directory to find the markdown.
 *
 * @param {String} parentDir
 * @param {String} file
 */
const generateImage = (parentDir, file) => {
  let content = getDataFromMarkdown(parentDir + '/' + file)
  let output = getPreviewHTML(content.data)

  // Create the preview.html based on the data from markdown file.
  let previewHTMLPath = parentDir + '/preview.html'
  fs.writeFile(previewHTMLPath, output, 'utf8', err => {
    if (err) throw err
    generateImageFromHTML(parentDir, fileUrl(previewHTMLPath))
      .then(resp => {
        //fs.unlinkSync(previewHTMLPath)
        console.log(`Created: ${parentDir}/preview.png`)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

const findMarkdown = markdownDir => {
  markdownDir = path.resolve(markdownDir)
  fs.readdir(markdownDir, (err, files) => {
    if (!files) return
    files.forEach(file => {
      if (/\.md$/.test(file)) {
        generateImage(markdownDir, file)
      } else {
        findMarkdown(markdownDir + '/' + file)
      }
    })
  })
}

findMarkdown(markdownPath)
