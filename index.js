'use strict';

const is = require('is'),
      prequire = require('parent-require'),
      pg = prequire('pg');

module.exports = function($opts) {
    var enabled = is.defined($opts.enabled) ? $opts.enabled : true,
        inject = $opts.inject || '$postgres',
        uri = $opts.uri;

    if (enabled && (is.null(uri) || is.undefined(uri))) {
        throw new Error('URI is not defined!');
    }

    return function($$resolver, callback) {
        if (!enabled) {
            callback();
            return;
        }

        let client = new pg.Client(uri);
        client.connect(function(err) {
            if (err) {
                callback(err);
                return;
            }

            $$resolver.add(inject, client);
            callback();
        });
    };
};
