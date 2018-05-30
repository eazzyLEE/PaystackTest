var myApp = angular.module("myapp", ["rzModule", "ui.bootstrap"]);

myApp.controller("MainCtrl", MainCtrl);
function MainCtrl($scope, $http, $timeout) {
  $scope.customers = [];
  //$scope.fix = [];

  $http({
    method: "GET",
    url: "https://studio-api.paystack.co/insights/spenders/",
    headers: {
      Authorization: "Bearer sk_test_584bfc762c9d0eeb4f4dc722912f3b22f3c4c925"
    }
  }).then(
    function success(res) {
      $scope.customers = res.data.data;
      let fix = []; // Array for transaction sum for top spenders
      let revArray = 0,
        slideSum = 0,
        totalRev = 0;
      for (var i = 0; i < $scope.customers.length; i++) {
        //Compare Dates
        const initialDate = new Date("2017-01-01"); //Start Date (from)

        newDate = new Date($scope.customers[i].customer.updatedAt);
        totalRev += $scope.customers[i].total_transaction_amount;
        if (newDate < Date.now() && newDate > initialDate) {
          revArray += $scope.customers[i].total_transaction_amount;
          // Create array of top spenders within the stated period
          fix.push($scope.customers[i].total_transaction_amount);
        }
        // Sort array of top spenders in ascending order
        fix.sort(function(a, b) {
          return a - b;
        });
      }
      // Sum of all top spenders from 0 to slider-value
      for (var j = 0; j < $scope.vm.priceSlider1.value; j++) {
        slideSum += fix[j];
      }
      $scope.topRev = revArray; // Assign: Total sum of top spenders from 01-01-17 till date
      $scope.totalRev = totalRev; // Assign: Total transaction amount from all customers
      $scope.slider = slideSum; // Assign: Total transaction of all top spenders from 0 to current slider-value
      $scope.rate = Math.round(slideSum / revArray * 100); // This evaluates the sum of all top spenders from slider-value as a percentage of total
      $scope.fix = fix.length;

      console.log(slideSum / revArray);
    },
    function error(res) {
      alert("Error");
    }
  );

  var vm = this;

  vm.priceSlider1 = {
    floor: 0,
    ceil: 1,
    value: 9
  };

  vm.refreshSlider = function() {
    $timeout(function() {
      $scope.$broadcast("rzSliderForceRender");
    });
  };
}
