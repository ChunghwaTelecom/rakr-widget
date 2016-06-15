(function () {

  angular = angular || window.angular;
  if (!angular) return;

  angular.module('ngRakr', [])
    .config(['$provide', logProvider])
    .factory('$exceptionHandler', ['$log', exceptionHandler]);

  function getRakr() {
    var rakr = window['RakrWidgetObject'];
    if (rakr) {
      return window[rakr];
    }
  }

  function logProvider($provide) {
    $provide.decorator('$log', ['$delegate', logDecorator]);
  }

  function logDecorator($delegate) {
    var functionMap = { log: 0, info: 1, warn: 3 };
    var rakr = getRakr();
    if (rakr) {
      for (var func in functionMap) {
        var original = $delegate[func];
        $delegate[func] = function decoratedLog(msg) {
          if (rakr['log']) {
            rakr['log'](func[func], arguments);
          };
          original.apply($delegate, arguments);
        };
      }
    }
    return $delegate;
  }

  function exceptionHandler($log) {
    return function rakrExceptionHandler(exception, cause) {
      var rakr = getRakr();
      if (rakr && rakr['logError']) {
        rakr['logError'](exception);
      }
      $log.error(exception, cause);
    };
  }

})();
