#!/usr/bin/env node

const matter = require('gray-matter')
const mustache = require('mustache')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const fileUrl = require('file-url')
const formatDate = require('date-fns/format')

const args = require('minimist')(process.argv.slice(2))
console.log(args)
let outputPath = args['output']
if (!outputPath) {
  throw new Error('Missing the output path of images.')
}

let templatePath = args['template']
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
    throw new Error('Cannot get the preview HTML.')
  }
}

/**
 * Format the output data
 *
 * @param {Object} data
 */
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
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  let imageWidth = args['width']
  if (!imageWidth) {
    imageWidth = 800
  }
  let imageHeight = args['height']
  if (!imageHeight) {
    imageHeight = 400
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
 * @param {Object} data
 */
const generateImage = (parentDir, data) => {
  let output = getPreviewHTML(data)

  // Create the preview.html based on the data from markdown file.
  let previewHTMLPath = parentDir + '/preview.html'
  fs.writeFile(previewHTMLPath, output, 'utf8', err => {
    if (err) throw err
    generateImageFromHTML(parentDir, fileUrl(previewHTMLPath))
      .then(resp => {
        fs.unlinkSync(previewHTMLPath)
        console.log(`Created: ${parentDir}/preview.png`)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

const findMarkdown = () => {
  let markdownDir = args['path']
  if (!markdownDir) {
    throw new Error('Missing the path of markdown content.')
  }

  markdownDir = path.resolve(markdownDir)
  fs.readdir(markdownDir, (err, files) => {
    if (!files) return
    files.forEach(file => {
      if (/\.md$/.test(file)) {
        let content = getDataFromMarkdown(markdownDir + '/' + file)
        generateImage(markdownDir, content.data)
      } else {
        findMarkdown(markdownDir + '/' + file)
      }
    })
  })
  return;
}

if (args['ignore-md']) {
  generateImage(args['output'], {
    title: args['title'],
    date: args['date'],
    author: args['author']
  })
} else {
  findMarkdown()
}

