/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/api.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/api.ts":
/*!********************!*\
  !*** ./src/api.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const UI_OPTIONS = {
    height: 620,
    width: 380
};
const actions = {
    getPages() {
        return figma.root.children.map(item => ({
            id: item.id,
            name: item.name
        }));
    },
    getPageNodes({ pageId }) {
        actions.organizeStatesPage();
        return figma.root.children
            .find(item => item.id === pageId)
            .children.map(item => ({
            id: item.id,
            name: item.name,
            blueprint: JSON.parse(item.getPluginData('blueprint'))
        }));
    },
    selectNode({ nodeId }) {
        const node = figma.currentPage.findOne(node => node.id === nodeId);
        if (node) {
            figma.viewport.scrollAndZoomIntoView([node]);
            figma.currentPage.selection = [node];
        }
    },
    organizeStatesPage() {
        const pageId = actions.getDocumentValue({ key: 'contextPageId' });
        const page = figma.root.children.find(item => item.id === pageId && item.type === 'PAGE');
        if (!page)
            return {};
        const states = page.children.map(item => {
            const [platform, context, state] = item.name.split('/').map(item => item.trim());
            return {
                blueprint: {
                    platform,
                    context,
                    state
                },
                figma: item
            };
        });
        const statesByPlatform = states.reduce((all, item) => {
            if (!all[item.blueprint.platform]) {
                all[item.blueprint.platform] = [];
            }
            all[item.blueprint.platform].push(item);
            return all;
        }, {});
        const statesByContext = Object.entries(statesByPlatform).map(([key, items]) => ({
            platform: key,
            contexts: items.reduce((all, item) => {
                if (!all[item.blueprint.context]) {
                    all[item.blueprint.context] = [];
                }
                all[item.blueprint.context].push(item);
                return all;
            }, {})
        }));
        const calculations = statesByContext.map(item => {
            return Object.assign(Object.assign({}, item), { y: 0, height: Object.entries(item.contexts).reduce((maxHeight, [, states]) => {
                    const height = states.reduce((total, state) => total + state.figma.height + 120, 0);
                    return Math.max(maxHeight, height);
                }, 0) });
        });
        calculations.reduce((prev, current, currentIndex) => {
            calculations[currentIndex].y = prev.y + prev.height + 120;
            return current;
        });
        let contextX;
        let stateY;
        calculations.forEach(platform => {
            contextX = 0;
            Object.entries(platform.contexts).forEach(([contextName, states]) => {
                const contextWidth = platform.contexts[contextName].reduce((maxWidth, item) => Math.max(item.figma.width, maxWidth), 0);
                stateY = platform.y;
                states.forEach(state => {
                    const frame = page.findOne(node => node.id === state.figma.id);
                    frame.x = contextX;
                    frame.y = stateY;
                    stateY += state.figma.height + 120;
                });
                contextX += contextWidth + 80;
            });
        });
    },
    createStateFrame({ name, blueprint, width, height }) {
        const pageId = actions.getDocumentValue({ key: 'contextPageId' });
        const page = figma.root.children.find(item => item.id === pageId && item.type === 'PAGE');
        if (!page)
            return {};
        const frame = figma.createComponent();
        frame.name = name;
        frame.backgrounds = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        frame.resizeWithoutConstraints(width, height);
        frame.setPluginData('blueprint', JSON.stringify(blueprint));
        frame.setPluginData('status', 'draft');
        page.appendChild(frame);
        actions.organizeStatesPage();
        page.selection = [frame];
        return { id: frame.id };
    },
    setDocumentValue({ key, value }) {
        figma.root.setPluginData(key, JSON.stringify(value));
    },
    getDocumentValue({ key }) {
        return JSON.parse(figma.root.getPluginData(key));
    },
    setNodeValue({ nodeId, key, value }) {
        figma.root.findOne(item => item.id === nodeId).setPluginData(key, value);
    },
    getNodeValue({ nodeId, key }) {
        return figma.root.findOne(item => item.id === nodeId).getPluginData(key);
    },
    get: ({ key }) => __awaiter(this, void 0, void 0, function* () {
        return figma.clientStorage.getAsync(key);
    }),
    set: ({ key, value }) => __awaiter(this, void 0, void 0, function* () {
        return figma.clientStorage.setAsync(key, value);
    })
};
// Handle requests
figma.ui.onmessage = (message) => __awaiter(this, void 0, void 0, function* () {
    const payload = yield actions[message.type](message.payload);
    figma.ui.postMessage({ type: 'response', id: message.id, payload });
});
// Show widget ui
figma.showUI(__html__, UI_OPTIONS);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQSwyQkFBMkIsK0RBQStELGdCQUFnQixFQUFFLEVBQUU7QUFDOUc7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IscUZBQXFGO0FBQ3BIO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsZ0JBQWdCLFNBQVM7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGlEQUFpRCx1QkFBdUI7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxJQUFJO0FBQ2pCLFNBQVM7QUFDVDtBQUNBLGlEQUFpRCxVQUFVO0FBQzNEO0FBQ0E7QUFDQSxpQkFBaUIsTUFBTTtBQUN2QixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLHNCQUFzQixpQ0FBaUM7QUFDdkQsaURBQWlELHVCQUF1QjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdCQUF3QixtQkFBbUIsRUFBRTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsS0FBSztBQUNMLHNCQUFzQixhQUFhO0FBQ25DO0FBQ0EsS0FBSztBQUNMLHNCQUFzQixNQUFNO0FBQzVCO0FBQ0EsS0FBSztBQUNMLGtCQUFrQixxQkFBcUI7QUFDdkM7QUFDQSxLQUFLO0FBQ0wsa0JBQWtCLGNBQWM7QUFDaEM7QUFDQSxLQUFLO0FBQ0wsV0FBVyxNQUFNO0FBQ2pCO0FBQ0EsS0FBSztBQUNMLFdBQVcsYUFBYTtBQUN4QjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw0Q0FBNEM7QUFDdEUsQ0FBQztBQUNEO0FBQ0EiLCJmaWxlIjoiYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvYXBpLnRzXCIpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5jb25zdCBVSV9PUFRJT05TID0ge1xuICAgIGhlaWdodDogNjIwLFxuICAgIHdpZHRoOiAzODBcbn07XG5jb25zdCBhY3Rpb25zID0ge1xuICAgIGdldFBhZ2VzKCkge1xuICAgICAgICByZXR1cm4gZmlnbWEucm9vdC5jaGlsZHJlbi5tYXAoaXRlbSA9PiAoe1xuICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICBuYW1lOiBpdGVtLm5hbWVcbiAgICAgICAgfSkpO1xuICAgIH0sXG4gICAgZ2V0UGFnZU5vZGVzKHsgcGFnZUlkIH0pIHtcbiAgICAgICAgYWN0aW9ucy5vcmdhbml6ZVN0YXRlc1BhZ2UoKTtcbiAgICAgICAgcmV0dXJuIGZpZ21hLnJvb3QuY2hpbGRyZW5cbiAgICAgICAgICAgIC5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gcGFnZUlkKVxuICAgICAgICAgICAgLmNoaWxkcmVuLm1hcChpdGVtID0+ICh7XG4gICAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICAgIG5hbWU6IGl0ZW0ubmFtZSxcbiAgICAgICAgICAgIGJsdWVwcmludDogSlNPTi5wYXJzZShpdGVtLmdldFBsdWdpbkRhdGEoJ2JsdWVwcmludCcpKVxuICAgICAgICB9KSk7XG4gICAgfSxcbiAgICBzZWxlY3ROb2RlKHsgbm9kZUlkIH0pIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUobm9kZSA9PiBub2RlLmlkID09PSBub2RlSWQpO1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtub2RlXSk7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbbm9kZV07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9yZ2FuaXplU3RhdGVzUGFnZSgpIHtcbiAgICAgICAgY29uc3QgcGFnZUlkID0gYWN0aW9ucy5nZXREb2N1bWVudFZhbHVlKHsga2V5OiAnY29udGV4dFBhZ2VJZCcgfSk7XG4gICAgICAgIGNvbnN0IHBhZ2UgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBwYWdlSWQgJiYgaXRlbS50eXBlID09PSAnUEFHRScpO1xuICAgICAgICBpZiAoIXBhZ2UpXG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIGNvbnN0IHN0YXRlcyA9IHBhZ2UuY2hpbGRyZW4ubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgW3BsYXRmb3JtLCBjb250ZXh0LCBzdGF0ZV0gPSBpdGVtLm5hbWUuc3BsaXQoJy8nKS5tYXAoaXRlbSA9PiBpdGVtLnRyaW0oKSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGJsdWVwcmludDoge1xuICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZpZ21hOiBpdGVtXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3RhdGVzQnlQbGF0Zm9ybSA9IHN0YXRlcy5yZWR1Y2UoKGFsbCwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFhbGxbaXRlbS5ibHVlcHJpbnQucGxhdGZvcm1dKSB7XG4gICAgICAgICAgICAgICAgYWxsW2l0ZW0uYmx1ZXByaW50LnBsYXRmb3JtXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxsW2l0ZW0uYmx1ZXByaW50LnBsYXRmb3JtXS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgcmV0dXJuIGFsbDtcbiAgICAgICAgfSwge30pO1xuICAgICAgICBjb25zdCBzdGF0ZXNCeUNvbnRleHQgPSBPYmplY3QuZW50cmllcyhzdGF0ZXNCeVBsYXRmb3JtKS5tYXAoKFtrZXksIGl0ZW1zXSkgPT4gKHtcbiAgICAgICAgICAgIHBsYXRmb3JtOiBrZXksXG4gICAgICAgICAgICBjb250ZXh0czogaXRlbXMucmVkdWNlKChhbGwsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWFsbFtpdGVtLmJsdWVwcmludC5jb250ZXh0XSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxbaXRlbS5ibHVlcHJpbnQuY29udGV4dF0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWxsW2l0ZW0uYmx1ZXByaW50LmNvbnRleHRdLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsbDtcbiAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICB9KSk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0aW9ucyA9IHN0YXRlc0J5Q29udGV4dC5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBpdGVtKSwgeyB5OiAwLCBoZWlnaHQ6IE9iamVjdC5lbnRyaWVzKGl0ZW0uY29udGV4dHMpLnJlZHVjZSgobWF4SGVpZ2h0LCBbLCBzdGF0ZXNdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHN0YXRlcy5yZWR1Y2UoKHRvdGFsLCBzdGF0ZSkgPT4gdG90YWwgKyBzdGF0ZS5maWdtYS5oZWlnaHQgKyAxMjAsIDApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgobWF4SGVpZ2h0LCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIH0sIDApIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2FsY3VsYXRpb25zLnJlZHVjZSgocHJldiwgY3VycmVudCwgY3VycmVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBjYWxjdWxhdGlvbnNbY3VycmVudEluZGV4XS55ID0gcHJldi55ICsgcHJldi5oZWlnaHQgKyAxMjA7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBjb250ZXh0WDtcbiAgICAgICAgbGV0IHN0YXRlWTtcbiAgICAgICAgY2FsY3VsYXRpb25zLmZvckVhY2gocGxhdGZvcm0gPT4ge1xuICAgICAgICAgICAgY29udGV4dFggPSAwO1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMocGxhdGZvcm0uY29udGV4dHMpLmZvckVhY2goKFtjb250ZXh0TmFtZSwgc3RhdGVzXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRleHRXaWR0aCA9IHBsYXRmb3JtLmNvbnRleHRzW2NvbnRleHROYW1lXS5yZWR1Y2UoKG1heFdpZHRoLCBpdGVtKSA9PiBNYXRoLm1heChpdGVtLmZpZ21hLndpZHRoLCBtYXhXaWR0aCksIDApO1xuICAgICAgICAgICAgICAgIHN0YXRlWSA9IHBsYXRmb3JtLnk7XG4gICAgICAgICAgICAgICAgc3RhdGVzLmZvckVhY2goc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFtZSA9IHBhZ2UuZmluZE9uZShub2RlID0+IG5vZGUuaWQgPT09IHN0YXRlLmZpZ21hLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUueCA9IGNvbnRleHRYO1xuICAgICAgICAgICAgICAgICAgICBmcmFtZS55ID0gc3RhdGVZO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVkgKz0gc3RhdGUuZmlnbWEuaGVpZ2h0ICsgMTIwO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRleHRYICs9IGNvbnRleHRXaWR0aCArIDgwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgY3JlYXRlU3RhdGVGcmFtZSh7IG5hbWUsIGJsdWVwcmludCwgd2lkdGgsIGhlaWdodCB9KSB7XG4gICAgICAgIGNvbnN0IHBhZ2VJZCA9IGFjdGlvbnMuZ2V0RG9jdW1lbnRWYWx1ZSh7IGtleTogJ2NvbnRleHRQYWdlSWQnIH0pO1xuICAgICAgICBjb25zdCBwYWdlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gcGFnZUlkICYmIGl0ZW0udHlwZSA9PT0gJ1BBR0UnKTtcbiAgICAgICAgaWYgKCFwYWdlKVxuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICBjb25zdCBmcmFtZSA9IGZpZ21hLmNyZWF0ZUNvbXBvbmVudCgpO1xuICAgICAgICBmcmFtZS5uYW1lID0gbmFtZTtcbiAgICAgICAgZnJhbWUuYmFja2dyb3VuZHMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAxLCBnOiAxLCBiOiAxIH0gfV07XG4gICAgICAgIGZyYW1lLnJlc2l6ZVdpdGhvdXRDb25zdHJhaW50cyh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgZnJhbWUuc2V0UGx1Z2luRGF0YSgnYmx1ZXByaW50JywgSlNPTi5zdHJpbmdpZnkoYmx1ZXByaW50KSk7XG4gICAgICAgIGZyYW1lLnNldFBsdWdpbkRhdGEoJ3N0YXR1cycsICdkcmFmdCcpO1xuICAgICAgICBwYWdlLmFwcGVuZENoaWxkKGZyYW1lKTtcbiAgICAgICAgYWN0aW9ucy5vcmdhbml6ZVN0YXRlc1BhZ2UoKTtcbiAgICAgICAgcGFnZS5zZWxlY3Rpb24gPSBbZnJhbWVdO1xuICAgICAgICByZXR1cm4geyBpZDogZnJhbWUuaWQgfTtcbiAgICB9LFxuICAgIHNldERvY3VtZW50VmFsdWUoeyBrZXksIHZhbHVlIH0pIHtcbiAgICAgICAgZmlnbWEucm9vdC5zZXRQbHVnaW5EYXRhKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICB9LFxuICAgIGdldERvY3VtZW50VmFsdWUoeyBrZXkgfSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShmaWdtYS5yb290LmdldFBsdWdpbkRhdGEoa2V5KSk7XG4gICAgfSxcbiAgICBzZXROb2RlVmFsdWUoeyBub2RlSWQsIGtleSwgdmFsdWUgfSkge1xuICAgICAgICBmaWdtYS5yb290LmZpbmRPbmUoaXRlbSA9PiBpdGVtLmlkID09PSBub2RlSWQpLnNldFBsdWdpbkRhdGEoa2V5LCB2YWx1ZSk7XG4gICAgfSxcbiAgICBnZXROb2RlVmFsdWUoeyBub2RlSWQsIGtleSB9KSB7XG4gICAgICAgIHJldHVybiBmaWdtYS5yb290LmZpbmRPbmUoaXRlbSA9PiBpdGVtLmlkID09PSBub2RlSWQpLmdldFBsdWdpbkRhdGEoa2V5KTtcbiAgICB9LFxuICAgIGdldDogKHsga2V5IH0pID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoa2V5KTtcbiAgICB9KSxcbiAgICBzZXQ6ICh7IGtleSwgdmFsdWUgfSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhrZXksIHZhbHVlKTtcbiAgICB9KVxufTtcbi8vIEhhbmRsZSByZXF1ZXN0c1xuZmlnbWEudWkub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICBjb25zdCBwYXlsb2FkID0geWllbGQgYWN0aW9uc1ttZXNzYWdlLnR5cGVdKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncmVzcG9uc2UnLCBpZDogbWVzc2FnZS5pZCwgcGF5bG9hZCB9KTtcbn0pO1xuLy8gU2hvdyB3aWRnZXQgdWlcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgVUlfT1BUSU9OUyk7XG4iXSwic291cmNlUm9vdCI6IiJ9