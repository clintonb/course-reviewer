'use strict';

/* Controllers */

var courseReviewerControllers = angular.module('courseReviewerControllers', []);

function result2course(result) {
    var source = result._source;
    return {
        id: source.course_id,
        approved: source.approved,
        reviewed: source.reviewed,
        pages: source.pages,
        error: source.error
    };
}

courseReviewerControllers.controller('CourseListCtrl', ['$scope', 'client',
    function ($scope, client) {
        client.search({
            index: 'course_reports',
            type: 'course_performance_screenshot',
            body: {
                size: 1000,
                query: {match_all: {}}
            }
        }).then(function (result) {
            var courses = [],
                hits = result.hits.hits,
                num_reviewed = 0;

            var num_courses = hits.length;
            for (var i = 0; i < num_courses; i++) {
                var course = result2course(hits[i]);
                courses.push(course);
                if(course.reviewed) {
                    num_reviewed++;
                }
            }


            $scope.courses = courses;
            $scope.orderProp = 'id';
            $scope.num_courses = num_courses;
            $scope.num_reviewed = num_reviewed;
            $scope.completion_percentage = num_courses ? (100 * num_reviewed / num_courses) : 0;
            $scope.review_filter = 'false'
        });
    }]);

courseReviewerControllers.controller('CourseDetailCtrl', ['$scope', '$stateParams', 'client',
    function ($scope, $stateParams, client) {
        document.getElementById('courseDetail').focus();

        $scope.onKeyUp = function ($event) {
            var char = String.fromCharCode($event.keyCode);
            if (char == 'P') {
                $scope.review(true);
            }
            else if (char == 'X') {
                $scope.review(false);
            }
        };

        client.get({
            index: 'course_reports',
            type: 'course_performance_screenshot',
            id: $stateParams.courseId
        }).then(function (result) {
            $scope.course = result2course(result);
        });

        $scope.review = function (approve) {
            client.update({
                index: 'course_reports',
                type: 'course_performance_screenshot',
                id: $stateParams.courseId,
                doc_as_upsert: true,
                body: {
                    doc: {
                        reviewed: true,
                        approved: approve
                    }
                },
                fields: ['reviewed', 'approved']
            }).then(function (result) {
                $scope.course.approved = result.get.fields.approved[0];
                $scope.course.reviewed = result.get.fields.reviewed[0];
            });
        };

    }]);
