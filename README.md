# social-image-gen

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

Available arguments:

| Argument | Required  | Default|Description|
|----------|----------|-----|------|
| `--path` |**required**| |The path to the markdown file. It's MUST HAVE if there is no `--ignore-md` provided. Eg: `./posts/post-slug/index.md` |
| `--output` |**required**| |The path that stores the generated image. Eg: `./public/post-slug`   | 
| `--ignore-md` |optional| |In case that you don't want to generate image from markdown content, you can use this argument which goes together with `--title`, `--author`, `--date` |
|`--width`|optional|800|The image width|
|`--height`|optional|400| The image height|
|`--title`|optional|"untitled"| The title in the image. If you use `--ignore-md`, this arg will available. Eg: `--title="Hello World"`|
|`--date`|optional|| The date in the image. If you use `--ignore-md`, this arg will available. Eg: `--date="20 Mar 2019"`|
|`--author`|optional|"unauthored"| The author in the image. If you use `--ignore-md`, this arg will available. Eg: `--author="12bit.vn"`|
|`--template`|optional|`templates/default.html`|The mockup template is used to generate image. You can check `./templates/default.html` to see how to create a template.|

Examples:

1. Generate a 1200x630px social image from `posts/hello-world/index.md`

```
social-image-gen --path=./posts/hello-world/index.md --output=./public/hello-world/ --width=1200 --height=630
```

2. Generate a 800x400px social image with `--ignore-md`

```
social-image-gen --ignore-md --output=./public/hello-world/ --title="Hello World" --date="20 Mar, 2019" --author="12bit.vn"
```
