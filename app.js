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
  $scope.firstTerm = '';
  $scope.secondTerm = '';
  $scope.operator = '';
  $scope.display = 'Crunch your numbers below.';
  $scope.crunchTitle = '';
  $scope.crunchIsActive = false;
  $scope.isCurrency = false;
  $scope.crunches = [];
  $scope.operatorList = ['+','-','x','/','N/A'];

  //"Crunch" the selected terms with the selected operator.
  $scope.crunch = function() {

    if ($scope.operator == "+") {
      if ($scope.isCurrency == true) {
        return parseFloat(parseFloat($scope.firstTerm) + parseFloat($scope.secondTerm)).toFixed(2);
      } else {
        return parseFloat($scope.firstTerm) + parseFloat($scope.secondTerm);
      }
    }

    else if ($scope.operator == "-") {
      if ($scope.isCurrency == true) {
        return parseFloat(parseFloat($scope.firstTerm) - parseFloat($scope.secondTerm)).toFixed(2);
      } else {
        return parseFloat($scope.firstTerm) - parseFloat($scope.secondTerm);
      }
    }

    else if ($scope.operator == "x") {
      if ($scope.isCurrency == true) {
        return parseFloat(parseFloat($scope.firstTerm) * parseFloat($scope.secondTerm)).toFixed(2);
      } else {
        return parseFloat($scope.firstTerm) * parseFloat($scope.secondTerm);
      }
    }

    else if ($scope.operator == "/") {
      if ($scope.isCurrency == true) {
        return parseFloat(parseFloat($scope.firstTerm) / parseFloat($scope.secondTerm)).toFixed(2);
      } else {
        return parseFloat($scope.firstTerm) / parseFloat($scope.secondTerm);
      }
    }

    else {
      //do nothing
    }

  }

  //Pass the crunch to the "crunches" array. The array is what is actually displayed in the view.
  $scope.appendCrunch = function() {
    if ($scope.operator == 'N/A') {

      if($scope.isCurrency == true) {
        $scope.crunches.push({title:$scope.crunchTitle,crunch:'$' + $scope.firstTerm,display:$scope.operator});
        $scope.display = '$' + $scope.firstTerm;
      } else {
        $scope.crunches.push({title:$scope.crunchTitle,crunch:$scope.firstTerm,display:$scope.operator});
        $scope.display = $scope.firstTerm;
      }

      $scope.crunchTitle = '';

    }

    else {

      if($scope.isCurrency == true) {
        $scope.crunches.push({title:$scope.crunchTitle,crunch:'$' + $scope.crunch(),display:'$' + $scope.firstTerm + ' ' + $scope.operator + ' ' + '$' + $scope.secondTerm});
        $scope.firstTerm = $scope.crunch();
        $scope.display = '$' + $scope.firstTerm + ' ' + $scope.operator;
      } else {
        $scope.crunches.push({title:$scope.crunchTitle,crunch:$scope.crunch(),display:$scope.firstTerm + ' ' + $scope.operator + ' ' + $scope.secondTerm});
        $scope.firstTerm = $scope.crunch();
        $scope.display = $scope.firstTerm + ' ' + $scope.operator;
      }

      $scope.secondTerm = '';
      $scope.crunchTitle = '';

    }

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

  //Clear the term fields.
  $scope.clearTerms = function() {
    $scope.firstTerm = '';
    $scope.secondTerm = '';
    $scope.operator = '';
    $scope.crunchTitle = '';
    $scope.display = 'Crunch your numbers below.';
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
      var delimiter = ',';
      var quote = '"';  //Prevents comma delimitation on strings with commas.
      var linebreak = '\r\n';
      var csv = 'data:text/csv;charset=utf-8' + delimiter;
      csv += 'TITLE' + delimiter + 'FORMULA' + delimiter + 'AMOUNT' + linebreak;

      for (i = 0; i < $scope.crunches.length; i++) {
        csv += quote + $scope.crunches[i].title + quote + delimiter + quote + $scope.crunches[i].display + quote + delimiter + quote + $scope.crunches[i].crunch + quote + linebreak;
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

    if ($scope.firstTerm == undefined){
      $scope.firstTerm = '';
    }

    if ($scope.secondTerm == undefined){
      $scope.secondTerm = '';
    }

    if ($scope.isCurrency == true && $scope.firstTerm != '') {
      $scope.firstTerm = parseFloat(Math.round($scope.firstTerm * 100) / 100).toFixed(2);
    } else if ($scope.isCurrency == false && $scope.firstTerm != '') {
      $scope.firstTerm = parseFloat(Math.round($scope.firstTerm * 100) / 100).toFixed(0);
    } else {
      $scope.firstTerm = '';
    }

    if ($scope.isCurrency == true && $scope.secondTerm != '') {
      $scope.secondTerm = parseFloat(Math.round($scope.secondTerm * 100) / 100).toFixed(2);
    } else if ($scope.isCurrency == false && $scope.secondTerm != '') {
      $scope.secondTerm = parseFloat(Math.round($scope.secondTerm * 100) / 100).toFixed(0);
    } else {
      $scope.secondTerm = '';
    }

  });

  //Watches every time changes are made to the the secondTerm fields for the two terms and the operator in the view.
  $scope.$watchGroup(['firstTerm','operator','secondTerm'], function () {

    //Enables use of the "Save" button in the view.
    if ( ( !isNaN(parseFloat($scope.firstTerm)) && !isNaN(parseFloat($scope.secondTerm)) && $scope.operator != '' )
    || ( (!isNaN(parseFloat($scope.firstTerm)) && $scope.operator == 'N/A') ) ) {
      $scope.crunchIsActive = true;
    } else {
      $scope.crunchIsActive = false;
    }

    //Display display in view depending on how isCurrency is toggled.
    if ($scope.operator == 'N/A') {
      if ($scope.isCurrency == true && $scope.firstTerm != '') {
        $scope.display = '$' + $scope.firstTerm;
      } else if ($scope.isCurrency == false && $scope.firstTerm != '') {
        $scope.display = $scope.firstTerm;
      } else {
        $scope.display = 'Crunch your numbers below.';
      }
    } else {
      if ($scope.isCurrency == true) {
        if ($scope.firstTerm != '' && $scope.operator != '' && $scope.secondTerm != '') {
          $scope.display = '$' + $scope.firstTerm + ' ' + $scope.operator + ' ' + '$' + $scope.secondTerm + ' = ' + '$' + $scope.crunch();
        } else if ($scope.firstTerm != '' && $scope.operator == '' && $scope.secondTerm == '') {
          $scope.display = '$' + $scope.firstTerm;
        } else if ($scope.firstTerm != '' && $scope.operator == '' && $scope.secondTerm != '') {
          $scope.display = 'Please select an operator.';
        } else if ($scope.firstTerm == '' && $scope.operator != '' && $scope.secondTerm != '') {
          $scope.display = '?' + ' ' + $scope.operator + ' ' + '$' + $scope.secondTerm + ' = ' + '?';
        } else if ($scope.firstTerm != '' && $scope.operator != '' && $scope.secondTerm == '') {
          $scope.display = '$' + $scope.firstTerm + ' ' + $scope.operator;
        } else {
          $scope.display = 'Crunch your numbers below.';
        }
      } else {
        if ($scope.firstTerm != '' && $scope.operator != '' && $scope.secondTerm != '') {
          $scope.display = $scope.firstTerm + ' ' + $scope.operator + ' ' + $scope.secondTerm + ' = ' + $scope.crunch();
        } else if ($scope.firstTerm != '' && $scope.operator == '' && $scope.secondTerm == '') {
          $scope.display = $scope.firstTerm;
        } else if ($scope.firstTerm != '' && $scope.operator == '' && $scope.secondTerm != '') {
          $scope.display = 'Please select an operator.';
        } else if ($scope.firstTerm == '' && $scope.operator != '' && $scope.secondTerm != '') {
          $scope.display = '? ' + $scope.operator + ' ' + $scope.secondTerm + ' = ?';
        } else if ($scope.firstTerm != '' && $scope.operator != '' && $scope.secondTerm == '') {
          $scope.display = $scope.firstTerm + ' ' + $scope.operator;
        } else {
          $scope.display = 'Crunch your numbers below.';
        }
      }
    }

  });

});
