'use strict';


const path  = require('path'),
  fs        = require('fs'),
  jsonfile = require('jsonfile'),
  BbPromise = require('bluebird'); // Serverless uses Bluebird Promises and we recommend you do to because they provide more than your average Promise :)

module.exports = function(S) { // Always pass in the ServerlessPlugin Class

  /**
   * Adding/Manipulating Serverless classes
   * - You can add or manipulate Serverless classes like this
   */

  S.classes.Project.newStaticMethod     = function() { console.log("A new method!"); };
  S.classes.Project.prototype.newMethod = function() { S.classes.Project.newStaticMethod(); };

  /**
   * Extending the Plugin Class
   * - Here is how you can add custom Actions and Hooks to Serverless.
   * - This class is only required if you want to add Actions and Hooks.
   */

  class PluginBoilerplate extends S.classes.Plugin {

    constructor() {
      super();
      this.name = 'io.sc5.endpoint.helper';
    }

    registerActions() {

      S.addAction(this._customAction.bind(this), {
        handler:       'customAction',
        description:   'An action to create endpoint template',
        context:       'endpoint',
        contextAction: 'create',
        options:       [{
          option:      'option',
          shortcut:    'o',
          description: 'test option 1'
        }],
        parameters: [
          {
            parameter: 'paths',
            description: 'One or multiple paths to your function',
            position: '0->'
          }
        ]
      });

      return BbPromise.resolve();
    }

    registerHooks() {
      return BbPromise.resolve();
    }

    _customAction(evt) {

      let _this = this;

      return new BbPromise(function (resolve, reject) {

        if (S.getProject().getFunction(evt.options.paths[0]) === undefined) {
          return new BbPromise(function(resolve, reject) {
          reject(`Endpoint Helper: Function ${evt.options.paths[0]} does not exist in your project`);
        });
        }

        return addEndPoint(evt);

      });
    }
  }

  function addEndPoint(evt){
      //Get function object
      var sFunFilePath = S.getProject().getFunction(evt.options.paths[0]);
      
      //Get function path string
      var funPathString = sFunFilePath.getFilePath();

      // Read current content
      var funContent = fs.readFileSync(funPathString);  
      
      // Parse it
      var jsonContent = JSON.parse(funContent);
      
      //Input path endpoint
      var funPath = evt.options.paths[1];

      //Input Method      
      var funMethod = evt.options.paths[2];

      //Add new endpoint
      jsonContent.endpoints.push(newEndPoint(funPath, funMethod));
      updateFunction(jsonContent, funPathString);
      console.log('-------------------');
      console.log("Endpoint created" + " - " + "Path: " + funPath  +" - " + "Method: " + funMethod );
      console.log('-------------------');
  }

  function updateFunction(content, file){
      jsonfile.spaces = 4
      jsonfile.writeFile(file, content, function (err) {
          if(err) {
              return console.log(err);
          }
          console.log("Error saving file, enpoint was not created!");
      });
  }

  function newEndPoint(path, method) {
      return {

      "path": path,
      "method": method,
      "type": "AWS",
      "authorizationType": "none",
      "authorizerFunction": false,
      "apiKeyRequired": false,
      "requestParameters": {},
      "requestTemplates": "",
      "responses": {
        "400": {
          "statusCode": "400"
        },
        "default": {
          "statusCode": "200",
          "responseParameters": {},
          "responseModels": {
            "application/json;charset=UTF-8": "Empty"
          },
          "responseTemplates": {
            "application/json;charset=UTF-8": ""
          }
        }
      }
    };

  }

  // Export Plugin Class
  return PluginBoilerplate;
};
