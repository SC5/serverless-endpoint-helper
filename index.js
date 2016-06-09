'use strict';


const path  = require('path'),
  fs        = require('fs'),
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
      this.name = 'myPlugin';
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

      S.addHook(this._hookPre.bind(this), {
        action: 'functionRun',
        event:  'pre'
      });

      S.addHook(this._hookPost.bind(this), {
        action: 'functionRun',
        event:  'post'
      });

      return BbPromise.resolve();
    }

    _customAction(evt) {

      let _this = this;

      return new BbPromise(function (resolve, reject) {

        //Get function objecgt
        var sFunFilePath = S.getProject().getFunction(evt.options.paths[0]);
       
        // Read current content
        var sFunContent = fs.readFileSync(sFunFilePath.getFilePath());

        // Parse it
        var jsonContent = JSON.parse(sFunContent);
        
        //Input path endpoint
        var funPath = evt.options.paths[1];

        //Input Method
        var funMethod = evt.options.paths[2];

        //Add new endpoint
        jsonContent.endpoints.push(newEndPoint(funPath, funMethod));
        console.log(jsonContent);

        console.log('-------------------');
        console.log('YOU JUST RAN YOUR CUSTOM ACTION, NICE!');
        console.log('-------------------');

        return resolve(evt);

      });
    }

    _hookPre(evt) {

      let _this = this;

      return new BbPromise(function (resolve, reject) {

        console.log('-------------------');
        console.log('YOUR SERVERLESS PLUGIN\'S CUSTOM "PRE" HOOK HAS RUN BEFORE "FunctionRun"');
        console.log('-------------------');

        return resolve(evt);

      });
    }

    _hookPost(evt) {

      let _this = this;

      return new BbPromise(function (resolve, reject) {

        console.log('-------------------');
        console.log('YOUR SERVERLESS PLUGIN\'S CUSTOM "POST" HOOK HAS RUN AFTER "FunctionRun"');
        console.log('-------------------');

        return resolve(evt);

      });
    }
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
