'use strict';

/* Services */

var courseReviewerServices = angular.module('courseReviewerServices', ['elasticsearch']);

courseReviewerServices.factory('client', ['esFactory',
    function (esFactory) {
        return esFactory({
            host: 'localhost:9200'
        });
    }]);
