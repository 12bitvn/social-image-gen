# social-image-gen

[![Greenkeeper badge](https://badges.greenkeeper.io/12bitvn/social-image-gen.svg)](https://greenkeeper.io/)

We got inspired by the social image from [dev.to](https://dev.to) so we decided to create the own one for our blog [12bit.vn](https://12bit.vn). However, you can use it to generate images for your site as well.

![npm](https://img.shields.io/npm/v/social-image-gen.svg)
![npm](https://img.shields.io/npm/dw/social-image-gen.svg)

## Installation

```
npm i -g social-image-gen
# or
yarn global add social-image-gen
```

## Usage

```
social-image-gen [args]
```

### Available arguments

| Argument | Required  | Default|Description|
|----------|----------|-----|------|
| `--path` |**required**| |The path to the markdown file. It's MUST HAVE if there is no `--ignore-md` provided. Eg: `./posts/post-slug/index.md` |
| `--output` |**required**| |The path that stores the generated image. Eg: `./public/post-slug`   | 
| `--ignore-md` |optional| |In case that you don't want to generate image from markdown content, you can use this argument which goes together with `--title`, `--author`, `--date` |
|`--width`|optional|800|The image width.|
|`--height`|optional|400| The image height.|
|`--name`|optional|"thumbnail"|The name of image.|
|`--type`|optional|`png`|The type of image. It's must be 'png' or 'jpeg'|
|`--title`|optional|"untitled"| The title in the image. If you use `--ignore-md`, this arg will available. Eg: `--title="Hello World"`|
|`--date`|optional|| The date in the image. If you use `--ignore-md`, this arg will available. Eg: `--date="20 Mar 2019"`|
|`--author`|optional|"unauthored"| The author in the image. If you use `--ignore-md`, this arg will available. Eg: `--author="12bit.vn"`|
|`--template`|optional|`templates/default.html`|The mockup template is used to generate image. You can check `./templates/default.html` to see how to create a template.|

### Examples

1. Generate a 1200x630px social image from `posts/hello-world/index.md`

Suppose that `index.md` has the front matter looks like this:

```markdown
---
title: Lấy dữ liệu web với Node.js và Puppeteer
author: Thien Nguyen
date: "2019-03-04T10:33:00+07:00"
---
```

```
social-image-gen --path=./posts/hello-world/index.md --output=./public/hello-world/ --width=1200 --height=630
```

![thumbnail](https://user-images.githubusercontent.com/3280351/54678731-55b9c300-4b38-11e9-9311-3ae3ed0a0676.png)


2. Generate a 800x400px social image with `--ignore-md`

```
social-image-gen --ignore-md --output=./public/hello-world/ --title="Hello World" --date="20 Mar, 2019" --author="12bit.vn"
```

![thumbnail-1](https://user-images.githubusercontent.com/3280351/54678733-56525980-4b38-11e9-9f07-5d874ee3a2a6.png)
