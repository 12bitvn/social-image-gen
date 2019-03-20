#!/usr/bin/env node

const matter = require('gray-matter')
const mustache = require('mustache')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const fileUrl = require('file-url')
const formatDate = require('date-fns/format')

const args = require('minimist')(process.argv.slice(2))

let outputPath = args['output']
if (!outputPath) {
  throw new Error('Missing the output path of images.')
}

let templatePath = path.resolve(__dirname, '../templates/default.html')
if (args['template']) {
  templatePath =  path.resolve(args['template'])
}

let imagegType = args['type'] || 'png'
if (!['png', 'jpeg'].includes(imagegType)) {
  throw new Error('Image type must be `png` or `jpeg`')
}

let imageName = args['name'] || 'thumbnail'
imageName += '.' + imagegType

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
    throw error
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
  formatedData.date = data.date && !args['ignore-md'] ? formatDate(data.date, 'DD-MM-YYYY') : data.date
  formatedData.font_size_title = 15 - (((formatedData.title.length ** 0.89) + 85) / 16)
  formatedData.author = data.author || 'unauthored'
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

  await page.setViewport({
    width: imageWidth,
    height: imageHeight
  })

  await page.goto(url, { waitUntil: 'networkidle0' })
  let result = await page.screenshot({
    path: path.resolve(`${dir}/${imageName}`),
    type: imagegType,
    clip: {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight
    }
  })

  await browser.close()

  return result
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
    let result = generateImageFromHTML(parentDir, fileUrl(previewHTMLPath))
    result.then(resp => {
      fs.unlinkSync(previewHTMLPath)
      console.log(`Created: ${parentDir}/${imageName}`)
    }).catch(error => {
      console.log(`Error: ${previewHTMLPath}`)
      console.log(error)
    })
  })
}


if (args['ignore-md']) {
  generateImage(args['output'], {
    title: args['title'],
    date: args['date'],
    author: args['author']
  })
} else {
  if (!args['path']) {
    throw new Error('Missing the path of markdown content.')
  }

  markdownPath = path.resolve(args['path'])
  if (/\.md$/.test(markdownPath)) {
    let content = getDataFromMarkdown(markdownPath)
    generateImage(args['output'], content.data)
  } else {
    let err = `'${markdownPath}' it not a markdown.`
    throw new Error(err)
  }
  return;
}
