(function () {

  angular = angular || window.angular;
  if (!angular) return;

  angular.module('ngRakr', [])
    .config(['$provide', logProvider]);

  function logProvider($provide) {
    $provide.decorator('$log', ['$delegate', logDecorator]);
  }

  function logDecorator($delegate) {
    var functionMap = { log: 0, info: 1, warn: 3 };
    var rakr = window['RakrWidgetObject'];
    for (var func in functionMap) {
      var original = $delegate[func];
      $delegate[func] = function decoratedLog(msg) {
        if (window[rakr] && window[rakr]['log']) {
          window[rakr]['log'](func[func], arguments);
        };
        original.apply($delegate, arguments);
      };
    }
    return $delegate;
  }

})();