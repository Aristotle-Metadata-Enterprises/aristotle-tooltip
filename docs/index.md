---
title: Aristotle Tooltip Demo
---

<div align="center">
  <img alt="Aristotle Cloud Services Australia" src="https://brand.aristotlemetadata.com/images/pngs/base/base.256.png" height="117" />
</div>
<div align="center">
  <h1>Aristotle Tooltip</h1>
  <p>A highly customisable and easy to use way to insert Aristotle powered definitions to your website!</p>
</div>

## Features  
- :heavy_check_mark: Adaptable: use any Aristotle Metadata Registry!
- :globe_with_meridians: IE11+ Support: compatible with 99% of desktop and 98% of multiple users.
- :mouse: Light: weighs just 60kb, including image assets.
- :dog: Dogfooded: This library is used in our production Aristotle Registries. Updates guaranteed!

## Example
![Image](https://github.com/Aristotle-Metadata-Enterprises/aristotle-tooltip/blob/master/image.png?raw=true)

## Quick Start
### Package Manager
Install the aristotle-tooltip package:
```console
frankie@aristotle:~$ npm i aristotle_tooltip
```
In your application, import the `aristotle_tooltip` module, and the core css:
```javascript
import {addAristotle} from 'aristotle_tooltip'
import 'aristotle_tooltip/dist/tooltip.css'
```
This assumes you're using a module bundler like webpack, Rollup, or Parcel.

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@aristotle-metadata-enterprises/aristotle_tooltip@latest/dist/tooltip.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@aristotle-metadata-enterprises/aristotle_tooltip@latest/dist/tooltip.css">
```
Place them at the very bottom of the `<body>`. They must be placed before your own scripts, because of how the underlying Tippy.js library adds the tooltips.

### Usage
To add a tooltip for a piece of content on your webpage
```html
A <a href="#" data-aristotle-id="498427">person<a> is known by the company they keep
```
### Setup
```javascript
let options = {
  'url': 'https://registry.aristotlemetadata.com',
  'definitionWords': 50,
  'longDefinitionWords': 75,
};
addAristotle(options);

```

## Options

|-----------------+------------+-----------------|
|      Option     |   Default  |   Explanation   |
|-----------------|:----------:|----------------:|
| `url`           |`registry.aristotlemetadata.com` | The **URL** of an Aristotle Metadata Registry.      |
|-----------------+------------+-----------------|
| `definitionWords` |     50   | The number of words to display in the initial popup.   |
|-----------------+------------+-----------------|
| `longDefinitionWords` |     75   | The number of words to display when 'see more..' is pressed.     |
|-----------------+------------+-----------------|
| `placement` |     `bottom`   | The positioning of the Tooltip.     |
|-----------------+------------+-----------------|
| `externalLinkVisible` |     `true`   | Whether to display an external link icon next to the name of the metadata item.|
|-----------------+------------+-----------------|

## Setting up a Development Environment
We're an open source project that welcomes any new contributions. To setup a development environment, simply fork the repo, clone it locally, and from within the `aristotle-tooltip` project, run:
```console
oscar@aristotle:~$ npm install . 
oscar@aristotle:~$ npm run build-dev
```

## Demo

