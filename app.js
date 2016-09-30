var app = angular.module('myApp', ['ngAnimate']);

//Displays an array in reverse order in the view.
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.controller('myController',
function($scope, $timeout) {

  //Initialize variables and arrays.
  $scope.output = '';
  $scope.input = '';
  $scope.operator = '';
  $scope.formula = 'Crunch your numbers below.';
  $scope.crunchTitle = '';
  $scope.crunchIsActive = false;
  $scope.isCurrency = false;
  $scope.crunches = [];
  $scope.operatorList = ['+','-','*','/'];

  //"Crunch" the selected terms with the selected operator.
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

  //Pass the crunch to the "crunches" array. The array is what is actually displayed in the view.
  $scope.appendCrunch = function() {
    if($scope.isCurrency == true) {
      $scope.crunches.push({title:$scope.crunchTitle,crunch:'$' + $scope.crunch(),formula:'$' + $scope.output + ' ' + $scope.operator + ' ' + '$' + $scope.input});
    } else {
      $scope.crunches.push({title:$scope.crunchTitle,crunch:$scope.crunch(),formula:$scope.output + ' ' + $scope.operator + ' ' + $scope.input});
    }
    $scope.output = $scope.crunch();
    $scope.formula = $scope.output + ' ' + $scope.operator + ' ' + $scope.input + ' = ' + $scope.output;
    $scope.input = '';
    $scope.crunchTitle = '';

    //Play the crunch sound.
    var audio = new Audio('sounds/crunch.mp3');
    audio.play();

    //Execute crunch animation by removing/adding animated classes.
    $('#title-left').removeClass("title-slide-left").addClass("title-crunch-left");
    $('#title-right').removeClass("title-slide-right").addClass("title-crunch-right");
    $timeout(function() {
      $('#title-left').removeClass("title-crunch-left");
      $('#title-right').removeClass("title-crunch-right");
    }, 800);


  }

  //Remove selected crunch in the view's list.
  $scope.removeCrunch = function() {
    var indexReversed =  Math.abs($scope.crunches.length - this.$index - 1);
    $scope.crunches.splice(indexReversed, 1);
  }

  //Clear the text input fields.
  $scope.clearInput = function() {
    $scope.output = '';
    $scope.input = '';
    $scope.operator = '';
    $scope.crunchTitle = '';
    $scope.formula = 'Crunch your numbers below.';
  }

  //Clears the entire list of crunches.
  $scope.clearCrunches = function() {
    $scope.crunches = [];
  }

  //Parses the "crunches" array ito a comma-delimited format, then creates a CSV file to download.
  $scope.downloadCsv = function() {

    //Must have at least one crunch available to create CSV file.
    if ($scope.crunches.length > 0 && $scope.crunches != null) {

      var filename = 'NumberCrunch.csv';
      var csvDelimiter = ',';
      var csvLineBreak = '\r\n';
      var csv = 'data:text/csv;charset=utf-8' + csvDelimiter;
      csv += 'TITLE' + csvDelimiter + 'FORMULA' + csvDelimiter + 'AMOUNT' + csvLineBreak;

      for (i = 0; i < $scope.crunches.length; i++) {
        csv += $scope.crunches[i].title + csvDelimiter + $scope.crunches[i].formula + csvDelimiter + $scope.crunches[i].crunch + csvLineBreak;
      }

      var data = encodeURI(csv);
      var link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();

    }

  }

  //Watches every time the "Use Currency" checkbox is changed in the view.
  $scope.$watch('isCurrency', function() {
    if ($scope.isCurrency == true) {
      $scope.input = parseFloat(Math.round($scope.input * 100) / 100).toFixed(2);
      $scope.output = parseFloat(Math.round($scope.output * 100) / 100).toFixed(2);
    } else if ($scope.isCurrency == false && $scope.output == '' && $scope.input == '') {
      $scope.input == '';
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

  //Watches every time changes are made to the the input fields for the two terms and the operator in the view.
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
