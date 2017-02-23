# grunt-highwinds

> Grunt plugin for the Highwinds CDN

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-highwinds --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-highwinds');
```

## The "highwinds" task

### Overview
In your project's Gruntfile, add a section named `highwinds` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  highwinds: {
    options: {
      // Task-specific options go here.
            
	    host: 'cdn.example.org',
	    protocol: 'http:', //or https:
	    accountId: "v3foxoxo", //Your Highwinds Account Id
      auth: {
	      username: "email@example.org",
	      password: "password"
      }
    },
    your_target: {
		}
  },
});
```

### Options

#### options.host
Type: `String`

A string value for the CDN hostname.

#### options.protocol
Type: `String`
Default value: `'http:'`

A string value for the CDN protocol. (Default is `http:`)

#### options.accountId
Type: `String`

Your Highwinds Account Id

#### options.auth
Type: `Object`

Your Highwinds login credentials as an object containing `username` and `password` keys.



### Usage Examples

#### Basic Example
Parse just one url from the CDN.

```js
grunt.initConfig({
  highwinds: {
    options: {
	    host: 'cdn.example.org',
	    protocol: 'https:', //or https:
	    accountId: "v3foxoxo", //Your Highwinds Account Id
      auth: {
	      username: "email@example.org",
	      password: "password"
      }
    },
    purge: {
		  files: [
			  {src:'/js/latest.min.js'}
			]
		}
  },
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
