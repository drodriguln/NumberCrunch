var app = angular.module('myApp', ['ngAnimate']);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.controller('myController',
function($scope, $timeout) {

  $scope.output = '';
  $scope.input = '';
  $scope.operator = '';
  $scope.formula = 'Crunch your numbers below.';
  $scope.crunchTitle = '';
  $scope.crunchIsActive = false;
  $scope.isCurrency = false;
  $scope.crunches = [];
  $scope.operatorList = ['+','-','*','/'];

  $scope.crunch = function() {

    if ($scope.operator == "+") {
      if ($scope.isCurrency == true) {
        return parseFloat(parseFloat($scope.output) + parseFloat($scope.input)).toFixed(2);
      } else {
        return parseFloat($scope.output) + parseFloat($scope.input);
      }
    }

    else if ($scope.operator == "-") {
      if ($scope.isCurrency == true) {
        return parseFloat(parseFloat($scope.output) - parseFloat($scope.input)).toFixed(2);
      } else {
        return parseFloat($scope.output) - parseFloat($scope.input);
      }
    }

    else if ($scope.operator == "*") {
      if ($scope.isCurrency == true) {
        return parseFloat(parseFloat($scope.output) * parseFloat($scope.input)).toFixed(2);
      } else {
        return parseFloat($scope.output) * parseFloat($scope.input);
      }
    }

    else if ($scope.operator == "/") {
      if ($scope.isCurrency == true) {
        return parseFloat(parseFloat($scope.output) / parseFloat($scope.input)).toFixed(2);
      } else {
        return parseFloat($scope.output) / parseFloat($scope.input);
      }
    }

    else {
      //do nothing
    }

  }

  $scope.appendCrunch = function() {
    if($scope.isCurrency == true) {
      $scope.crunches.push({title:$scope.crunchTitle,crunch:'$' + $scope.crunch(),formula:'$' + $scope.output + ' ' + $scope.operator + ' ' + '$' + $scope.input});
    } else {
      $scope.crunches.push({title:$scope.crunchTitle,crunch:$scope.crunch(),formula:$scope.output + ' ' + $scope.operator + ' ' + $scope.input});
    }
    $scope.output = $scope.crunch();
    $scope.formula = $scope.output + ' ' + $scope.operator + ' ' + $scope.input + ' = ' + $scope.output;
    $scope.input = '';

    var audio = new Audio('sounds/crunch.wav');
    audio.play();

    $('#title-left').removeClass("title-pop").addClass("title-crunch-left");
    $('#title-right').removeClass("title-pop").addClass("title-crunch-right");

    $timeout(function() {
      $('#title-left').removeClass("title-crunch-left");
      $('#title-right').removeClass("title-crunch-right");
    }, 800);


  }

  $scope.clearInput = function() {
    $scope.output = '';
    $scope.input = '';
    $scope.operator = '';
    $scope.formula = 'Crunch your numbers below.';
  }

  $scope.clearCrunches = function() {
    $scope.crunches = [];
  }

  $scope.$watch('isCurrency', function() {
    if ($scope.isCurrency == true) {
      $scope.input = parseFloat(Math.round($scope.input * 100) / 100).toFixed(2);
      $scope.output = parseFloat(Math.round($scope.output * 100) / 100).toFixed(2);
    } else if ($scope.isCurrency == false && $scope.output == '' && $scope.input == '') {
      $scope.output == '';
      $scope.output == '';
    } else if ($scope.isCurrency == false && $scope.output == '') {
      $scope.output == '';
    } else if ($scope.isCurrency == false && $scope.input == '') {
      $scope.input == '';
    } else {
      $scope.input = parseFloat(Math.round($scope.input * 100) / 100).toFixed(0);
      $scope.output = parseFloat(Math.round($scope.output * 100) / 100).toFixed(0);
    }
  });

  $scope.$watchGroup(['output','operator','input'], function () {

    if(!isNaN(parseFloat($scope.output)) && !isNaN(parseFloat($scope.input)) && $scope.operator != '') {
      $scope.crunchIsActive = true;
    } else {
      $scope.crunchIsActive = false;
    }

    if ($scope.isCurrency == true) {
      if ($scope.output != '' && $scope.operator != '' && $scope.input != '') {
        $scope.formula = '$' + $scope.output + ' ' + $scope.operator + ' ' + '$' + $scope.input + ' = ' + '$' + $scope.crunch();
      } else if ($scope.output == '' && $scope.operator != '' && $scope.input != '') {
        $scope.formula = '?' + ' ' + $scope.operator + ' ' + '$' + $scope.input + ' = ' + '?';
      } else if ($scope.output != '' && $scope.operator != '' && $scope.input == '') {
        $scope.formula = '$' + $scope.output + ' ' + $scope.operator;
      } else {
        $scope.formula = 'Crunch your numbers below.';
      }
    } else {
      if ($scope.output != '' && $scope.operator != '' && $scope.input != '') {
        $scope.formula = $scope.output + ' ' + $scope.operator + ' ' + $scope.input + ' = ' + $scope.crunch();
      } else if ($scope.output == '' && $scope.operator != '' && $scope.input != '') {
        $scope.formula = '? ' + $scope.operator + ' ' + $scope.input + ' = ?';
      } else if ($scope.output != '' && $scope.operator != '' && $scope.input == '') {
        $scope.formula = $scope.output + ' ' + $scope.operator;
      } else {
        $scope.formula = 'Crunch your numbers below.';
      }
    }

  });

});
