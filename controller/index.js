'use strict';
var generators = require('yeoman-generator'),
    fs = require('fs'),
    _ = require('lodash');

module.exports = generators.Base.extend({
    askForFeatureName: function () {
        var featureFolder = process.cwd() + '/src/client/app/features/';
        var done = this.async();

        var prompts = [{
            type: 'list',
            name: 'featureName',
            //default: 'core',
            message: 'Which Feature does this controller belongs to?',
            choices: []
        }, {
                type: 'input',
                name: 'name',
                default: '',
                message: 'What is the name of the controller (leave it blank to inherit it from feature)?'
            }];

        // Add Feature choices
        if (fs.existsSync(featureFolder)) {

            fs.readdirSync(featureFolder).forEach(function (folder) {
                var stat = fs.statSync(featureFolder + '/' + folder);

                if (stat.isDirectory()) {
                    prompts[0].choices.push({
                        value: folder,
                        name: folder
                    });
                }
            });
        }

        this.prompt(prompts, function (props) {
            this.featureName = props.featureName;
            this.name = props.name || this.featureName;
            done();
        }.bind(this));
    },

    renderControllerFiles: function () {
        this.fs.copyTpl(
            this.templatePath('_controller.js'),
            this.destinationPath('src/client/app/features/' + this.featureName + '/' + this.name + '.controller.js'),
            {
                ctrlName: _.upperFirst(this.name + 'Controller'),
                appName: this.config.get('ngappname')
            }
            );
    }
});
