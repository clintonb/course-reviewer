'use strict';

/* App Module */

var courseReviewerApp = angular.module('courseReviewerApp', [
    'ui.router',
    'ngMaterial',
    'elasticsearch',
    'courseReviewerControllers',
    'courseReviewerServices'
]);

courseReviewerApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
        $urlRouterProvider.otherwise('/courses');

        $stateProvider.
            state('courses_list', {
                url: '/courses',
                templateUrl: 'partials/course-list.html',
                controller: 'CourseListCtrl'
            }).
            state('courses_detail', {
                url: '/courses/{courseId:.*}',
                templateUrl: 'partials/course-detail.html',
                controller: 'CourseDetailCtrl'
            });
    }]);
