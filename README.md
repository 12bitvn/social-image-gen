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

| Argument    |Desciption|            |
|----------|----------|------|
| `--path` | The path to the markdown file. It's MUST HAVE if there is no `--ignore-md` provided. Eg: `./posts/post-slug/index.md` | `optional` |
| `--output` | The path that stores the generated image. Eg: `./public/post-slug`   |   `required` |
| `--ignore-md` | In case that you don't want to generate image from markdown content, you can use this argument which goes together with `--title`, `--author`, `--date` | `optional` |
|`--width`| The image width| `optinal` - default is `800`|
|`--height`| The image height| `optinal` - default is `400`|
|`--title`| The title in the image. If you use `--ignore-md`, this arg will available. Eg: `--title="Hello World"`| `optional` - default is `untitled`|
|`--date`| The date in the image. If you use `--ignore-md`, this arg will available. Eg: `--date="20 Mar 2019"`| `optional`|
|`--author`| The author in the image. If you use `--ignore-md`, this arg will available. Eg: `--author="12bit.vn"`| `optional` - default is `unauthored`|
