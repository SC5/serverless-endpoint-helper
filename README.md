# Serverless endpoint Plugin

A Serverless Plugin for the [Serverless Framework](http://www.serverless.com) 

**THIS PLUGIN REQUIRES SERVERLESS V0.5 OR HIGHER!**

## Introduction

This plugins does the following:

* It will create end point templates for the functions in your serverless project

## Installation

In your project root, run:

```bash
npm install --save serverless-endpoint-helper
```

Add the plugin to `s-project.json`:

```json
"plugins": [
  "serverless-endpoint-helper"
]
```

## Usage

### Creating endpoints

On the endpoint context, with the command endpoint create for adding new endpoints to s-function.json

```
sls endpoint create <function> <path> <method>
```
