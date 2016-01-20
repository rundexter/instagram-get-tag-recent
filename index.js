var _ = require('lodash'),
    util = require('./util.js'),
    instagram = require('instagram-node').instagram();

var pickInputs = {
        'tag': { key: 'tag', validate: { req: true } }
    },
    pickOutputs = {
        'id': { key: 'data', fields: ['id']},
        'username': { key: 'data', fields: ['user.username']},
        'full_name': { key: 'data', fields: ['user.full_name']},
        'tags': { key: 'data', fields: ['tags']},
        'location': { key: 'data', fields: ['location']},
        'link': { key: 'data', fields: ['link']},
        'media': { key: 'data', fields: ['images.standard_resolution.url']},
        'caption': { key: 'data', fields: ['caption.text']},
        'likes': { key: 'data', fields: ['likes.count']}
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('instagram').credentials(),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        // check params.
        if (validateErrors)
            return this.fail(validateErrors);

        instagram.use({ access_token: _.get(credentials, 'access_token') });
        instagram.tag_media_recent(inputs.tag, function (error, result) {

            error? this.fail(error) : this.complete(util.pickOutputs({ data: result }, pickOutputs));
        }.bind(this));
    }
};
