(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!**********************************************************************!*\
  !*** /Users/zdxx/Documents/HBuilderProjects/dcloud-check/pages.json ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),
/* 7 */
/*!***************************************************************************************!*\
  !*** /Users/zdxx/Documents/HBuilderProjects/dcloud-check/pages.json?{"type":"style"} ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/home/home": { "navigationBarTitleText": "京东超市" }, "pages/index/index": {}, "pages/basics/layout": {}, "pages/basics/background": {}, "pages/basics/text": {}, "pages/basics/icon": {}, "pages/basics/button": {}, "pages/basics/design": {}, "pages/basics/tag": {}, "pages/basics/avatar": {}, "pages/basics/progress": {}, "pages/basics/shadow": {}, "pages/basics/loading": {}, "pages/component/bar": {}, "pages/component/nav": {}, "pages/component/list": {}, "pages/component/card": {}, "pages/component/form": {}, "pages/component/timeline": {}, "pages/component/chat": {}, "pages/component/swiper": {}, "pages/component/modal": {}, "pages/component/steps": {}, "pages/plugin/indexes": {}, "pages/plugin/animation": {}, "pages/plugin/drawer": {}, "pages/plugin/verticalnav": {}, "pages/detail/detail": {}, "pages/order/order": {}, "pages/pay/pay": {} }, "globalStyle": { "navigationBarBackgroundColor": "#FFFFFF", "navigationBarTitleText": "ColorUi for UniApp", "navigationBarTextStyle": "black" } };exports.default = _default;

/***/ }),
/* 8 */
/*!**************************************************************************************!*\
  !*** /Users/zdxx/Documents/HBuilderProjects/dcloud-check/pages.json?{"type":"stat"} ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__15699AD" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 15 */
/*!*************************************************************************!*\
  !*** /Users/zdxx/Documents/HBuilderProjects/dcloud-check/mock/index.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _home_smt_index = _interopRequireDefault(__webpack_require__(/*! ./home_smt_index.js */ 16));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

{
  homeSmtIndex: _home_smt_index.default };exports.default = _default;

