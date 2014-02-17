'use strict';
angular.module('yaru22.directives.jsonHuman', ['yaru22.directives.jsonHuman.tmpls']).factory('RecursionHelper', [
  '$compile',
  function ($compile) {
    var RecursionHelper = {
        compile: function (element) {
          var contents = element.contents().remove();
          var compiledContents;
          return function (scope, element) {
            if (!compiledContents) {
              compiledContents = $compile(contents);
            }
            compiledContents(scope, function (clone) {
              element.append(clone);
            });
            var json = scope.json;
            scope.isBoolean = _.isBoolean(json);
            scope.isNumber = _.isNumber(json);
            scope.isString = _.isString(json);
            scope.isPrimitive = scope.isBoolean || scope.isNumber || scope.isString;
            scope.isObject = _.isPlainObject(json);
            scope.isArray = _.isArray(json);
            scope.isEmpty = _.isEmpty(json);
          };
        }
      };
    return RecursionHelper;
  }
]).directive('jsonHuman', function () {
  return {
    restrict: 'A',
    templateUrl: 'template/angular-json-human-root.tmpl',
    link: function (scope, elem, attrs) {
      var json = null;
      scope.$watch(attrs.jsonHuman, function () {
        try {
          json = JSON.parse(scope.$eval(attrs.jsonHuman));
        } catch (e) {
        }
        scope.json = json;
      });
      scope.isObject = _.isPlainObject(json);
      scope.isArray = _.isArray(json);
    }
  };
}).directive('jsonHumanHelper', function (RecursionHelper) {
  return {
    restrict: 'A',
    scope: { json: '=jsonHumanHelper' },
    templateUrl: 'template/angular-json-human.tmpl',
    compile: function (tElem) {
      return RecursionHelper.compile(tElem);
    }
  };
});
angular.module('yaru22.directives.jsonHuman.tmpls', []).run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('template/angular-json-human-root.tmpl', '<table class=jh-root ng-class="{\n' + '         \'jh-type-array\': isArray,\n' + '         \'jh-type-object\': isObject\n' + '       }" json-human-helper=json></table>');
    $templateCache.put('template/angular-json-human.tmpl', '<span ng-if=isPrimitive ng-class="{\n' + '        \'jh-type-bool\': isBoolean,\n' + '        \'jh-type-number\': isNumber,\n' + '        \'jh-type-string\': isString,\n' + '        \'jh-type-array\': isArray,\n' + '        \'jh-type-object\': isObject\n' + '        }">{{ json }} <span ng-if="isEmpty && isString" class=jh-empty>(Empty String)</span></span> <span ng-if="isEmpty && isArray" class=jh-empty>(Empty List)</span> <span ng-if="isEmpty && isObject" class=jh-empty>(Empty Object)</span><table ng-if="!isEmpty && !isPrimitive" ng-class="{\n' + '         \'jh-type-array\': isArray,\n' + '         \'jh-type-object\': isObject\n' + '       }"><tbody><tr ng-repeat="(key, val) in json"><th class=jh-key ng-class="{\n' + '          \'jh-array-key\': isArray,\n' + '          \'jh-object-key\': isObject\n' + '        }">{{ key }}</th><td class=jh-value ng-class="{\n' + '          \'jh-array-value\': isArray,\n' + '          \'jh-object-value\': isObject\n' + '        }" json-human-helper=val></td></tr></tbody></table>');
  }
]);