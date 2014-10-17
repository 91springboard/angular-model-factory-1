define(['angular', 'modelFactory'], function (angular) {

    var module = angular.module('myapp', ['modelFactory']);

    module.factory('ZooModel', function($modelFactory){
    
        var model = $modelFactory('api/zoo', {
            defaults: {
                newAnimal: true
            },
            actions: {
                query: {
                    cache: true
                },
                $copy: {
                    method: 'POST',
                    url: 'copy'
                }
            }
        });

        return model;
    });

    module.config(function ($stateProvider) {
        $stateProvider.state('zoo', {
            url: '/zoo',
            templateUrl: 'zoo.tpl.html',
            controller: 'ZooCtrl',
            resolve: {
                zoos: function (ZooModel) {
                    return ZooModel.query();
                }
            }
        });
    });

    module.controller('ZooCtrl', function ($scope, ZooModel, zoos) {

        //-> zoos = [ ZooModel({ type: 'National', name: 'DC Zoo', id: '123' }) ]
        $scope.zoos = zoos;

        $scope.editZoo = function(zoo){
            // UPDATE since we have an id
            zoo.$save().then(function(model){

                // cache was invalidated
                alert('Zoo was updated');
            });
        };

        $scope.deleteZoo = function(zoo){
            zoo.$destroy().then(function(){

                // cache was invalidated
                alert('Zoo was deleted');

                // zoo was automatically removed from array
                //-> $scope.zoos = [];
            });
        };

        $scope.createZoo = function(name){
            var newZoo = new ZooModel({
                name: name
            });

            // POST since no id
            zooModel.$save().then(function(model){
                //-> ZooModel({ name: 'whatever', newAnimal: true })

                // push our new zoo into the model
                // this will relate the zoo to the model
                // so if a user destorys this model it will
                // automatically be removed from the array too
                $scope.zoos.push(model);
            });
        };

        $scope.getZoo = function(id){
            // get a zoo by id
            ZooModel.get(id).then(function(model){
                $scope.newZoo = model;
            });
        };

        $scope.getPandas = function(){
            // get a zoo by animalType of panda
            // GET api/zoo?animalType=panda
            ZooModel.query({ animalType: 'panda' }).then(function(models){
                $scope.pandas = models;
            });
        };

        $scope.refreshZoos = function(){
            ZooModel.query().then(function(models){
                // models = [ ZooModel({ type: 'National', name: 'DC Zoo', id: '123' }) ]
                $scope.allZoos = models;
            });
        };

    });

    return module;
});