/***/ }),
/* 16 */
/*!**********************************************************************************!*\
  !*** /Users/zdxx/Documents/HBuilderProjects/dcloud-check/mock/home_smt_index.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  "floorList": [{
    "adsList": [{
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "5901318369",
      "advertName": "",
      "biInfo": "5##",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/3VfsEcyB8iwbU6WayfNUSuG6WUga/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/3VfsEcyB8iwbU6WayfNUSuG6WUga/index.html",
      "picHeight": 849,
      "picWidth": 1125,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/106188/38/18961/117461/5e99a1d9E81198b4c/4dd7afc34f33b279.jpg",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "5901318887",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#20279678",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/2v1S1wu5QCKwvrQibhnJaU7JUFGe/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/2v1S1wu5QCKwvrQibhnJaU7JUFGe/index.html",
      "picHeight": 849,
      "picWidth": 1125,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/118682/37/1559/168498/5e99a073E7ec76194/cf99d1a49cf1b345.jpg",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "5901318826",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#20279678",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://prodev.m.jd.com/mall/active/CZaa8uXzhG44FGRneS7EfUDnGW9/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://prodev.m.jd.com/mall/active/CZaa8uXzhG44FGRneS7EfUDnGW9/index.html",
      "picHeight": 849,
      "picWidth": 1125,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/119469/24/194/153171/5e998054Ef8219c95/10ec174f028d6712.jpg",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "5901316929",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#20279678",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://prodev.m.jd.com/mall/active/4AAaqXaAJDsNjfyC2uUMYFXz7995/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://prodev.m.jd.com/mall/active/4AAaqXaAJDsNjfyC2uUMYFXz7995/index.html",
      "picHeight": 849,
      "picWidth": 1125,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/105871/1/18307/204708/5e940207Eedbfce8c/ef1b60708cbe87fd.jpg",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "5901319240",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#20279678",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/t66iQ75xQsPhagnFzut6Wp7SEsE/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/t66iQ75xQsPhagnFzut6Wp7SEsE/index.html",
      "picHeight": 849,
      "picWidth": 1125,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/116917/37/1781/168169/5e9bcf15E3af1a617/f368d6039e75b39c.jpg",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "5901318372",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#20279678",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/G6dB2UyBBfwfTVCBp3iMQQQ6GHi/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/G6dB2UyBBfwfTVCBp3iMQQQ6GHi/index.html",
      "picHeight": 849,
      "picWidth": 1125,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/107741/23/12597/69059/5e97f8cdE0bcf9f6a/768f5f15253f7891.jpg",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "5901318825",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#20279678",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/2aUddMwTson2gZJ1HGTQ9vdYR6pe/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/2aUddMwTson2gZJ1HGTQ9vdYR6pe/index.html",
      "picHeight": 849,
      "picWidth": 1125,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/115605/27/1570/121244/5e9987caE631ed643/55965dd1286bc578.jpg",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "每周壹选",
      "advertContent": "",
      "advertDes": "",
      "advertId": "5901317373",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#20279678",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/3dVSNaJTEyd3uzwneeKGgDYVrSRL/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/3dVSNaJTEyd3uzwneeKGgDYVrSRL/index.html",
      "picHeight": 849,
      "picWidth": 1125,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/100713/35/18511/169287/5e9666fcE5f776e34/dac82d796c386674.jpg",
      "skuId": "",
      "skuImg": "" }],

    "advertId": "",
    "advertIdOne": "02974924",
    "advertIdTwo": "",
    "backgroundColor": "",
    "backgroundImg": "",
    "bgImgHeight": "",
    "bgImgWidth": "",
    "biImpr": "",
    "initSuccess": true,
    "moduleId": "ADWHEEL",
    "seatNumOneList": [],
    "seatNumTwoList": [],
    "template": "AD_WHEEL",
    "textColor": "",
    "title": "",
    "valid": true },
  {
    "adsList": [],
    "advertId": "",
    "backgroundColor": "",
    "backgroundImg": "https://m.360buyimg.com/mobilecms/jfs/t1/103336/11/5890/19179/5df07569E8235af3a/3073329f5457c8a6.png",
    "bgImgHeight": "90",
    "bgImgWidth": "1125",
    "biImpr": "",
    "initSuccess": true,
    "moduleId": "USEREDUCATION",
    "template": "USER_EDUCATION",
    "textColor": "",
    "title": "" },
  {
    "adsList": [{
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088762",
      "advertName": "时令生鲜",
      "biInfo": "5##",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/4P9a2T9osR9JvtzHVaYTPvsecRtg/index.html?getSource=JDMarket" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/4P9a2T9osR9JvtzHVaYTPvsecRtg/index.html?getSource=JDMarket",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/105826/27/7048/40960/5df83a22E4e73e96e/53a233c1a320c928.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088785",
      "advertName": "天天果园",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/ZJcqrqViBKv51xD1couKirhbZra/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/ZJcqrqViBKv51xD1couKirhbZra/index.html",
      "picHeight": 171,
      "picWidth": 173,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/35563/12/5950/16361/5cc15c2fE3d7b6743/b09d9a7ee4c7d929.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088783",
      "advertName": "儿童玩具",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/2PL19AXE6TCeWosQ7KJoeCx3L1ZV/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/2PL19AXE6TCeWosQ7KJoeCx3L1ZV/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/38777/27/2526/9205/5cc15c1aEb94f4902/30b087c1e9287843.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088795",
      "advertName": "宠物生活",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/2TY2j1yJ9T2QKiQekTpHgvv68HiD/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/2TY2j1yJ9T2QKiQekTpHgvv68HiD/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/34205/16/5920/14749/5cc15c6fEab13cec6/8f6364036301d64f.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088777",
      "advertName": "居家用品",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/47UmSL8NGbttpF9abUtHPV6bCiDn/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/47UmSL8NGbttpF9abUtHPV6bCiDn/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/75339/9/12379/38811/5d9c635bEbc58ba2e/9a5e2b7277c505e6.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088767",
      "advertName": "1小时达",
      "biInfo": "5##",
      "floatTop": false,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://daojia.jd.com/html/index.html?jdreactkey=JDReactDaoJia&jdreactapp=JDReactDaoJia&rn_ishidden=true&rn_transparentenable=true&rn_channel_name=jdapp_jdcs_icon&channel=jdapp_jdcs_icon" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://daojia.jd.com/html/index.html?jdreactkey=JDReactDaoJia&jdreactapp=JDReactDaoJia&rn_ishidden=true&rn_transparentenable=true&rn_channel_name=jdapp_jdcs_icon&channel=jdapp_jdcs_icon",
      "picHeight": 126,
      "picWidth": 126,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/96917/31/7072/23847/5df84af5E0c22509b/b6979d69d9000aa3.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088768",
      "advertName": "山姆会员店",
      "biInfo": "5##",
      "floatTop": false,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://shop.m.jd.com/?shopId=598847" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://shop.m.jd.com/?shopId=598847",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/34674/34/5893/5394/5cc15b88Eabf3078d/221095402d71717b.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088769",
      "advertName": "沃尔玛",
      "biInfo": "5##",
      "floatTop": false,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://shop.m.jd.com/?shopId=659016" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://shop.m.jd.com/?shopId=659016",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/36542/16/5886/5110/5cc15b90E151c7d96/b8e7542a04d091ec.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088794",
      "advertName": "小家电馆",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/7Ji38k7sN5MoXcpdeJAsLcxq3pa/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/7Ji38k7sN5MoXcpdeJAsLcxq3pa/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/32821/15/14543/10570/5cc15c68E334fb828/66377d4bd676e7eb.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701241920",
      "advertName": "PLUS专享",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://h5.m.jd.com/dev/RLVegkgjdNJoM4Y1WsvAnKLD7Qw/index.html?appurl=https%3A%2F%2Fshop.m.jd.com%3FshopId%3D1000281625" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://h5.m.jd.com/dev/RLVegkgjdNJoM4Y1WsvAnKLD7Qw/index.html?appurl=https%3A%2F%2Fshop.m.jd.com%3FshopId%3D1000281625",
      "picHeight": 172,
      "picWidth": 172,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/72037/28/13425/9799/5da998b9Eef93f6d2/9e2e37edf6b9c573.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701091697",
      "advertName": "童装童鞋",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/3B7hLxH1KhLSeBRUQ5c7QWdJ7dZw/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/3B7hLxH1KhLSeBRUQ5c7QWdJ7dZw/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/32783/1/15308/10861/5cc15ca4Ea45dc5de/2d3a9fd009c571b7.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088772",
      "advertName": "厨具用品",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/FgjdWz1vWQr1nwbbBTBcZWM6UD7/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/FgjdWz1vWQr1nwbbBTBcZWM6UD7/index.html",
      "picHeight": 120,
      "picWidth": 120,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/56539/33/12934/23420/5d9c634dE530975e5/38774e32b01dbe38.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088770",
      "advertName": "尿裤湿巾",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/2pRYifewevV1h1y2aEhCqYN7jA3F/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/2pRYifewevV1h1y2aEhCqYN7jA3F/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/40131/29/2505/10619/5cc15b99E216e9703/b8d27bf87aed10f5.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088766",
      "advertName": "牛奶水饮",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/3QFRdjyA6LULPV2fFgx1sYSU7c1z/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/3QFRdjyA6LULPV2fFgx1sYSU7c1z/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/98146/37/11421/8587/5e39052fE5e359718/692aae9a56f72cf2.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088763",
      "advertName": "中外名酒",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/i1vvh2Z1Sh9P2FDqqufDFsqxSEs/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/i1vvh2Z1Sh9P2FDqqufDFsqxSEs/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/92445/6/17157/33501/5e82fe4bE023dc1dc/7ecd0c202cd43234.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088779",
      "advertName": "坚果蜜饯",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/47ZS9pTjjTEx7QYy3RzGaBtFayRh/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/47ZS9pTjjTEx7QYy3RzGaBtFayRh/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/100729/7/10947/47349/5e266219Ef8372764/6030b449234653c2.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088764",
      "advertName": "纸品湿巾",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/9PQsHPEfzgKeqcjEKxhhqnJVbQW/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/9PQsHPEfzgKeqcjEKxhhqnJVbQW/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/30338/3/15390/11239/5cc15b64E37fe1f00/4923aa5eeddc6474.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088780",
      "advertName": "冲饮速食",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/Rvi2m6xtorPKcKNHU5bgK7mELAh/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/Rvi2m6xtorPKcKNHU5bgK7mELAh/index.html",
      "picHeight": 120,
      "picWidth": 120,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/76271/22/6434/23352/5d48e9e4E10d7f212/6cac616737d79a8a.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088800",
      "advertName": "孕产用品",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#11859966",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/367twg4e9mTW6AbNc81zSUSfVDsT/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/367twg4e9mTW6AbNc81zSUSfVDsT/index.html",
      "picHeight": 171,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/34290/26/5886/13419/5cc15c85E736aaf71/2acdd8e1afedfbb0.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "",
      "advertContent": "",
      "advertDes": "",
      "advertId": "1701088781",
      "advertName": "全部分类",
      "biInfo": "5##",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/S8RpbVofzfi9KCzYi7H9vMr5ueD/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/S8RpbVofzfi9KCzYi7H9vMr5ueD/index.html",
      "picHeight": 173,
      "picWidth": 171,
      "pictureUrl": "http://m.360buyimg.com/babel/jfs/t1/40646/9/278/8268/5cc15c0bE9c52f2c5/ff602abd58528f49.png",
      "skuId": "",
      "skuImg": "" }],

    "advertId": "02924500",
    "backgroundColor": "#ffffff",
    "backgroundImg": "",
    "backgroundType": "color",
    "bgImgHeight": "",
    "bgImgWidth": "",
    "biImpr": "",
    "initSuccess": true,
    "moduleId": "QUICKENTRY",
    "template": "QUICK_ENTRY",
    "textColor": "#000000",
    "title": "",
    "valid": true },
  {
    "adsList": [],
    "advertId": "",
    "backgroundColor": "",
    "backgroundImg": "",
    "bgImgHeight": "",
    "bgImgWidth": "",
    "biImpr": "",
    "coupons": [{
      "activityBeginTime": 1586707200000,
      "activityEndTime": 1588262399000,
      "activityId": 589,
      "activityType": 1,
      "batchCount": 1800000,
      "batchId": 301642842,
      "beginTime": 1586707200000,
      "beginVersion": "0.0.0",
      "couponCount": 1,
      "couponNum": 1,
      "couponRow": 1,
      "couponTitle": "4.13-4.30宝洁洗护发满11减10优惠券-A",
      "couponType": 1,
      "couponUrl": "//coupon.jd.com/ilink/couponActiveFront/front_index.action?key=da3fb27b65e84f3499f08143147277dd&roleId=29775499&to=https://pro.jd.com/mall/active/4RJ2Ae2S9zCihUgU2Cbx8nn9rbVL/index.html",
      "createTime": 1587104414000,
      "creator": "bjhuangbaoying",
      "discount": 10.0,
      "discountType": 0,
      "endTime": 1588262399000,
      "endVersion": "9.9.9",
      "id": 3284,
      "isBi": 0,
      "limitStr": "仅可购买宝洁洗护发部分商品",
      "link": "",
      "localActivityBeginTime": 1587139200000,
      "localActivityEndTime": 1588262399000,
      "nowCount": 0,
      "operationLanguage": "新客专享",
      "operator": "yuxiaoxian",
      "quota": 11.0,
      "ruleId": 29775499,
      "ruleKey": "da3fb27b65e84f3499f08143147277dd",
      "ruleUrl": "https://search.jd.com/Search?coupon_batch=301642842",
      "status": 1,
      "updateTime": 1587104414000 },
    {
      "activityBeginTime": 1587225600000,
      "activityEndTime": 1587646616000,
      "activityId": 585,
      "activityType": 0,
      "batchCount": 500000,
      "batchId": 81121669,
      "beginTime": 1587312000000,
      "beginVersion": "0.0.0",
      "couponCount": 3,
      "couponNum": 1,
      "couponRow": 1,
      "couponTitle": "4月20日超市券",
      "couponType": 0,
      "couponUrl": "",
      "createTime": 1586953842000,
      "creator": "pop-17934",
      "discount": 210.0,
      "discountType": 0,
      "endTime": 1587657599000,
      "endVersion": "9.9.9",
      "id": 3272,
      "isBi": 0,
      "limitStr": "限购  [百草味品牌旗舰店] 店铺部分商品",
      "link": "",
      "localActivityBeginTime": 1587312000000,
      "localActivityEndTime": 1587398399000,
      "nowCount": 0,
      "operationLanguage": "",
      "operator": "daiyang1_yhd",
      "quota": 300.0,
      "ruleId": 29815814,
      "ruleKey": "7a8bc6f60b8b4de2bb6a5cddbf8b6ea6",
      "ruleUrl": "https://search.jd.com/Search?coupon_batch=81121669",
      "status": 1,
      "updateTime": 1587346132000 },
    {
      "activityBeginTime": 1587312000000,
      "activityEndTime": 1587398399000,
      "activityId": 585,
      "activityType": 0,
      "batchCount": 500000,
      "batchId": 303432314,
      "beginTime": 1587312000000,
      "beginVersion": "0.0.0",
      "couponCount": 3,
      "couponNum": 2,
      "couponRow": 1,
      "couponTitle": "4.20奶粉满399打9折",
      "couponType": 0,
      "couponUrl": "",
      "createTime": 1586953842000,
      "creator": "shangjiayu",
      "discount": 0.9,
      "discountType": 1,
      "endTime": 1587398399000,
      "endVersion": "9.9.9",
      "id": 3273,
      "isBi": 0,
      "limitStr": "仅可购买奶粉辅食部分商品",
      "link": "",
      "localActivityBeginTime": 1587312000000,
      "localActivityEndTime": 1587398399000,
      "nowCount": 0,
      "operationLanguage": "",
      "operator": "daiyang1_yhd",
      "quota": 399.0,
      "ruleId": 29893519,
      "ruleKey": "d067d80b284f4cb3b01b14015268a41e",
      "ruleUrl": "https://search.jd.com/Search?coupon_batch=303432314",
      "status": 1,
      "updateTime": 1587346132000 },
    {
      "activityBeginTime": 1587225600000,
      "activityEndTime": 1587398399000,
      "activityId": 585,
      "activityType": 0,
      "batchCount": 2000000,
      "batchId": 302832086,
      "beginTime": 1587312000000,
      "beginVersion": "0.0.0",
      "couponCount": 3,
      "couponNum": 3,
      "couponRow": 1,
      "couponTitle": "4.20自营联合领券199减100",
      "couponType": 0,
      "couponUrl": "",
      "createTime": 1586953842000,
      "creator": "zhangerni",
      "discount": 100.0,
      "discountType": 0,
      "endTime": 1587398399000,
      "endVersion": "9.9.9",
      "id": 3274,
      "isBi": 0,
      "limitStr": "仅可购买母婴、玩具、粮油、宠物部分自营商品",
      "link": "",
      "localActivityBeginTime": 1587312000000,
      "localActivityEndTime": 1587398399000,
      "nowCount": 0,
      "operationLanguage": "",
      "operator": "daiyang1_yhd",
      "quota": 199.0,
      "ruleId": 29875676,
      "ruleKey": "1912d874ac7946abac00ed3c543e6679",
      "ruleUrl": "https://search.jd.com/Search?coupon_batch=302832086",
      "status": 1,
      "updateTime": 1587346132000 },
    {
      "activityBeginTime": 1587312000000,
      "activityEndTime": 1587398399000,
      "activityId": 585,
      "activityType": 0,
      "batchId": 0,
      "beginVersion": "0.0.0",
      "couponCount": 3,
      "couponNum": 1,
      "couponRow": 2,
      "couponTitle": "",
      "couponType": 0,
      "couponUrl": "",
      "createTime": 1586953852000,
      "creator": "",
      "discountType": 0,
      "endVersion": "9.9.9",
      "id": 3275,
      "isBi": 1,
      "limitStr": "",
      "link": "",
      "localActivityBeginTime": 1587312000000,
      "localActivityEndTime": 1587398399000,
      "operationLanguage": "",
      "operator": "daiyang1_yhd",
      "ruleId": 0,
      "ruleKey": "0",
      "ruleUrl": "",
      "status": 1,
      "updateTime": 1586953852000 },
    {
      "activityBeginTime": 1587312000000,
      "activityEndTime": 1587398399000,
      "activityId": 585,
      "activityType": 0,
      "batchId": 0,
      "beginVersion": "0.0.0",
      "couponCount": 3,
      "couponNum": 2,
      "couponRow": 2,
      "couponTitle": "",
      "couponType": 0,
      "couponUrl": "",
      "createTime": 1586953852000,
      "creator": "",
      "discountType": 0,
      "endVersion": "9.9.9",
      "id": 3276,
      "isBi": 1,
      "limitStr": "",
      "link": "",
      "localActivityBeginTime": 1587312000000,
      "localActivityEndTime": 1587398399000,
      "operationLanguage": "",
      "operator": "daiyang1_yhd",
      "ruleId": 0,
      "ruleKey": "0",
      "ruleUrl": "",
      "status": 1,
      "updateTime": 1586953852000 },
    {
      "activityBeginTime": 1587312000000,
      "activityEndTime": 1587398399000,
      "activityId": 585,
      "activityType": 0,
      "batchId": 0,
      "beginVersion": "0.0.0",
      "couponCount": 3,
      "couponNum": 3,
      "couponRow": 2,
      "couponTitle": "",
      "couponType": 0,
      "couponUrl": "",
      "createTime": 1586953852000,
      "creator": "",
      "discountType": 0,
      "endVersion": "9.9.9",
      "id": 3277,
      "isBi": 1,
      "limitStr": "",
      "link": "",
      "localActivityBeginTime": 1587312000000,
      "localActivityEndTime": 1587398399000,
      "operationLanguage": "",
      "operator": "daiyang1_yhd",
      "ruleId": 0,
      "ruleKey": "0",
      "ruleUrl": "",
      "status": 1,
      "updateTime": 1586953852000 }],

    "data": [
    [{
      "activityBeginTime": 1587225600000,
      "activityEndTime": 1587646616000,
      "activityType": 0,
      "batchId": 81121669,
      "beginTime": 1587312000000,
      "couponStatus": 1,
      "couponType": 0,
      "discount": 210.0,
      "discountType": 0,
      "endTime": 1587657599000,
      "isBi": 0,
      "jump": {
        "des": "productList",
        "params": {
          "from": "couponBatch",
          "sourceValue": "",
          "couponId": "81121669",
          "intel": "38",
          "sourceType": "PCUBE_CHANNEL" },

        "srv": "" },

      "limitStr": "限购  [百草味品牌旗舰店] 店铺部分商品",
      "link": "",
      "operationLanguage": "",
      "quota": 300.0,
      "ruleId": 29815814,
      "ruleKey": "7a8bc6f60b8b4de2bb6a5cddbf8b6ea6" },
    {
      "activityBeginTime": 1587312000000,
      "activityEndTime": 1587398399000,
      "activityType": 0,
      "batchId": 303432314,
      "beginTime": 1587312000000,
      "couponStatus": 1,
      "couponType": 0,
      "discount": 0.9,
      "discountType": 1,
      "endTime": 1587398399000,
      "isBi": 0,
      "jump": {
        "des": "productList",
        "params": {
          "from": "couponBatch",
          "sourceValue": "",
          "couponId": "303432314",
          "intel": "38",
          "sourceType": "PCUBE_CHANNEL" },

        "srv": "" },

      "limitStr": "仅可购买奶粉辅食部分商品",
      "link": "",
      "operationLanguage": "",
      "quota": 399.0,
      "ruleId": 29893519,
      "ruleKey": "d067d80b284f4cb3b01b14015268a41e" },
    {
      "activityBeginTime": 1587225600000,
      "activityEndTime": 1587398399000,
      "activityType": 0,
      "batchId": 302832086,
      "beginTime": 1587312000000,
      "couponStatus": 1,
      "couponType": 0,
      "discount": 100.0,
      "discountType": 0,
      "endTime": 1587398399000,
      "isBi": 0,
      "jump": {
        "des": "productList",
        "params": {
          "from": "couponBatch",
          "sourceValue": "",
          "couponId": "302832086",
          "intel": "38",
          "sourceType": "PCUBE_CHANNEL" },

        "srv": "" },

      "limitStr": "仅可购买母婴、玩具、粮油、宠物部分自营商品",
      "link": "",
      "operationLanguage": "",
      "quota": 199.0,
      "ruleId": 29875676,
      "ruleKey": "1912d874ac7946abac00ed3c543e6679" }],

    [{
      "activityBeginTime": 1587312000000,
      "activityEndTime": 1587398399000,
      "activityType": 0,
      "batchId": 302374150,
      "couponStatus": 1,
      "couponType": 0,
      "discount": 0.88,
      "discountType": 1,
      "isBi": 1,
      "jump": {
        "des": "productList",
        "params": {
          "from": "couponBatch",
          "sourceValue": "",
          "couponId": "302374150",
          "intel": "38",
          "sourceType": "PCUBE_CHANNEL" },

        "srv": "" },

      "limitStr": "仅可购买母婴自营品类指定商品",
      "link": "",
      "operationLanguage": "",
      "quota": 99.0,
      "ruleId": 29637637,
      "ruleKey": "921ed98af6214d77913a7c78a33efaba" },
    {
      "activityBeginTime": 1587312000000,
      "activityEndTime": 1587398399000,
      "activityType": 0,
      "batchId": 301994274,
      "couponStatus": 1,
      "couponType": 0,
      "discount": 15.0,
      "discountType": 0,
      "isBi": 1,
      "jump": {
        "des": "productList",
        "params": {
          "from": "couponBatch",
          "sourceValue": "",
          "couponId": "301994274",
          "intel": "38",
          "sourceType": "PCUBE_CHANNEL" },

        "srv": "" },

      "limitStr": "仅可购买时尚、居家、运动部分商品",
      "link": "",
      "operationLanguage": "",
      "quota": 99.0,
      "ruleId": 29203331,
      "ruleKey": "ffdc2ece821b4e279d0527caa55bbff8" },
    {
      "activityBeginTime": 1587312000000,
      "activityEndTime": 1587398399000,
      "activityType": 0,
      "batchId": 301627322,
      "couponStatus": 1,
      "couponType": 0,
      "discount": 40.0,
      "discountType": 0,
      "isBi": 1,
      "jump": {
        "des": "productList",
        "params": {
          "from": "couponBatch",
          "sourceValue": "",
          "couponId": "301627322",
          "intel": "38",
          "sourceType": "PCUBE_CHANNEL" },

        "srv": "" },

      "limitStr": "仅可购买生鲜部分商品",
      "link": "",
      "operationLanguage": "",
      "quota": 139.0,
      "ruleId": 29620635,
      "ruleKey": "e4c22dfec32e45ecbd0f2d20df1544ff" }]],


    "initSuccess": true,
    "moduleId": "COUPONELEMENT",
    "now": 1587351936988,
    "template": "COUPON_ELEMENT",
    "textColor": "",
    "title": "",
    "valid": true },
  {
    "adsList": [],
    "advertId": "",
    "backgroundColor": "",
    "backgroundImg": "",
    "bgImgHeight": "",
    "bgImgWidth": "",
    "biImpr": "",
    "floorTitle": {
      "backgroundImg": "https://m.360buyimg.com/deepvisual/jfs/t1/48613/28/10555/13970/5d776989E5ba07fd0/c608f3ce00f3ae2d.png",
      "clickMore": "更多",
      "jump": {
        "des": "m",
        "params": {
          "url": "https://pro.m.jd.com/mall/active/42hnfmo6eBh2fsxovPuXsm3qLyfJ/index.html" },

        "srv": "" },

      "link": "https://pro.m.jd.com/mall/active/42hnfmo6eBh2fsxovPuXsm3qLyfJ/index.html",
      "name": "超市抢购",
      "subTitle": "拼手速抢惊喜" },

    "groupId": "12189169",
    "initSuccess": true,
    "jump": {
      "des": "m",
      "params": {
        "url": "https://pro.m.jd.com/mall/active/42hnfmo6eBh2fsxovPuXsm3qLyfJ/index.html" },

      "srv": "" },

    "moduleId": "RUSHBUY",
    "template": "RUSH_BUY",
    "textColor": "",
    "title": "",
    "valid": true,
    "waresList": [{
      "groupInfoList": [{
        "goodRate": "7",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/76324/40/1818/432310/5d01f167E7b5891e7/0fa27a4313f4e4c8.jpg",
        "jdPrice": "53.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/76324/40/1818/432310/5d01f167E7b5891e7/0fa27a4313f4e4c8.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100004922150\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "洪湖渔家 麻辣小龙虾虾尾 虾球 500g 75-90尾 火锅食材 海鲜水产" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "69",
        "name": "洪湖渔家 麻辣小龙虾虾尾 虾球 500g 75-90尾 火锅食材 海鲜水产",
        "pPrice": "53.9",
        "pcpPrice": "69",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/76324/40/1818/432310/5d01f167E7b5891e7/0fa27a4313f4e4c8.jpg",
        "promoPrice": "53.9",
        "promoStatus": "E2",
        "shopId": 1000105496,
        "shopName": "洪湖渔家京东自营旗舰店",
        "skuId": "100004922150" },
      {
        "goodRate": "98%",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/56890/15/2423/764190/5d037c5bE27db976f/13bd21dce292b877.jpg",
        "jdPrice": "89",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/56890/15/2423/764190/5d037c5bE27db976f/13bd21dce292b877.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100005099114\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "都乐事 披萨家庭套装5片装 900g 3种经典口味 自营烘焙面点 精选芝士奶酪披萨半成品" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "119",
        "name": "都乐事 披萨家庭套装5片装 900g 3种经典口味 自营烘焙面点 精选芝士奶酪披萨半成品",
        "pPrice": "89",
        "pcpPrice": "119",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/56890/15/2423/764190/5d037c5bE27db976f/13bd21dce292b877.jpg",
        "promoPrice": "89",
        "promoStatus": "E2",
        "shopId": 1000146510,
        "shopName": "都乐事（DOULESHI）京东自营旗舰店",
        "skuId": "100005099114" },
      {
        "goodRate": "15",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/107163/20/8554/251710/5e699c90Ee807a21e/789cecfbb06a4400.jpg",
        "jdPrice": "125",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/107163/20/8554/251710/5e699c90Ee807a21e/789cecfbb06a4400.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100008100472\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "施华蔻(Schwarzkopf)斐丝丽泡泡染发乳双支装(6-11/9蜜糖醇棕*2)(染发剂染发膏泡沫 男士女士）" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "178",
        "name": "施华蔻(Schwarzkopf)斐丝丽泡泡染发乳双支装(6-11/9蜜糖醇棕*2)(染发剂染发膏泡沫 男士女士）",
        "pPrice": "125",
        "pcpPrice": "178",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/107163/20/8554/251710/5e699c90Ee807a21e/789cecfbb06a4400.jpg",
        "promoPrice": "125",
        "promoStatus": "E2",
        "shopId": 1000005754,
        "shopName": "施华蔻京东自营官方旗舰店",
        "skuId": "100008100472" },
      {
        "goodRate": "98%",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/70475/39/10842/128531/5d85f10eE81b2cb6f/7affc0bef3767d66.jpg",
        "jdPrice": "39.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/70475/39/10842/128531/5d85f10eE81b2cb6f/7affc0bef3767d66.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"8734273\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "晋州长城 一级黄冠梨 净重10斤 梨子 新鲜水果" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "69.9",
        "name": "晋州长城 一级黄冠梨 净重10斤 梨子 新鲜水果",
        "pPrice": "39.9",
        "pcpPrice": "69.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/70475/39/10842/128531/5d85f10eE81b2cb6f/7affc0bef3767d66.jpg",
        "promoPrice": "39.9",
        "promoStatus": "E2",
        "shopId": 1000013923,
        "shopName": "水果京东自营专区",
        "skuId": "8734273" },
      {
        "goodRate": "99%",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t25750/203/1388007126/4938198/4dddb2f2/5bb05e29N9f7f6ef4.jpg",
        "jdPrice": "28.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t25750/203/1388007126/4938198/4dddb2f2/5bb05e29N9f7f6ef4.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"859557\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "喜之郎 蜜桔果肉果冻 布丁下午茶零食 990g加送30g 量贩分享装" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "29.9",
        "name": "喜之郎 蜜桔果肉果冻 布丁下午茶零食 990g加送30g 量贩分享装",
        "pPrice": "28.9",
        "pcpPrice": "29.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t25750/203/1388007126/4938198/4dddb2f2/5bb05e29N9f7f6ef4.jpg",
        "promoPrice": "28.9",
        "promoStatus": "E2",
        "shopId": 1000100238,
        "shopName": "喜之郎京东自营旗舰店",
        "skuId": "859557" },
      {
        "goodRate": "30",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/34979/28/11999/376811/5d00532cEe8dcb8c2/613581b2134fc735.jpg",
        "jdPrice": "109",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/34979/28/11999/376811/5d00532cEe8dcb8c2/613581b2134fc735.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"7127904\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "【京东出品】八享时手撕牛肉干400g 风干牛肉 清真食品 真材实料 休闲零食大礼包 即食食品" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "159",
        "name": "【京东出品】八享时手撕牛肉干400g 风干牛肉 清真食品 真材实料 休闲零食大礼包 即食食品",
        "pPrice": "109",
        "pcpPrice": "159",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/34979/28/11999/376811/5d00532cEe8dcb8c2/613581b2134fc735.jpg",
        "promoPrice": "118",
        "promoStatus": "E2",
        "shopId": 1000077082,
        "shopName": "八享时京东自营旗舰店",
        "skuId": "7127904" },
      {
        "goodRate": "15",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/87000/30/1781/322650/5dc57039E6ceea0f5/577452a451381b1e.jpg",
        "jdPrice": "15.5",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/87000/30/1781/322650/5dc57039E6ceea0f5/577452a451381b1e.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100003865337\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "LT DUCK 小黄鸭【1条装】婴儿吸汗巾 宝宝隔汗巾 彩棉儿童垫背巾 男女宝宝四季皆宜" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "19.8",
        "name": "LT DUCK 小黄鸭【1条装】婴儿吸汗巾 宝宝隔汗巾 彩棉儿童垫背巾 男女宝宝四季皆宜",
        "pPrice": "15.5",
        "pcpPrice": "19.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/87000/30/1781/322650/5dc57039E6ceea0f5/577452a451381b1e.jpg",
        "promoPrice": "15.5",
        "promoStatus": "E2",
        "shopId": 1000224113,
        "shopName": "LT DUCK母婴京东自营旗舰店",
        "skuId": "100003865337" },
      {
        "goodRate": "98%",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/108411/16/12604/395763/5e98084fE83202b4a/c61f5b11399bb78d.jpg",
        "jdPrice": "17.4",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/108411/16/12604/395763/5e98084fE83202b4a/c61f5b11399bb78d.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100008837818\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "玄谷村 0零添加 原味寿司海苔 食材工具(10张送寿司帘) 非油炸无添加 寿司卷 紫菜包饭套装28g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "18.5",
        "name": "玄谷村 0零添加 原味寿司海苔 食材工具(10张送寿司帘) 非油炸无添加 寿司卷 紫菜包饭套装28g",
        "pPrice": "17.4",
        "pcpPrice": "18.5",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/108411/16/12604/395763/5e98084fE83202b4a/c61f5b11399bb78d.jpg",
        "promoPrice": "17.4",
        "promoStatus": "E2",
        "shopId": 1000282404,
        "shopName": "玄谷村京东自营旗舰店",
        "skuId": "100008837818" },
      {
        "goodRate": "7",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/94968/22/6857/142697/5df6d77eEf3743fd7/fcd963b46aee5cea.jpg",
        "jdPrice": "269",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/94968/22/6857/142697/5df6d77eEf3743fd7/fcd963b46aee5cea.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"4794829\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "飞鸽（PIGEON）儿童平衡车滑步车 2-3-9岁宝宝 玩具溜溜车滑行学步车扭扭车小孩单车儿童自行车童车 亮蓝色" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "299",
        "name": "飞鸽（PIGEON）儿童平衡车滑步车 2-3-9岁宝宝 玩具溜溜车滑行学步车扭扭车小孩单车儿童自行车童车 亮蓝色",
        "pPrice": "269",
        "pcpPrice": "299",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/94968/22/6857/142697/5df6d77eEf3743fd7/fcd963b46aee5cea.jpg",
        "promoPrice": "269",
        "promoStatus": "E2",
        "shopId": 1000076823,
        "shopName": "飞鸽自营旗舰店",
        "skuId": "4794829" },
      {
        "goodRate": "30",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/93514/16/16518/540784/5e7b15f1E7f990b2f/aa8eeacd3a22539b.jpg",
        "jdPrice": "125",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/93514/16/16518/540784/5e7b15f1E7f990b2f/aa8eeacd3a22539b.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"15825985088\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "休闲零食大礼包一整箱送女友进口食品生日礼物儿童零食巨型网红猪饲料礼盒办公室小孩好吃的男生 Kitty 粉色款（不代写卡片）" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "188",
        "name": "休闲零食大礼包一整箱送女友进口食品生日礼物儿童零食巨型网红猪饲料礼盒办公室小孩好吃的男生 Kitty 粉色款（不代写卡片）",
        "pPrice": "125",
        "pcpPrice": "188",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/93514/16/16518/540784/5e7b15f1E7f990b2f/aa8eeacd3a22539b.jpg",
        "promoPrice": "125",
        "promoStatus": "E2",
        "shopId": 707064,
        "shopName": "复琢食品专营店",
        "skuId": "15825985088" },
      {
        "goodRate": "90",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/53031/31/10297/227207/5d75f794Ec6c00d01/3e0c964390883a2b.jpg",
        "jdPrice": "146.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/53031/31/10297/227207/5d75f794Ec6c00d01/3e0c964390883a2b.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100002497906\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "杉城 休闲零食大礼包一整箱送女友女生儿童网红礼盒美食品超市好吃的组合装1800g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "163",
        "name": "杉城 休闲零食大礼包一整箱送女友女生儿童网红礼盒美食品超市好吃的组合装1800g",
        "pPrice": "146.9",
        "pcpPrice": "163",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/53031/31/10297/227207/5d75f794Ec6c00d01/3e0c964390883a2b.jpg",
        "promoPrice": "146.9",
        "promoStatus": "E2",
        "shopId": 1000102184,
        "shopName": "杉城京东自营旗舰店",
        "skuId": "100002497906" },
      {
        "goodRate": "97%",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/109505/15/12933/291092/5e99be7bE386b0c16/d0f9d8aaf587dd44.jpg",
        "jdPrice": "39.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/109505/15/12933/291092/5e99be7bE386b0c16/d0f9d8aaf587dd44.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100012375678\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "良品铺子 全麦面包 玉米奇亚籽小纤包 早餐饼干蛋糕孕妇休闲零食办公室糕点点心整箱装600g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "51.9",
        "name": "良品铺子 全麦面包 玉米奇亚籽小纤包 早餐饼干蛋糕孕妇休闲零食办公室糕点点心整箱装600g",
        "pPrice": "39.9",
        "pcpPrice": "51.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/109505/15/12933/291092/5e99be7bE386b0c16/d0f9d8aaf587dd44.jpg",
        "promoPrice": "39.9",
        "promoStatus": "E2",
        "shopId": 1000006804,
        "shopName": "良品铺子京东自营旗舰店",
        "skuId": "100012375678" },
      {
        "goodRate": "98%",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t26575/223/1308050262/395693/66e2d658/5bc69bcfN8030a03e.jpg",
        "jdPrice": "39.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t26575/223/1308050262/395693/66e2d658/5bc69bcfN8030a03e.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"5383292\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "越南进口红心火龙果 4个装 红肉中果 单果约330-420g 新鲜水果" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "79.9",
        "name": "越南进口红心火龙果 4个装 红肉中果 单果约330-420g 新鲜水果",
        "pPrice": "39.9",
        "pcpPrice": "79.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t26575/223/1308050262/395693/66e2d658/5bc69bcfN8030a03e.jpg",
        "promoPrice": "39.9",
        "promoStatus": "E2",
        "shopId": 1000013923,
        "shopName": "水果京东自营专区",
        "skuId": "5383292" },
      {
        "goodRate": "15",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t1/102446/36/16245/274042/5e7af435E6db2a9e6/b44101029597d38c.jpg",
        "jdPrice": "6.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/102446/36/16245/274042/5e7af435E6db2a9e6/b44101029597d38c.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100012137060\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "绿鲜知 香椿 约80g 仲春好物 新鲜蔬菜" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "11.8",
        "name": "绿鲜知 香椿 约80g 仲春好物 新鲜蔬菜",
        "pPrice": "6.8",
        "pcpPrice": "11.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/102446/36/16245/274042/5e7af435E6db2a9e6/b44101029597d38c.jpg",
        "promoPrice": "6.8",
        "promoStatus": "E2",
        "shopId": 1000080463,
        "shopName": "绿鲜知自营旗舰店",
        "skuId": "100012137060" },
      {
        "goodRate": "90",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t21523/103/2021411745/327838/20bda86a/5b441589N3c098d03.jpg",
        "jdPrice": "76.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t21523/103/2021411745/327838/20bda86a/5b441589N3c098d03.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"2113525\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "澳大利亚原装进口牛奶 德亚（Weidendorf）全脂纯牛奶 250ml*24盒 整箱装" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "79.9",
        "name": "澳大利亚原装进口牛奶 德亚（Weidendorf）全脂纯牛奶 250ml*24盒 整箱装",
        "pPrice": "76.9",
        "pcpPrice": "79.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t21523/103/2021411745/327838/20bda86a/5b441589N3c098d03.jpg",
        "promoPrice": "77",
        "promoStatus": "E2",
        "shopId": 1000012545,
        "shopName": "德亚牛奶京东自营旗舰店",
        "skuId": "2113525" },
      {
        "goodRate": "90",
        "hideCart": false,
        "image": "https://m.360buyimg.com/babel/jfs/t23233/12/2419877766/175821/fbe3adb5/5b7e398aN76d87839.jpg",
        "jdPrice": "39.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t23233/12/2419877766/175821/fbe3adb5/5b7e398aN76d87839.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"1265428\",\"matType\":0,\"stageId\":\"21407963\"}]",
            "title": "西域美农 新疆六星和田红枣1000g 伴手礼大枣 蜜饯果干 特产零食 孕妇食品" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "49",
        "name": "西域美农 新疆六星和田红枣1000g 伴手礼大枣 蜜饯果干 特产零食 孕妇食品",
        "pPrice": "39.9",
        "pcpPrice": "49",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t23233/12/2419877766/175821/fbe3adb5/5b7e398aN76d87839.jpg",
        "promoPrice": "39.9",
        "promoStatus": "E2",
        "shopId": 1000007573,
        "shopName": "西域美农京东自营旗舰店",
        "skuId": "1265428" }],

      "remainTime": "0",
      "stageId": "21407963",
      "stageName": "",
      "stageTime": "08:00" },
    {
      "groupInfoList": [{
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t15742/311/2276126442/130280/f2d4e460/5a9d14c8N08fca42b.jpg",
        "jdPrice": "28.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t15742/311/2276126442/130280/f2d4e460/5a9d14c8N08fca42b.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"6313760\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "新奇士Sunkist 美国进口美人柑 6粒装 单果重约130-170g 新鲜水果" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "49.9",
        "name": "新奇士Sunkist 美国进口美人柑 6粒装 单果重约130-170g 新鲜水果",
        "pPrice": "28.8",
        "pcpPrice": "49.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t15742/311/2276126442/130280/f2d4e460/5a9d14c8N08fca42b.jpg",
        "promoPrice": "27.9",
        "promoStatus": "E1",
        "shopId": 1000125528,
        "shopName": "Sunkist新奇士京东自营旗舰店",
        "skuId": "6313760" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/76670/14/11431/178128/5d8f06ebE185597bc/ba51cc6ad9578945.jpg",
        "jdPrice": "28",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/76670/14/11431/178128/5d8f06ebE185597bc/ba51cc6ad9578945.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100001614522\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "猫乐适猫用指甲剪刀 猫咪剪指甲钳 160°弯剪狗狗通用 宠物用品美容工具 CG12 白色" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "28",
        "name": "猫乐适猫用指甲剪刀 猫咪剪指甲钳 160°弯剪狗狗通用 宠物用品美容工具 CG12 白色",
        "pPrice": "28",
        "pcpPrice": "28",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/76670/14/11431/178128/5d8f06ebE185597bc/ba51cc6ad9578945.jpg",
        "promoPrice": "19.9",
        "promoStatus": "E1",
        "shopId": 1000093650,
        "shopName": "麦仕宠物京东自营旗舰店",
        "skuId": "100001614522" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t25567/343/2452187990/281885/9fc9178e/5be508a7N9e90cbc5.jpg",
        "jdPrice": "12.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t25567/343/2452187990/281885/9fc9178e/5be508a7N9e90cbc5.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"3275310\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "高洁丝Kotex 蜜桃小姐夜安裤L号2条 适合腰围 60-100cm 安心裤安睡裤内裤型卫生巾" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "12.9",
        "name": "高洁丝Kotex 蜜桃小姐夜安裤L号2条 适合腰围 60-100cm 安心裤安睡裤内裤型卫生巾",
        "pPrice": "12.9",
        "pcpPrice": "12.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t25567/343/2452187990/281885/9fc9178e/5be508a7N9e90cbc5.jpg",
        "promoPrice": "11.8",
        "promoStatus": "E1",
        "shopId": 1000002396,
        "shopName": "高洁丝京东自营官方旗舰店",
        "skuId": "3275310" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/94560/40/5536/192951/5dee0abbEeaf031ff/4552dfdd1334b34f.jpg",
        "jdPrice": "129",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/94560/40/5536/192951/5dee0abbEeaf031ff/4552dfdd1334b34f.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"8814665\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "新西兰进口牛奶 纽麦福 跑跑牛纯牛奶250ml*24盒 4.0g蛋白质 全脂高钙儿童牛奶整箱装" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "129",
        "name": "新西兰进口牛奶 纽麦福 跑跑牛纯牛奶250ml*24盒 4.0g蛋白质 全脂高钙儿童牛奶整箱装",
        "pPrice": "129",
        "pcpPrice": "129",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/94560/40/5536/192951/5dee0abbEeaf031ff/4552dfdd1334b34f.jpg",
        "promoPrice": "119",
        "promoStatus": "E1",
        "shopId": 1000074067,
        "shopName": "纽麦福京东自营旗舰店",
        "skuId": "8814665" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t2116/124/653083907/251156/4bdfcaa0/5620e335Nbc0f12ce.jpg",
        "jdPrice": "58",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t2116/124/653083907/251156/4bdfcaa0/5620e335Nbc0f12ce.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"319460\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "意大利进口 瑞士莲（Lindt）软心精选巧克力分享装200g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "58",
        "name": "意大利进口 瑞士莲（Lindt）软心精选巧克力分享装200g",
        "pPrice": "58",
        "pcpPrice": "58",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t2116/124/653083907/251156/4bdfcaa0/5620e335Nbc0f12ce.jpg",
        "promoPrice": "55",
        "promoStatus": "E1",
        "shopId": 1000081022,
        "shopName": "瑞士莲京东自营旗舰店",
        "skuId": "319460" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/22313/1/15618/338584/5cb066a3E3c98b34c/b8ba4f59b7749cfd.jpg",
        "jdPrice": "8.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/22313/1/15618/338584/5cb066a3E3c98b34c/b8ba4f59b7749cfd.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"1106017\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "母亲 休闲食品 肉干肉脯 零食 牛肉棒 牛肉干原味22g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "8.8",
        "name": "母亲 休闲食品 肉干肉脯 零食 牛肉棒 牛肉干原味22g",
        "pPrice": "8.8",
        "pcpPrice": "8.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/22313/1/15618/338584/5cb066a3E3c98b34c/b8ba4f59b7749cfd.jpg",
        "promoPrice": "8",
        "promoStatus": "E1",
        "shopId": 1000110991,
        "shopName": "养生堂食品京东自营旗舰店",
        "skuId": "1106017" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/89767/31/13922/219016/5e673b21Ea8b09985/5a749d4c8e84d865.jpg",
        "jdPrice": "169.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/89767/31/13922/219016/5e673b21Ea8b09985/5a749d4c8e84d865.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"862558\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "鲁花 食用油 5S 压榨一级 花生油 5L" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "169.9",
        "name": "鲁花 食用油 5S 压榨一级 花生油 5L",
        "pPrice": "169.9",
        "pcpPrice": "169.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/89767/31/13922/219016/5e673b21Ea8b09985/5a749d4c8e84d865.jpg",
        "promoPrice": "159.9",
        "promoStatus": "E2",
        "shopId": 1000075642,
        "shopName": "鲁花京东自营旗舰店",
        "skuId": "862558" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/71222/25/9825/241721/5d75a804E57f9d8e6/d4df51e970db2bd2.jpg",
        "jdPrice": "35.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/71222/25/9825/241721/5d75a804E57f9d8e6/d4df51e970db2bd2.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100008224722\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "俏侬  乳脂蛋挞液  蛋挞皮烘焙食材烘焙半成品 蛋挞烘焙原料 1.2kg 3袋/盒 西式烘焙 冷冻" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "35.8",
        "name": "俏侬  乳脂蛋挞液  蛋挞皮烘焙食材烘焙半成品 蛋挞烘焙原料 1.2kg 3袋/盒 西式烘焙 冷冻",
        "pPrice": "35.8",
        "pcpPrice": "35.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/71222/25/9825/241721/5d75a804E57f9d8e6/d4df51e970db2bd2.jpg",
        "promoPrice": "34.01",
        "promoStatus": "E1",
        "shopId": 1000075003,
        "shopName": "俏侬烘焙京东自营旗舰店",
        "skuId": "100008224722" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/102237/30/1062/160613/5db80b7aE15a27da2/bf97a34358ab8f32.jpg",
        "jdPrice": "129",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/102237/30/1062/160613/5db80b7aE15a27da2/bf97a34358ab8f32.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"7631441\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "京东京造 德国进口雷司令混酿半甜白葡萄酒 750ml 单支装 非红酒" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "138",
        "name": "京东京造 德国进口雷司令混酿半甜白葡萄酒 750ml 单支装 非红酒",
        "pPrice": "129",
        "pcpPrice": "138",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/102237/30/1062/160613/5db80b7aE15a27da2/bf97a34358ab8f32.jpg",
        "promoPrice": "109",
        "promoStatus": "E1",
        "shopId": 1000096602,
        "shopName": "京东京造官方旗舰店",
        "skuId": "7631441" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t17941/112/507257638/281626/40167ca6/5a8e86b2Nc09257cd.jpg",
        "jdPrice": "19.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t17941/112/507257638/281626/40167ca6/5a8e86b2Nc09257cd.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"2029527\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "泉林本色实芯卷纸 3层160节*10卷（本色卫生无芯卷纸巾 食品级检测 两种包装随机发货）" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "25.9",
        "name": "泉林本色实芯卷纸 3层160节*10卷（本色卫生无芯卷纸巾 食品级检测 两种包装随机发货）",
        "pPrice": "19.9",
        "pcpPrice": "25.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t17941/112/507257638/281626/40167ca6/5a8e86b2Nc09257cd.jpg",
        "promoPrice": "17.9",
        "promoStatus": "E1",
        "shopId": 1000001906,
        "shopName": "泉林本色京东自营旗舰店",
        "skuId": "2029527" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/108107/28/7660/278484/5e5f853cEa48c2fcf/7750df4a15af108a.jpg",
        "jdPrice": "56.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/108107/28/7660/278484/5e5f853cEa48c2fcf/7750df4a15af108a.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"10801539822\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "洁柔 卷纸卫生纸纸巾 face黑面子140g卷筒纸厕纸*27卷 整箱" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "68",
        "name": "洁��� 卷纸卫生纸纸��� face黑面子140g卷筒纸厕纸*27卷 整箱",
        "pPrice": "56.9",
        "pcpPrice": "66",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/108107/28/7660/278484/5e5f853cEa48c2fcf/7750df4a15af108a.jpg",
        "promoPrice": "55.8",
        "promoStatus": "E1",
        "shopId": 612286,
        "shopName": "骏孟清洁用品专营店",
        "skuId": "10801539822" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/88658/29/14825/343806/5e6b55c4Ef9960914/32b478f15a5b434e.jpg",
        "jdPrice": "49.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/88658/29/14825/343806/5e6b55c4Ef9960914/32b478f15a5b434e.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100002766757\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "獐子岛 冷冻精选无沙蚬子肉 500g 袋装 花甲 花蛤 海鲜 生鲜" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "78",
        "name": "獐子岛 冷冻精选无沙蚬子肉 500g 袋装 花甲 花蛤 海鲜 生鲜",
        "pPrice": "49.9",
        "pcpPrice": "78",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/88658/29/14825/343806/5e6b55c4Ef9960914/32b478f15a5b434e.jpg",
        "promoPrice": "48.9",
        "promoStatus": "E1",
        "shopId": 1000006786,
        "shopName": "獐子岛京东自营旗舰店",
        "skuId": "100002766757" },
      {
        "goodRate": "97%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/107819/19/5322/160221/5e38043bE68b72781/9b3111d4259f485f.jpg",
        "jdPrice": "75.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/107819/19/5322/160221/5e38043bE68b72781/9b3111d4259f485f.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"51784297768\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "LARGE洗衣机槽清洁泡腾片 15g*20块 家用全自动滚筒波轮杀菌消毒除垢去霉味洗衣机清洗剂 标准两盒装(可用一年)" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "99.8",
        "name": "LARGE洗衣机槽清洁泡腾片 15g*20块 家用全自动滚筒波轮杀菌消毒除垢去霉味洗衣机清洗剂 标准两盒装(可用一年)",
        "pPrice": "75.8",
        "pcpPrice": "75.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/107819/19/5322/160221/5e38043bE68b72781/9b3111d4259f485f.jpg",
        "promoPrice": "69.8",
        "promoStatus": "E1",
        "shopId": 946325,
        "shopName": "LARGE旗舰店",
        "skuId": "51784297768" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/101077/39/10047/190321/5e169fb0E3e82ca93/77387ac1eae671de.jpg",
        "jdPrice": "298",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/101077/39/10047/190321/5e169fb0E3e82ca93/77387ac1eae671de.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"63064226186\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "迪士尼 （Disney）孕妇枕护腰侧睡枕u型枕托腹枕多功能枕靠垫枕头 竖条粉" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "",
        "name": "迪士尼 （Disney）孕妇枕护腰侧睡枕u型枕托腹枕多功能枕靠垫枕头 竖条粉",
        "pPrice": "298",
        "pcpPrice": "398",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/101077/39/10047/190321/5e169fb0E3e82ca93/77387ac1eae671de.jpg",
        "promoPrice": "280",
        "promoStatus": "E1",
        "shopId": 786838,
        "shopName": "集豪官方旗舰店",
        "skuId": "63064226186" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t4609/67/2372355802/183733/de678f92/58f08d9aN0629f580.jpg",
        "jdPrice": "19.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t4609/67/2372355802/183733/de678f92/58f08d9aN0629f580.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"4298474\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "绿鲜知 余杭春笋 鲜竹笋 雷笋 约500g 仲春好物 新鲜蔬菜" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "29.8",
        "name": "绿鲜知 余杭春笋 鲜竹笋 雷笋 约500g 仲春好物 新鲜蔬菜",
        "pPrice": "19.9",
        "pcpPrice": "29.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t4609/67/2372355802/183733/de678f92/58f08d9aN0629f580.jpg",
        "promoPrice": "18.8",
        "promoStatus": "E1",
        "shopId": 1000080463,
        "shopName": "绿鲜知自营旗舰店",
        "skuId": "4298474" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/87474/26/13656/206331/5e5cccc9E28cff334/407d0a6e0928e868.jpg",
        "jdPrice": "12.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/87474/26/13656/206331/5e5cccc9E28cff334/407d0a6e0928e868.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"4960985\",\"matType\":0,\"stageId\":\"21408032\"}]",
            "title": "俏香阁 休闲零食 小吃下午茶 番茄味 爆米花100g/罐" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "15.8",
        "name": "俏香阁 休闲零食 小吃下午茶 番茄味 爆米花100g/罐",
        "pPrice": "12.8",
        "pcpPrice": "15.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/87474/26/13656/206331/5e5cccc9E28cff334/407d0a6e0928e868.jpg",
        "promoPrice": "11.9",
        "promoStatus": "E1",
        "shopId": 1000088285,
        "shopName": "俏香阁京东自营旗舰店",
        "skuId": "4960985" }],

      "remainTime": "3263010",
      "stageId": "21408032",
      "stageName": "",
      "stageTime": "12:00" },
    {
      "groupInfoList": [{
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/91483/31/9905/278784/5e1451c2E1464f74d/77c1f16f13200d0c.jpg",
        "jdPrice": "1980",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/91483/31/9905/278784/5e1451c2E1464f74d/77c1f16f13200d0c.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"5604469\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "阿布纳Abner 德国婴儿童安全座椅汽车用0-4-12岁 360度旋转可躺isofix硬接口 宇航员007（大黄蜂）" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "1980",
        "name": "阿布纳Abner 德国婴儿童安全座椅汽车用0-4-12岁 360度旋转可躺isofix硬接口 宇航员007（大黄蜂）",
        "pPrice": "1980",
        "pcpPrice": "1980",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/91483/31/9905/278784/5e1451c2E1464f74d/77c1f16f13200d0c.jpg",
        "promoPrice": "1880",
        "promoStatus": "E2",
        "shopId": 1000094430,
        "shopName": "Abner阿布纳自营官方旗舰店",
        "skuId": "5604469" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/112940/21/1606/103135/5e99e7a8Eb8dc1a6f/bab5c990a9d27b8f.jpg",
        "jdPrice": "120",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/112940/21/1606/103135/5e99e7a8Eb8dc1a6f/bab5c990a9d27b8f.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"2318947\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "高姿COGI多效修容霜 BB霜女男 保湿遮瑕防晒隔离霜 CC霜SPF30 PA++45g提亮肤色" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "120",
        "name": "高姿COGI多效修容霜 BB霜女男 保湿遮瑕防晒隔离霜 CC霜SPF30 PA++45g提亮肤色",
        "pPrice": "120",
        "pcpPrice": "120",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/112940/21/1606/103135/5e99e7a8Eb8dc1a6f/bab5c990a9d27b8f.jpg",
        "promoPrice": "75",
        "promoStatus": "E1",
        "shopId": 1000012581,
        "shopName": "COGI高姿京东自营官方旗舰店",
        "skuId": "2318947" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/49114/25/11478/152372/5d89b468Ec185ad36/50d067dab7869717.jpg",
        "jdPrice": "24.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/49114/25/11478/152372/5d89b468Ec185ad36/50d067dab7869717.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"851267\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "高洁丝Kotex 少女肌240mm18片 日用棉柔丝薄卫生巾 产品升级，新老包装随机发货" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "24.9",
        "name": "高洁丝Kotex 少女肌240mm18片 日用棉柔丝薄卫生巾 产品升级，新老包装随机发货",
        "pPrice": "24.9",
        "pcpPrice": "24.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/49114/25/11478/152372/5d89b468Ec185ad36/50d067dab7869717.jpg",
        "promoPrice": "23.8",
        "promoStatus": "E1",
        "shopId": 1000002396,
        "shopName": "高洁丝京东自营官方旗舰店",
        "skuId": "851267" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/103429/31/15075/358973/5e6f0abcE7f82f598/84d81a5533abcc9b.jpg",
        "jdPrice": "39.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/103429/31/15075/358973/5e6f0abcE7f82f598/84d81a5533abcc9b.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"1606972\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "獐子岛 冷冻整条鱿鱼 500g 3-5条 火锅烧烤食材 海鲜 生鲜" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "69.9",
        "name": "獐子岛 冷冻整条鱿鱼 500g 3-5条 火锅烧烤食材 海鲜 生鲜",
        "pPrice": "39.9",
        "pcpPrice": "69.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/103429/31/15075/358973/5e6f0abcE7f82f598/84d81a5533abcc9b.jpg",
        "promoPrice": "38.9",
        "promoStatus": "E1",
        "shopId": 1000006786,
        "shopName": "獐子岛京东自营旗舰店",
        "skuId": "1606972" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/107819/33/9168/163811/5e7030e9E3aee57cc/5a19da0113fd7490.jpg",
        "jdPrice": "69.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/107819/33/9168/163811/5e7030e9E3aee57cc/5a19da0113fd7490.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100011848482\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "首食惠 新西兰精品羔羊排 500g/盒 烧烤食材 烤羊排 生鲜羊排" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "75.9",
        "name": "首食惠 新西兰精品羔羊排 500g/盒 烧烤食材 烤羊排 生鲜羊排",
        "pPrice": "69.9",
        "pcpPrice": "75.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/107819/33/9168/163811/5e7030e9E3aee57cc/5a19da0113fd7490.jpg",
        "promoPrice": "59.9",
        "promoStatus": "E1",
        "shopId": 1000084984,
        "shopName": "首食惠京东自营旗舰店",
        "skuId": "100011848482" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/76540/10/15210/319780/5dce5898E73144c11/76d652b52db4a80b.jpg",
        "jdPrice": "79",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/76540/10/15210/319780/5dce5898E73144c11/76d652b52db4a80b.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"4503275\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "牛油果礼盒 生熟搭配6粒装 单果130g起 进口新鲜水果" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "79.9",
        "name": "牛油果礼盒 生熟搭配6粒装 单果130g起 进口新鲜水果",
        "pPrice": "79",
        "pcpPrice": "79.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/76540/10/15210/319780/5dce5898E73144c11/76d652b52db4a80b.jpg",
        "promoPrice": "77",
        "promoStatus": "E1",
        "shopId": 1000013923,
        "shopName": "水果京东自营专区",
        "skuId": "4503275" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/4048/20/9001/251218/5bab5985E4d7c674e/2786002753000ec5.jpg",
        "jdPrice": "44.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/4048/20/9001/251218/5bab5985E4d7c674e/2786002753000ec5.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"5104930\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "王老吉 中华老字号 原味 龟苓膏 果冻布丁 休闲零食 礼盒 2640g（220g*12小碗）" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "44.9",
        "name": "王老吉 中华老字号 原味 龟苓膏 果冻布丁 休闲零食 礼盒 2640g（220g*12小碗）",
        "pPrice": "44.9",
        "pcpPrice": "44.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/4048/20/9001/251218/5bab5985E4d7c674e/2786002753000ec5.jpg",
        "promoPrice": "42.5",
        "promoStatus": "E1",
        "shopId": 1000313602,
        "shopName": "王老吉龟苓膏京东自营专区",
        "skuId": "5104930" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/75475/32/12767/287683/5da175a1Ed9a42cc8/17d9086f6e43e701.jpg",
        "jdPrice": "239",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/75475/32/12767/287683/5da175a1Ed9a42cc8/17d9086f6e43e701.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"1601354\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "贝因美 （Beingmate）菁爱3段配方奶粉1000g 含乳铁蛋白+DHA+核苷酸" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "239",
        "name": "贝因美 （Beingmate）菁爱3段配方奶粉1000g 含乳铁蛋白+DHA+核苷酸",
        "pPrice": "239",
        "pcpPrice": "239",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/75475/32/12767/287683/5da175a1Ed9a42cc8/17d9086f6e43e701.jpg",
        "promoPrice": "160",
        "promoStatus": "E2",
        "shopId": 1000003111,
        "shopName": "贝因美京东自营旗舰店",
        "skuId": "1601354" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t9664/234/1193763621/487474/901806f/59ddc371Nc16fce63.jpg",
        "jdPrice": "53.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t9664/234/1193763621/487474/901806f/59ddc371Nc16fce63.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"5187375\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "贝得力（BEIDELI)安全锁＋插座保护盖套装 婴幼儿童安全锁扣抽屉锁柜子柜门锁冰箱锁多功能安全锁防夹手" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "53.9",
        "name": "贝得力（BEIDELI)安全锁＋插座保护盖套装 婴幼儿童安全锁扣抽屉锁柜子柜门锁冰箱锁多功能安全锁防夹手",
        "pPrice": "53.9",
        "pcpPrice": "53.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t9664/234/1193763621/487474/901806f/59ddc371Nc16fce63.jpg",
        "promoPrice": "50.9",
        "promoStatus": "E1",
        "shopId": 1000093187,
        "shopName": "贝得力京东自营旗舰店",
        "skuId": "5187375" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t8596/26/229124047/245288/5f075a39/59a38f91Neeb3847a.jpg",
        "jdPrice": "37.6",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t8596/26/229124047/245288/5f075a39/59a38f91Neeb3847a.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"4244598\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "乐芝牛芝士小食系列奶酪高钙休闲零食（经典原味）125g/24粒  再制干酪" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "37.6",
        "name": "乐芝牛芝士小食系列奶酪高钙休闲零食（经典原味）125g/24粒  再制干酪",
        "pPrice": "37.6",
        "pcpPrice": "37.6",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t8596/26/229124047/245288/5f075a39/59a38f91Neeb3847a.jpg",
        "promoPrice": "30",
        "promoStatus": "E1",
        "shopId": 1000196804,
        "shopName": "乐芝牛京东自营旗舰店",
        "skuId": "4244598" },
      {
        "goodRate": "97%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t26095/126/1215973004/165507/d03a96a6/5b8def4dNae8353e4.jpg",
        "jdPrice": "9.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t26095/126/1215973004/165507/d03a96a6/5b8def4dNae8353e4.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100000124431\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "杨生记 碳烤肠 川香辣味 肉枣 休闲零食小吃肉干肉脯小香肠 60g/袋" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "9.9",
        "name": "杨生记 碳烤肠 川香辣味 肉枣 休闲零食小吃肉干肉脯小香肠 60g/袋",
        "pPrice": "9.9",
        "pcpPrice": "9.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t26095/126/1215973004/165507/d03a96a6/5b8def4dNae8353e4.jpg",
        "promoPrice": "8.8",
        "promoStatus": "E1",
        "shopId": 1000110884,
        "shopName": "杨生记食品京东自营旗舰店",
        "skuId": "100000124431" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/36798/23/810/125452/5cad5b25E3d7eea85/a63bf7c696460e22.jpg",
        "jdPrice": "428",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/36798/23/810/125452/5cad5b25E3d7eea85/a63bf7c696460e22.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100000722008\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "圣元优博（Synutra）法国进口 优博瑞慕婴幼儿奶粉1段(0-6个月婴幼儿适用)900克罐装" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "428",
        "name": "圣元优博（Synutra）法国进口 优博瑞慕婴幼儿奶粉1段(0-6个月婴幼儿适用)900克罐装",
        "pPrice": "428",
        "pcpPrice": "428",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/36798/23/810/125452/5cad5b25E3d7eea85/a63bf7c696460e22.jpg",
        "promoPrice": "398",
        "promoStatus": "E1",
        "shopId": 1000013503,
        "shopName": "圣元京东自营旗舰店",
        "skuId": "100000722008" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/5925/18/13491/182970/5bd82ae1Ebc706370/dd2a7b1cfa874036.jpg",
        "jdPrice": "120",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/5925/18/13491/182970/5bd82ae1Ebc706370/dd2a7b1cfa874036.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"2003808\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "旺旺 旺仔牛奶 儿童牛奶早餐奶 原味 250ml*24" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "120",
        "name": "旺旺 旺仔牛奶 儿童牛奶早餐奶 原味 250ml*24",
        "pPrice": "120",
        "pcpPrice": "120",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/5925/18/13491/182970/5bd82ae1Ebc706370/dd2a7b1cfa874036.jpg",
        "promoPrice": "108",
        "promoStatus": "E1",
        "shopId": 1000079565,
        "shopName": "旺旺京东自营旗舰店",
        "skuId": "2003808" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/113519/30/1608/202311/5e99b5eaE51bbd690/8eece2331d437227.jpg",
        "jdPrice": "59.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/113519/30/1608/202311/5e99b5eaE51bbd690/8eece2331d437227.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"2108740\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "洁柔(C&S)抽纸 粉Face 柔韧3层120抽面巾纸*20包 无香(M号纸巾 面子系列可湿水 婴儿纸)整箱销售" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "59.9",
        "name": "洁柔(C&S)抽纸 粉Face 柔韧3层120抽面巾纸*20包 无香(M号纸巾 面子系列可湿水 婴儿纸)整箱销售",
        "pPrice": "59.9",
        "pcpPrice": "59.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/113519/30/1608/202311/5e99b5eaE51bbd690/8eece2331d437227.jpg",
        "promoPrice": "52.9",
        "promoStatus": "E1",
        "shopId": 1000001901,
        "shopName": "洁柔京东自营官方旗舰店",
        "skuId": "2108740" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/43184/40/14514/218940/5d7a2e9fEeef0f2cc/de3cbaa183810ae9.jpg",
        "jdPrice": "59.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/43184/40/14514/218940/5d7a2e9fEeef0f2cc/de3cbaa183810ae9.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"10226217969\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "徐福记 喜庆糖1500g婚庆糖果结婚喜糖(促销3斤装 每袋约300颗左右)散装混合水果口味糖果批发" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "",
        "name": "徐福记 喜庆糖1500g婚庆糖果结婚喜糖(促销3斤装 每袋约300颗左右)散装混合水果口味糖果批发",
        "pPrice": "59.9",
        "pcpPrice": "107.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/43184/40/14514/218940/5d7a2e9fEeef0f2cc/de3cbaa183810ae9.jpg",
        "promoPrice": "58.7",
        "promoStatus": "E1",
        "shopId": 190743,
        "shopName": "徐福记官方旗舰店",
        "skuId": "10226217969" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/12176/26/15547/216877/5caffdc8E89c095f2/25c79cdb1e5b55ff.jpg",
        "jdPrice": "42.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/12176/26/15547/216877/5caffdc8E89c095f2/25c79cdb1e5b55ff.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100003622434\",\"matType\":0,\"stageId\":\"21408051\"}]",
            "title": "上鲜 原味脆骨烤肠 1kg 出口日本级 烤肠鸡肉肠鸡肉火腿肠热狗烤肠 休闲食品早餐食品 烧烤食材火锅食材" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "69.9",
        "name": "上鲜 原味脆骨烤肠 1kg 出口日本级 烤肠鸡肉肠鸡肉火腿肠热狗烤肠 休闲食品早餐食品 烧烤食材火锅食材",
        "pPrice": "42.9",
        "pcpPrice": "69.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/12176/26/15547/216877/5caffdc8E89c095f2/25c79cdb1e5b55ff.jpg",
        "promoPrice": "39.8",
        "promoStatus": "E1",
        "shopId": 1000102141,
        "shopName": "上鲜京东自营旗舰店",
        "skuId": "100003622434" }],

      "remainTime": "17663010",
      "stageId": "21408051",
      "stageName": "",
      "stageTime": "16:00" },
    {
      "groupInfoList": [{
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/89957/12/13597/103998/5e5b03b4Ef64777f2/7fdcd8db8e5808a4.jpg",
        "jdPrice": "15.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/89957/12/13597/103998/5e5b03b4Ef64777f2/7fdcd8db8e5808a4.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"65685097669\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "【便携带 随时用】75%酒精消毒湿巾一次性杀菌擦手湿纸巾手机餐具首饰擦片清洁 3包（10张/包）" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "45",
        "name": "【便携带 随时用】75%酒精消毒湿巾一次性杀菌擦手湿纸巾手机餐具首饰擦片清洁 3包（10张/包）",
        "pPrice": "15.9",
        "pcpPrice": "39.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/89957/12/13597/103998/5e5b03b4Ef64777f2/7fdcd8db8e5808a4.jpg",
        "promoPrice": "13.9",
        "promoStatus": "E1",
        "shopId": 10149464,
        "shopName": "柯诺旗舰店",
        "skuId": "65685097669" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t16393/265/2158045124/507205/cd840034/5a98f45aN69a65784.jpg",
        "jdPrice": "69.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t16393/265/2158045124/507205/cd840034/5a98f45aN69a65784.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"10512375512\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "冠生园蜂蜜900g+100g装*2瓶组合 冲调饮料 玻璃瓶装蜂蜜 大瓶量贩装 早餐水饮" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "",
        "name": "冠生园蜂蜜900g+100g装*2瓶组合 冲调饮料 玻璃瓶装蜂蜜 大瓶量贩装 早餐水饮",
        "pPrice": "69.9",
        "pcpPrice": "78.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t16393/265/2158045124/507205/cd840034/5a98f45aN69a65784.jpg",
        "promoPrice": "62.8",
        "promoStatus": "E1",
        "shopId": 213163,
        "shopName": "冠生园食品旗舰店",
        "skuId": "10512375512" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/34005/15/7030/129251/5cbfff69E17364675/d9b9c06a24577f9b.jpg",
        "jdPrice": "39.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/34005/15/7030/129251/5cbfff69E17364675/d9b9c06a24577f9b.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"2965796\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "思念 金牌虾水饺 至臻虾皇 480g 32只 早餐 火锅食材 烧烤 饺子" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "45.9",
        "name": "思念 金牌虾水饺 至臻虾皇 480g 32只 早餐 火锅食材 烧烤 饺子",
        "pPrice": "39.9",
        "pcpPrice": "45.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/34005/15/7030/129251/5cbfff69E17364675/d9b9c06a24577f9b.jpg",
        "promoPrice": "38.9",
        "promoStatus": "E1",
        "shopId": 1000015503,
        "shopName": "思念食品京东自营旗舰店",
        "skuId": "2965796" },
      {
        "goodRate": "97%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/113641/25/1210/318540/5e95784bEeb6e8de0/5e52c37cb75a1f0a.jpg",
        "jdPrice": "138",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/113641/25/1210/318540/5e95784bEeb6e8de0/5e52c37cb75a1f0a.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100003201606\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "凛 威士忌 洋酒日本原装进口威士忌 720ml" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "155",
        "name": "凛 威士忌 洋酒日本原装进口威士忌 720ml",
        "pPrice": "138",
        "pcpPrice": "155",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/113641/25/1210/318540/5e95784bEeb6e8de0/5e52c37cb75a1f0a.jpg",
        "promoPrice": "135",
        "promoStatus": "E1",
        "shopId": 1000135321,
        "shopName": "清酒屋京东自营专区",
        "skuId": "100003201606" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t18244/129/2651447682/569412/b2471a8f/5afea1f0N91af49ff.jpg",
        "jdPrice": "19.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t18244/129/2651447682/569412/b2471a8f/5afea1f0N91af49ff.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"2029514\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "泉林本色抽纸 2层170抽*6包（天然秸秆原生浆 环保健康 本色卫生面巾抽纸）" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "27.9",
        "name": "泉林本色抽纸 2层170抽*6包（天然秸秆原生浆 环保健康 本色卫生面巾抽纸）",
        "pPrice": "19.9",
        "pcpPrice": "27.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t18244/129/2651447682/569412/b2471a8f/5afea1f0N91af49ff.jpg",
        "promoPrice": "17.9",
        "promoStatus": "E1",
        "shopId": 1000001906,
        "shopName": "泉林本色京东自营旗舰店",
        "skuId": "2029514" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t7141/361/2447680680/203605/611bb317/5996b1e9N4ab02710.jpg",
        "jdPrice": "32.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t7141/361/2447680680/203605/611bb317/5996b1e9N4ab02710.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"1203725\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "韩国进口ZEK芝士深海鳕鱼肠鱼肉火腿肠海味小吃儿童健康即食营养休闲零食 20根300g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "32.8",
        "name": "韩国进口ZEK芝士深海鳕鱼肠鱼肉火腿肠海味小吃儿童健康即食营养休闲零食 20根300g",
        "pPrice": "32.8",
        "pcpPrice": "32.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t7141/361/2447680680/203605/611bb317/5996b1e9N4ab02710.jpg",
        "promoPrice": "29.5",
        "promoStatus": "E1",
        "shopId": 1000115764,
        "shopName": "ZEK京东自营旗舰店",
        "skuId": "1203725" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t2293/234/1968095336/88762/28ab24c9/56e7caa6N058a0178.jpg",
        "jdPrice": "14.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t2293/234/1968095336/88762/28ab24c9/56e7caa6N058a0178.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"2484623\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "元臻 肉干肉脯 休闲零食 鲜烤鱼片原味92g/袋（新老包装随机发货）" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "14.9",
        "name": "元臻 肉干肉脯 休闲零食 鲜烤鱼片原味92g/袋（新老包装随机发货）",
        "pPrice": "14.9",
        "pcpPrice": "14.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t2293/234/1968095336/88762/28ab24c9/56e7caa6N058a0178.jpg",
        "promoPrice": "13.9",
        "promoStatus": "E1",
        "shopId": 1000076227,
        "shopName": "元臻京东自营旗舰店",
        "skuId": "2484623" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/45890/15/464/295041/5cda6f15E6c334150/bcfce400c27e193b.jpg",
        "jdPrice": "14.9",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/45890/15/464/295041/5cda6f15E6c334150/bcfce400c27e193b.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"7192400\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "甘源 休闲零食 蔓越莓味牛轧奶芙 早餐沙琪玛 雪花酥网红糕点点心小吃零食 238g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "15.9",
        "name": "甘源 休闲零食 蔓越莓味牛轧奶芙 早餐沙琪玛 雪花酥网红糕点点心小吃零食 238g",
        "pPrice": "14.9",
        "pcpPrice": "15.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/45890/15/464/295041/5cda6f15E6c334150/bcfce400c27e193b.jpg",
        "promoPrice": "13.8",
        "promoStatus": "E1",
        "shopId": 1000083686,
        "shopName": "甘源京东自营旗舰店",
        "skuId": "7192400" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/95859/8/15970/68409/5e782dd9Eec715b79/def146a77415a226.jpg",
        "jdPrice": "26",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/95859/8/15970/68409/5e782dd9Eec715b79/def146a77415a226.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"26195100317\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "欧克乐蚂蚁药 家用杀虫剂杀灭红蚂蚁饵剂 12包" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "59",
        "name": "欧克乐蚂蚁药 家用杀虫剂杀灭红蚂蚁饵剂 12包",
        "pPrice": "26",
        "pcpPrice": "49",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/95859/8/15970/68409/5e782dd9Eec715b79/def146a77415a226.jpg",
        "promoPrice": "24",
        "promoStatus": "E1",
        "shopId": 209068,
        "shopName": "欧克乐旗舰店",
        "skuId": "26195100317" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t24997/365/1694535976/71496/f78930f2/5bb975e0N60950aaf.jpg",
        "jdPrice": "29.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t24997/365/1694535976/71496/f78930f2/5bb975e0N60950aaf.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100000268637\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "小龙坎牛油火锅底料 新型颗粒一料多用 麻辣冒菜重庆四川特产调味料320g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "29.8",
        "name": "小龙坎牛油火锅底料 新型颗粒一料多用 麻辣冒菜重庆四川特产调味料320g",
        "pPrice": "29.8",
        "pcpPrice": "29.8",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t24997/365/1694535976/71496/f78930f2/5bb975e0N60950aaf.jpg",
        "promoPrice": "28.8",
        "promoStatus": "E1",
        "shopId": 1000093890,
        "shopName": "小龙坎京东自营旗舰店",
        "skuId": "100000268637" },
      {
        "goodRate": "15",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/35347/33/3859/115635/5cb98a68E03e553f4/5ec175344facf973.jpg",
        "jdPrice": "12.8",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/35347/33/3859/115635/5cb98a68E03e553f4/5ec175344facf973.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100003138809\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "民福齐食  四川泡菜  泡小米辣 500g  泡辣椒 酱腌菜 咸菜 自制泡椒凤爪 泡椒猪皮" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "19.9",
        "name": "民福齐食  四川泡菜  泡小米辣 500g  泡辣椒 酱腌菜 咸菜 自制泡椒凤爪 泡椒猪皮",
        "pPrice": "12.8",
        "pcpPrice": "19.9",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/35347/33/3859/115635/5cb98a68E03e553f4/5ec175344facf973.jpg",
        "promoPrice": "11.7",
        "promoStatus": "E1",
        "shopId": 1000209041,
        "shopName": "民福齐食（MINFUQISHI）京东自营旗舰店",
        "skuId": "100003138809" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t2872/11/3325489162/280309/843314af/57873cafN7e432fad.jpg",
        "jdPrice": "58",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t2872/11/3325489162/280309/843314af/57873cafN7e432fad.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"1950433\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "意大利进口 瑞士莲（Lindt）软心白巧克力分享装200g" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "58",
        "name": "意大利进口 瑞士莲（Lindt）软心白巧克力分享装200g",
        "pPrice": "58",
        "pcpPrice": "58",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t2872/11/3325489162/280309/843314af/57873cafN7e432fad.jpg",
        "promoPrice": "55",
        "promoStatus": "E1",
        "shopId": 1000081022,
        "shopName": "瑞士莲京东自营旗舰店",
        "skuId": "1950433" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/18129/9/5402/64309/5c3c907aE4cced69c/b4de2d02fa947e01.jpg",
        "jdPrice": "119",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/18129/9/5402/64309/5c3c907aE4cced69c/b4de2d02fa947e01.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100002036809\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "鸥米茄 新西兰熟冻半壳青口贝 1kg/盒 34-42粒 原装进口" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "119",
        "name": "鸥米茄 新西兰熟冻半壳青口贝 1kg/盒 34-42粒 原装进口",
        "pPrice": "119",
        "pcpPrice": "119",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/18129/9/5402/64309/5c3c907aE4cced69c/b4de2d02fa947e01.jpg",
        "promoPrice": "107.9",
        "promoStatus": "E1",
        "shopId": 1000110125,
        "shopName": "Ωmega/鸥米茄京东自营专区",
        "skuId": "100002036809" },
      {
        "goodRate": "99%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/78129/1/7130/391201/5d525bbdE7579eb16/e5f30cbe564326d6.jpg",
        "jdPrice": "36",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/78129/1/7130/391201/5d525bbdE7579eb16/e5f30cbe564326d6.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"1060537\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "高洁丝Kotex 190mm超薄直条迷你卫生巾护垫10片*6包" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "36",
        "name": "高洁丝Kotex 190mm超薄直条迷你卫生巾护垫10片*6包",
        "pPrice": "36",
        "pcpPrice": "36",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/78129/1/7130/391201/5d525bbdE7579eb16/e5f30cbe564326d6.jpg",
        "promoPrice": "34.9",
        "promoStatus": "E1",
        "shopId": 1000002396,
        "shopName": "高洁丝京东自营官方旗舰店",
        "skuId": "1060537" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t1/24361/25/15195/112932/5cad5b55E41640183/43fcac36a24c2132.jpg",
        "jdPrice": "428",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t1/24361/25/15195/112932/5cad5b55E41640183/43fcac36a24c2132.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"100000721980\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "圣元优博（Synutra）法国进口 优博瑞慕婴幼儿奶粉2段(6-12个月婴幼儿适用)900g罐装" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "428",
        "name": "圣元优博（Synutra）法国进口 优博瑞慕婴幼儿奶粉2段(6-12个月婴幼儿适用)900g罐装",
        "pPrice": "428",
        "pcpPrice": "428",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t1/24361/25/15195/112932/5cad5b55E41640183/43fcac36a24c2132.jpg",
        "promoPrice": "378",
        "promoStatus": "E1",
        "shopId": 1000013503,
        "shopName": "圣元京东自营旗舰店",
        "skuId": "100000721980" },
      {
        "goodRate": "98%",
        "hideCart": true,
        "image": "https://m.360buyimg.com/babel/jfs/t16120/326/2513898165/647808/f37f8980/5ab4ab21Ne046f010.jpg",
        "jdPrice": "42.6",
        "jump": {
          "des": "babel",
          "params": {
            "activityId": "42hnfmo6eBh2fsxovPuXsm3qLyfJ",
            "image": "https://m.360buyimg.com/babel/jfs/t16120/326/2513898165/647808/f37f8980/5ab4ab21Ne046f010.jpg",
            "innerLink": "[{\"groupId\":\"12189169\",\"matId\":\"5867931\",\"matType\":0,\"stageId\":\"21408067\"}]",
            "title": "趣园  送礼佳品 曲奇饼干 908g 丹麦风味糕点点心网红小零食礼盒装" },

          "srv": "" },

        "leftPromoStock": "1",
        "linePrice": "42.6",
        "name": "趣园  送礼佳品 曲奇饼干 908g 丹麦风味糕点点心网红小零食礼盒装",
        "pPrice": "42.6",
        "pcpPrice": "42.6",
        "picUrl": "https://m.360buyimg.com/deepvisual/jfs/t16120/326/2513898165/647808/f37f8980/5ab4ab21Ne046f010.jpg",
        "promoPrice": "39.8",
        "promoStatus": "E1",
        "shopId": 1000130341,
        "shopName": "趣园京东自营旗舰店",
        "skuId": "5867931" }],

      "remainTime": "32063010",
      "stageId": "21408067",
      "stageName": "",
      "stageTime": "20:00" }] },

  {
    "adsList": [{
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "2201318533",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#19998012",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/2DZPMHBhryGWdEAYzyeZ6PfE2o8a/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/2DZPMHBhryGWdEAYzyeZ6PfE2o8a/index.html",
      "picHeight": 330,
      "picWidth": 330,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/110161/39/12324/87076/5e93e990E0fbda14a/ad66e04bc99930de.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "2201320818",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#19998012",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/2kK65P5dWLw34Sewf7so5wkWCeDV/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/2kK65P5dWLw34Sewf7so5wkWCeDV/index.html",
      "picHeight": 330,
      "picWidth": 330,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/97646/39/19007/69622/5e9980cfEdfc01b31/f1b7a4c7cb081077.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "2201319037",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#19998012",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/21pCJJkMPCSowK6Pv8hkqZijph8R/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/21pCJJkMPCSowK6Pv8hkqZijph8R/index.html",
      "picHeight": 330,
      "picWidth": 330,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/113110/16/1207/62829/5e957b2fEccfafb8e/7b144bf95546eb3c.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "2201320714",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#19998012",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://prodev.m.jd.com/mall/active/45EYLbiG9ykCFbFedNdUkJvUSd4H/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://prodev.m.jd.com/mall/active/45EYLbiG9ykCFbFedNdUkJvUSd4H/index.html",
      "picHeight": 330,
      "picWidth": 330,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/114441/3/1582/110346/5e996aaaEc31422da/56403372b510a23a.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "2201317173",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#19998012",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/3ZoMCWXiLXoKJJTzHSv48tUXapZx/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/3ZoMCWXiLXoKJJTzHSv48tUXapZx/index.html",
      "picHeight": 330,
      "picWidth": 330,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/113694/25/1499/97896/5e991cd9Ebb04323f/65e4c08724a27d62.png",
      "skuId": "",
      "skuImg": "" },
    {
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "2201318516",
      "advertName": "",
      "biInfo": "1#ed064e348b5a3874a6fc947959766ccfb648cea1-100-619036-1#19998012",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/3DGrJUB4YBAiZf6PPLh9z76QENQq/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://pro.m.jd.com/mall/active/3DGrJUB4YBAiZf6PPLh9z76QENQq/index.html",
      "picHeight": 330,
      "picWidth": 330,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/114569/34/1095/81401/5e942d11E646d7954/918fd5ae855f3a3e.png",
      "skuId": "",
      "skuImg": "" }],

    "advertId": "04071944",
    "backgroundColor": "",
    "backgroundImg": "",
    "bgImgHeight": "",
    "bgImgWidth": "",
    "biImpr": "",
    "bigAdsList": [{
      "advertComment": "$提报备注",
      "advertContent": "",
      "advertDes": "",
      "advertId": "3001323375",
      "advertName": "",
      "biInfo": "2",
      "floatTop": true,
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://prodev.m.jd.com/mall/active/JLt5Pi7iXwyusE1ZPWkunWmbkKd/index.html" },

        "srv": "" },

      "leftHalfImg": "",
      "link": "https://prodev.m.jd.com/mall/active/JLt5Pi7iXwyusE1ZPWkunWmbkKd/index.html",
      "picHeight": 426,
      "picWidth": 1035,
      "pictureUrl": "https://m.360buyimg.com/babel/jfs/t1/109931/2/12948/224298/5e994d22E73bb1b1b/1d82138ac6fb8f2d.jpg",
      "skuId": "",
      "skuImg": "" }],

    "bigAdvertId": "03163168",
    "floorTitle": {
      "backgroundImg": "http://m.360buyimg.com/deepvisual/jfs/t1/66077/36/9779/14235/5d7710ccE8077000d/6b246f6a42cb4a67.png",
      "clickMore": "更多",
      "jump": {
        "des": "m",
        "params": {
          "url": "https://m.jd.com/marketInnerTab?activityId=4GVnejgPq4cziid3BF1wyjihUo5d" },

        "srv": "" },

      "link": "https://m.jd.com/marketInnerTab?activityId=4GVnejgPq4cziid3BF1wyjihUo5d",
      "name": "品牌特卖",
      "subTitle": "超大品牌优惠" },

    "initSuccess": true,
    "jump": {
      "des": "m",
      "params": {
        "url": "https://m.jd.com/marketInnerTab?activityId=4GVnejgPq4cziid3BF1wyjihUo5d" },

      "srv": "" },

    "moduleId": "BRANDSALE",
    "template": "BRAND_SALE",
    "textColor": "",
    "title": "",
    "valid": true }],

  "code": "0",
  "pagination": [
  [
  "AD_WHEEL",
  "USER_EDUCATION",
  "QUICK_ENTRY",
  "COUPON_ELEMENT",
  "BANNER_2",
  "RUSH_BUY",
  "BRAND_SALE"],

  [
  "BANNER_3",
  "RANK_LIST",
  "VALUE_SALE",
  "GOODS_JOURNAL",
  "BANNER_4",
  "TAB_FLOOR"]],


  "intervalConfig": {
    "backgroundColor": "#F6F6F6",
    "height": "15" },

  "nextPage": 2,
  "floatIcon": {
    "adsList": [],
    "advertId": "",
    "backgroundColor": "",
    "backgroundImg": "https://m.360buyimg.com/mobilecms/jfs/t1/91527/35/19027/18954/5e9c77a4Edb4a88b6/0a9b94c3d5917f41.gif",
    "bgImgHeight": "",
    "bgImgWidth": "",
    "biImpr": "",
    "bigImageUrl": "",
    "id": 544,
    "initSuccess": true,
    "jump": {
      "des": "m",
      "params": {
        "innerLink": "",
        "url": "https://pro.m.jd.com/mall/active/3dVSNaJTEyd3uzwneeKGgDYVrSRL/index.html" },

      "srv": "" },

    "moduleId": "FLOATICON",
    "showTime": 0,
    "template": "FLOAT_ICON",
    "textColor": "",
    "title": "" },

  "header": {
    "adsList": [],
    "advertId": "",
    "backgroundColor": "",
    "backgroundImg": "https://m.360buyimg.com/deepvisual/jfs/t1/25826/6/8800/3918/5c78e206E62783293/0be5fa71032f91a3.png",
    "bgImgHeight": "",
    "bgImgWidth": "",
    "biImpr": "",
    "icons": [{
      "childIcons": [],
      "desc": "",
      "ext": {},
      "iconName": "超市签到",
      "img": "https://m.360buyimg.com/mobilecms/jfs/t1/48982/19/13485/3671/5da3d3adEb155d48b/f4c0fed9b3517f9a.png",
      "jump": {
        "des": "m",
        "params": {
          "innerLink": "",
          "url": "https://pro.m.jd.com/mall/active/aNCM6yrzD6qp1Vvh5YTzeJtk7cM/index.html" },

        "srv": "" },

      "link": "https://pro.m.jd.com/mall/active/aNCM6yrzD6qp1Vvh5YTzeJtk7cM/index.html",
      "linkType": 1,
      "name": "other",
      "seat": "1",
      "title": "" },
    {
      "childIcons": [],
      "desc": "",
      "ext": {},
      "iconName": "关注按钮",
      "img": "",
      "link": "",
      "name": "follow",
      "seat": "2",
      "title": "" },
    {
      "childIcons": [{
        "childIcons": [],
        "desc": "",
        "ext": {},
        "iconName": "用户反馈",
        "img": "https://m.360buyimg.com/mobilecms/jfs/t1/68271/25/494/3323/5ceb5150E57c3c42d/9f47c69ac3d22a99.png",
        "jump": {
          "des": "feedback",
          "params": {},
          "srv": "" },

        "link": "",
        "name": "feedback",
        "seat": "",
        "title": "" },
      {
        "childIcons": [],
        "desc": "至省至真，京东超市",
        "ext": {
          "avatar": "https://m.360buyimg.com/mobilecms/jfs/t1/47689/6/13230/2003/5da14042E955b6393/244a8cc263949fc0.png",
          "title": "足不出户囤遍好物！逛超市，上京东~",
          "avatarFileName": "share.png",
          "content": "至省至真，京东超市",
          "url": "https://h5.m.jd.com/babelDiy/Zeus/4JkCVz6z5RB4dBL7bZBwtGRiBLLw/index.html" },

        "iconName": "分享",
        "img": "https://m.360buyimg.com/mobilecms/jfs/t1/79780/27/501/559/5ceb50b7E3bc17901/dad100e25ab801fd.png",
        "jump": {
          "des": "share",
          "params": {},
          "srv": "JDMarket_Share" },

        "link": "",
        "name": "share",
        "seat": "",
        "title": "足不出户囤遍好物！逛超市，上京东~" },
      {
        "childIcons": [],
        "desc": "",
        "ext": {},
        "iconName": "购物车",
        "img": "https://m.360buyimg.com/mobilecms/jfs/t1/62874/25/502/639/5ceb50d3Eec3f5df3/10f1bb93e87c834f.png",
        "jump": {
          "des": "cartB",
          "params": {},
          "srv": "JDMarket_GotoShoppingcart" },

        "link": "",
        "name": "cart",
        "seat": "",
        "title": "" }],

      "desc": "",
      "ext": {},
      "iconName": "子坑位",
      "img": "https://m.360buyimg.com/mobilecms/jfs/t1/59033/32/921/447/5ceb4c11Ea2bcd2b9/c1a6af43d2ce5cda.png",
      "link": "",
      "name": "multi",
      "seat": "3",
      "title": "" }],

    "initSuccess": true,
    "moduleId": "HEADERFLOOR",
    "redEnvelopeRainInfo": {
      "activityCountDown": "",
      "activityUrl": "",
      "id": "" },

    "searchObject": {
      "realWord": "京东超市",
      "placeholder": "一站式囤生活好物",
      "jump": {
        "des": "search",
        "srv": "",
        "params": {
          "isFromWidget": true,
          "jdSupermarket": 0 } } },



    "template": "HEADER_FLOOR",
    "textColor": "",
    "title": "" },

  "loginStatus": 0,
  "hash": 14 };exports.default = _default;

/***/ }),
/* 17 */
/*!**************************************************************************!*\
  !*** /Users/zdxx/Documents/HBuilderProjects/dcloud-check/store/index.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 25);


/***/ }),
/* 25 */
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 26);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 26 */
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map