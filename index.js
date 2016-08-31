'use strict';

const path  = require('path'),
  fs        = require('fs'),
  BbPromise = require('bluebird'); 

class EndpointHelper {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      create: {
        usage: 'Create new endpoint for your function',
        commands: {
          endpoint: {
            usage: 'Create endpoint',
            lifecycleEvents: [
              'endpoint'
            ],
            options: {
              function: {
                usage: 'Name of the function',
                shortcut: 'f',
                required: true,
              },
               method: {
                usage: 'Provide a method',
                shortcut: 'm',
                required: true,
              },
              path: {
                usage: 'Provide a path',
                shortcut: 'p',
                required: false,
              }
            }
          }
        }
      }
    };

    this.hooks = { 
      'create:endpoint:endpoint':() => {
        BbPromise.bind(this)
        .then(this.addEndPoint());
       }
     }
  }

  addEndPoint(){
      //Get function object
      let funcName = this.options.f || this.options.function;
      let funPath = this.options.p || this.options.path;
      let funMethod = this.options.m || this.options.method;
      let _this = this;
      
      console.log('-------------------');
      console.log("Endpoint created" + " - " + "function: " + funcName +
                    " - " + "method: " + funMethod  + " - " + "path: " + funPath);
      console.log('-------------------');
  }

/*
  updateFunction(content, file){
  
  }

  newEndPoint(path, method) {


  }
  */

}

module.exports = EndpointHelper;
