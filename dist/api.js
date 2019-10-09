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
    height: 720,
    width: 380
};
figma.root.setPluginData('scenarios', JSON.stringify([]));
function getPlatformsWithContexts() {
    const page = getContextPage();
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
    return Object.entries(statesByPlatform).map(([key, items]) => ({
        platform: key,
        contexts: items.reduce((all, item) => {
            if (!all[item.blueprint.context]) {
                all[item.blueprint.context] = [];
            }
            all[item.blueprint.context].push(item);
            return all;
        }, {})
    }));
}
function getContextPage() {
    const pageId = actions.getDocumentValue({ key: 'contextPageId' });
    let page = figma.root.children.find(item => item.id === pageId && item.type === 'PAGE');
    if (!page) {
        page = figma.createPage();
        page.name = 'master - States';
        figma.root.appendChild(page);
    }
    return page;
}
function getScenariosPage() {
    let scenariosPage = figma.root.children.find(item => item.name === 'master - Scenarios');
    if (!scenariosPage) {
        scenariosPage = figma.createPage();
        scenariosPage.name = 'master - Scenarios';
        figma.root.appendChild(scenariosPage);
    }
    return scenariosPage;
}
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
    setupScenarios({ uuidArr }) {
        const contextPage = getContextPage();
        let scenariosPage = getScenariosPage();
        // Clean scenarios page
        scenariosPage.children.forEach(item => item.remove());
        const scenarios = JSON.parse(figma.root.getPluginData('scenarios') || '[]');
        let scenarioX = 0;
        let scenarioY = 0;
        let scenarioHeight = 0;
        scenarios.forEach(item => {
            scenarioHeight = 0;
            const nodes = [];
            item.states.forEach(uuid => {
                const component = contextPage.findOne(node => {
                    return node.type === 'COMPONENT' && node.id === uuidArr[uuid];
                });
                if (!component)
                    return;
                const instance = component.createInstance();
                nodes.push(instance);
                instance.x = scenarioX;
                instance.y = scenarioY;
                scenarioX += instance.width + 30;
                scenarioHeight = Math.max(component.height, scenarioHeight);
                scenariosPage.appendChild(instance);
            });
            figma.group(nodes, scenariosPage).name = item.title;
            scenarioX = 0;
            scenarioY += scenarioHeight + 120;
        });
        // platforms.forEach(platform => {
        //   Object.entries(platform.contexts).forEach(([contextName, states]) => {
        //     states.forEach()
        //   })
        // })
    },
    organizeStatesPage() {
        const contextPage = getContextPage();
        const statesByContext = getPlatformsWithContexts();
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
                    const frame = contextPage.findOne(node => node.id === state.figma.id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQSwyQkFBMkIsK0RBQStELGdCQUFnQixFQUFFLEVBQUU7QUFDOUc7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IscUZBQXFGO0FBQ3BIO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssSUFBSTtBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYixLQUFLO0FBQ0w7QUFDQTtBQUNBLDZDQUE2Qyx1QkFBdUI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLG9CQUFvQixVQUFVO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsWUFBWTtBQUNaLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxVQUFVO0FBQzNEO0FBQ0E7QUFDQSxpQkFBaUIsTUFBTTtBQUN2QixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLHNCQUFzQixpQ0FBaUM7QUFDdkQsaURBQWlELHVCQUF1QjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdCQUF3QixtQkFBbUIsRUFBRTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsS0FBSztBQUNMLHNCQUFzQixhQUFhO0FBQ25DO0FBQ0EsS0FBSztBQUNMLHNCQUFzQixNQUFNO0FBQzVCO0FBQ0EsS0FBSztBQUNMLGtCQUFrQixxQkFBcUI7QUFDdkM7QUFDQSxLQUFLO0FBQ0wsa0JBQWtCLGNBQWM7QUFDaEM7QUFDQSxLQUFLO0FBQ0wsV0FBVyxNQUFNO0FBQ2pCO0FBQ0EsS0FBSztBQUNMLFdBQVcsYUFBYTtBQUN4QjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw0Q0FBNEM7QUFDdEUsQ0FBQztBQUNEO0FBQ0EiLCJmaWxlIjoiYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvYXBpLnRzXCIpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5jb25zdCBVSV9PUFRJT05TID0ge1xuICAgIGhlaWdodDogNzIwLFxuICAgIHdpZHRoOiAzODBcbn07XG5maWdtYS5yb290LnNldFBsdWdpbkRhdGEoJ3NjZW5hcmlvcycsIEpTT04uc3RyaW5naWZ5KFtdKSk7XG5mdW5jdGlvbiBnZXRQbGF0Zm9ybXNXaXRoQ29udGV4dHMoKSB7XG4gICAgY29uc3QgcGFnZSA9IGdldENvbnRleHRQYWdlKCk7XG4gICAgY29uc3Qgc3RhdGVzID0gcGFnZS5jaGlsZHJlbi5tYXAoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IFtwbGF0Zm9ybSwgY29udGV4dCwgc3RhdGVdID0gaXRlbS5uYW1lLnNwbGl0KCcvJykubWFwKGl0ZW0gPT4gaXRlbS50cmltKCkpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmx1ZXByaW50OiB7XG4gICAgICAgICAgICAgICAgcGxhdGZvcm0sXG4gICAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgICBzdGF0ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZpZ21hOiBpdGVtXG4gICAgICAgIH07XG4gICAgfSk7XG4gICAgY29uc3Qgc3RhdGVzQnlQbGF0Zm9ybSA9IHN0YXRlcy5yZWR1Y2UoKGFsbCwgaXRlbSkgPT4ge1xuICAgICAgICBpZiAoIWFsbFtpdGVtLmJsdWVwcmludC5wbGF0Zm9ybV0pIHtcbiAgICAgICAgICAgIGFsbFtpdGVtLmJsdWVwcmludC5wbGF0Zm9ybV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBhbGxbaXRlbS5ibHVlcHJpbnQucGxhdGZvcm1dLnB1c2goaXRlbSk7XG4gICAgICAgIHJldHVybiBhbGw7XG4gICAgfSwge30pO1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhzdGF0ZXNCeVBsYXRmb3JtKS5tYXAoKFtrZXksIGl0ZW1zXSkgPT4gKHtcbiAgICAgICAgcGxhdGZvcm06IGtleSxcbiAgICAgICAgY29udGV4dHM6IGl0ZW1zLnJlZHVjZSgoYWxsLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFsbFtpdGVtLmJsdWVwcmludC5jb250ZXh0XSkge1xuICAgICAgICAgICAgICAgIGFsbFtpdGVtLmJsdWVwcmludC5jb250ZXh0XSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWxsW2l0ZW0uYmx1ZXByaW50LmNvbnRleHRdLnB1c2goaXRlbSk7XG4gICAgICAgICAgICByZXR1cm4gYWxsO1xuICAgICAgICB9LCB7fSlcbiAgICB9KSk7XG59XG5mdW5jdGlvbiBnZXRDb250ZXh0UGFnZSgpIHtcbiAgICBjb25zdCBwYWdlSWQgPSBhY3Rpb25zLmdldERvY3VtZW50VmFsdWUoeyBrZXk6ICdjb250ZXh0UGFnZUlkJyB9KTtcbiAgICBsZXQgcGFnZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IHBhZ2VJZCAmJiBpdGVtLnR5cGUgPT09ICdQQUdFJyk7XG4gICAgaWYgKCFwYWdlKSB7XG4gICAgICAgIHBhZ2UgPSBmaWdtYS5jcmVhdGVQYWdlKCk7XG4gICAgICAgIHBhZ2UubmFtZSA9ICdtYXN0ZXIgLSBTdGF0ZXMnO1xuICAgICAgICBmaWdtYS5yb290LmFwcGVuZENoaWxkKHBhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gcGFnZTtcbn1cbmZ1bmN0aW9uIGdldFNjZW5hcmlvc1BhZ2UoKSB7XG4gICAgbGV0IHNjZW5hcmlvc1BhZ2UgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoaXRlbSA9PiBpdGVtLm5hbWUgPT09ICdtYXN0ZXIgLSBTY2VuYXJpb3MnKTtcbiAgICBpZiAoIXNjZW5hcmlvc1BhZ2UpIHtcbiAgICAgICAgc2NlbmFyaW9zUGFnZSA9IGZpZ21hLmNyZWF0ZVBhZ2UoKTtcbiAgICAgICAgc2NlbmFyaW9zUGFnZS5uYW1lID0gJ21hc3RlciAtIFNjZW5hcmlvcyc7XG4gICAgICAgIGZpZ21hLnJvb3QuYXBwZW5kQ2hpbGQoc2NlbmFyaW9zUGFnZSk7XG4gICAgfVxuICAgIHJldHVybiBzY2VuYXJpb3NQYWdlO1xufVxuY29uc3QgYWN0aW9ucyA9IHtcbiAgICBnZXRQYWdlcygpIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLnJvb3QuY2hpbGRyZW4ubWFwKGl0ZW0gPT4gKHtcbiAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgbmFtZTogaXRlbS5uYW1lXG4gICAgICAgIH0pKTtcbiAgICB9LFxuICAgIGdldFBhZ2VOb2Rlcyh7IHBhZ2VJZCB9KSB7XG4gICAgICAgIGFjdGlvbnMub3JnYW5pemVTdGF0ZXNQYWdlKCk7XG4gICAgICAgIHJldHVybiBmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IHBhZ2VJZClcbiAgICAgICAgICAgIC5jaGlsZHJlbi5tYXAoaXRlbSA9PiAoe1xuICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICBuYW1lOiBpdGVtLm5hbWUsXG4gICAgICAgICAgICBibHVlcHJpbnQ6IEpTT04ucGFyc2UoaXRlbS5nZXRQbHVnaW5EYXRhKCdibHVlcHJpbnQnKSlcbiAgICAgICAgfSkpO1xuICAgIH0sXG4gICAgc2VsZWN0Tm9kZSh7IG5vZGVJZCB9KSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZUlkKTtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbbm9kZV0pO1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW25vZGVdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXR1cFNjZW5hcmlvcyh7IHV1aWRBcnIgfSkge1xuICAgICAgICBjb25zdCBjb250ZXh0UGFnZSA9IGdldENvbnRleHRQYWdlKCk7XG4gICAgICAgIGxldCBzY2VuYXJpb3NQYWdlID0gZ2V0U2NlbmFyaW9zUGFnZSgpO1xuICAgICAgICAvLyBDbGVhbiBzY2VuYXJpb3MgcGFnZVxuICAgICAgICBzY2VuYXJpb3NQYWdlLmNoaWxkcmVuLmZvckVhY2goaXRlbSA9PiBpdGVtLnJlbW92ZSgpKTtcbiAgICAgICAgY29uc3Qgc2NlbmFyaW9zID0gSlNPTi5wYXJzZShmaWdtYS5yb290LmdldFBsdWdpbkRhdGEoJ3NjZW5hcmlvcycpIHx8ICdbXScpO1xuICAgICAgICBsZXQgc2NlbmFyaW9YID0gMDtcbiAgICAgICAgbGV0IHNjZW5hcmlvWSA9IDA7XG4gICAgICAgIGxldCBzY2VuYXJpb0hlaWdodCA9IDA7XG4gICAgICAgIHNjZW5hcmlvcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgc2NlbmFyaW9IZWlnaHQgPSAwO1xuICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBbXTtcbiAgICAgICAgICAgIGl0ZW0uc3RhdGVzLmZvckVhY2godXVpZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29udGV4dFBhZ2UuZmluZE9uZShub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgJiYgbm9kZS5pZCA9PT0gdXVpZEFyclt1dWlkXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29tcG9uZW50LmNyZWF0ZUluc3RhbmNlKCk7XG4gICAgICAgICAgICAgICAgbm9kZXMucHVzaChpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UueCA9IHNjZW5hcmlvWDtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS55ID0gc2NlbmFyaW9ZO1xuICAgICAgICAgICAgICAgIHNjZW5hcmlvWCArPSBpbnN0YW5jZS53aWR0aCArIDMwO1xuICAgICAgICAgICAgICAgIHNjZW5hcmlvSGVpZ2h0ID0gTWF0aC5tYXgoY29tcG9uZW50LmhlaWdodCwgc2NlbmFyaW9IZWlnaHQpO1xuICAgICAgICAgICAgICAgIHNjZW5hcmlvc1BhZ2UuYXBwZW5kQ2hpbGQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWdtYS5ncm91cChub2Rlcywgc2NlbmFyaW9zUGFnZSkubmFtZSA9IGl0ZW0udGl0bGU7XG4gICAgICAgICAgICBzY2VuYXJpb1ggPSAwO1xuICAgICAgICAgICAgc2NlbmFyaW9ZICs9IHNjZW5hcmlvSGVpZ2h0ICsgMTIwO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcGxhdGZvcm1zLmZvckVhY2gocGxhdGZvcm0gPT4ge1xuICAgICAgICAvLyAgIE9iamVjdC5lbnRyaWVzKHBsYXRmb3JtLmNvbnRleHRzKS5mb3JFYWNoKChbY29udGV4dE5hbWUsIHN0YXRlc10pID0+IHtcbiAgICAgICAgLy8gICAgIHN0YXRlcy5mb3JFYWNoKClcbiAgICAgICAgLy8gICB9KVxuICAgICAgICAvLyB9KVxuICAgIH0sXG4gICAgb3JnYW5pemVTdGF0ZXNQYWdlKCkge1xuICAgICAgICBjb25zdCBjb250ZXh0UGFnZSA9IGdldENvbnRleHRQYWdlKCk7XG4gICAgICAgIGNvbnN0IHN0YXRlc0J5Q29udGV4dCA9IGdldFBsYXRmb3Jtc1dpdGhDb250ZXh0cygpO1xuICAgICAgICBjb25zdCBjYWxjdWxhdGlvbnMgPSBzdGF0ZXNCeUNvbnRleHQubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgaXRlbSksIHsgeTogMCwgaGVpZ2h0OiBPYmplY3QuZW50cmllcyhpdGVtLmNvbnRleHRzKS5yZWR1Y2UoKG1heEhlaWdodCwgWywgc3RhdGVzXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBzdGF0ZXMucmVkdWNlKCh0b3RhbCwgc3RhdGUpID0+IHRvdGFsICsgc3RhdGUuZmlnbWEuaGVpZ2h0ICsgMTIwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KG1heEhlaWdodCwgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9LCAwKSB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNhbGN1bGF0aW9ucy5yZWR1Y2UoKHByZXYsIGN1cnJlbnQsIGN1cnJlbnRJbmRleCkgPT4ge1xuICAgICAgICAgICAgY2FsY3VsYXRpb25zW2N1cnJlbnRJbmRleF0ueSA9IHByZXYueSArIHByZXYuaGVpZ2h0ICsgMTIwO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgY29udGV4dFg7XG4gICAgICAgIGxldCBzdGF0ZVk7XG4gICAgICAgIGNhbGN1bGF0aW9ucy5mb3JFYWNoKHBsYXRmb3JtID0+IHtcbiAgICAgICAgICAgIGNvbnRleHRYID0gMDtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHBsYXRmb3JtLmNvbnRleHRzKS5mb3JFYWNoKChbY29udGV4dE5hbWUsIHN0YXRlc10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZXh0V2lkdGggPSBwbGF0Zm9ybS5jb250ZXh0c1tjb250ZXh0TmFtZV0ucmVkdWNlKChtYXhXaWR0aCwgaXRlbSkgPT4gTWF0aC5tYXgoaXRlbS5maWdtYS53aWR0aCwgbWF4V2lkdGgpLCAwKTtcbiAgICAgICAgICAgICAgICBzdGF0ZVkgPSBwbGF0Zm9ybS55O1xuICAgICAgICAgICAgICAgIHN0YXRlcy5mb3JFYWNoKHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJhbWUgPSBjb250ZXh0UGFnZS5maW5kT25lKG5vZGUgPT4gbm9kZS5pZCA9PT0gc3RhdGUuZmlnbWEuaWQpO1xuICAgICAgICAgICAgICAgICAgICBmcmFtZS54ID0gY29udGV4dFg7XG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLnkgPSBzdGF0ZVk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlWSArPSBzdGF0ZS5maWdtYS5oZWlnaHQgKyAxMjA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udGV4dFggKz0gY29udGV4dFdpZHRoICsgODA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBjcmVhdGVTdGF0ZUZyYW1lKHsgbmFtZSwgYmx1ZXByaW50LCB3aWR0aCwgaGVpZ2h0IH0pIHtcbiAgICAgICAgY29uc3QgcGFnZUlkID0gYWN0aW9ucy5nZXREb2N1bWVudFZhbHVlKHsga2V5OiAnY29udGV4dFBhZ2VJZCcgfSk7XG4gICAgICAgIGNvbnN0IHBhZ2UgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBwYWdlSWQgJiYgaXRlbS50eXBlID09PSAnUEFHRScpO1xuICAgICAgICBpZiAoIXBhZ2UpXG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIGNvbnN0IGZyYW1lID0gZmlnbWEuY3JlYXRlQ29tcG9uZW50KCk7XG4gICAgICAgIGZyYW1lLm5hbWUgPSBuYW1lO1xuICAgICAgICBmcmFtZS5iYWNrZ3JvdW5kcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDEsIGc6IDEsIGI6IDEgfSB9XTtcbiAgICAgICAgZnJhbWUucmVzaXplV2l0aG91dENvbnN0cmFpbnRzKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBmcmFtZS5zZXRQbHVnaW5EYXRhKCdibHVlcHJpbnQnLCBKU09OLnN0cmluZ2lmeShibHVlcHJpbnQpKTtcbiAgICAgICAgZnJhbWUuc2V0UGx1Z2luRGF0YSgnc3RhdHVzJywgJ2RyYWZ0Jyk7XG4gICAgICAgIHBhZ2UuYXBwZW5kQ2hpbGQoZnJhbWUpO1xuICAgICAgICBhY3Rpb25zLm9yZ2FuaXplU3RhdGVzUGFnZSgpO1xuICAgICAgICBwYWdlLnNlbGVjdGlvbiA9IFtmcmFtZV07XG4gICAgICAgIHJldHVybiB7IGlkOiBmcmFtZS5pZCB9O1xuICAgIH0sXG4gICAgc2V0RG9jdW1lbnRWYWx1ZSh7IGtleSwgdmFsdWUgfSkge1xuICAgICAgICBmaWdtYS5yb290LnNldFBsdWdpbkRhdGEoa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgIH0sXG4gICAgZ2V0RG9jdW1lbnRWYWx1ZSh7IGtleSB9KSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGZpZ21hLnJvb3QuZ2V0UGx1Z2luRGF0YShrZXkpKTtcbiAgICB9LFxuICAgIHNldE5vZGVWYWx1ZSh7IG5vZGVJZCwga2V5LCB2YWx1ZSB9KSB7XG4gICAgICAgIGZpZ21hLnJvb3QuZmluZE9uZShpdGVtID0+IGl0ZW0uaWQgPT09IG5vZGVJZCkuc2V0UGx1Z2luRGF0YShrZXksIHZhbHVlKTtcbiAgICB9LFxuICAgIGdldE5vZGVWYWx1ZSh7IG5vZGVJZCwga2V5IH0pIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLnJvb3QuZmluZE9uZShpdGVtID0+IGl0ZW0uaWQgPT09IG5vZGVJZCkuZ2V0UGx1Z2luRGF0YShrZXkpO1xuICAgIH0sXG4gICAgZ2V0OiAoeyBrZXkgfSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhrZXkpO1xuICAgIH0pLFxuICAgIHNldDogKHsga2V5LCB2YWx1ZSB9KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKGtleSwgdmFsdWUpO1xuICAgIH0pXG59O1xuLy8gSGFuZGxlIHJlcXVlc3RzXG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIGNvbnN0IHBheWxvYWQgPSB5aWVsZCBhY3Rpb25zW21lc3NhZ2UudHlwZV0obWVzc2FnZS5wYXlsb2FkKTtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdyZXNwb25zZScsIGlkOiBtZXNzYWdlLmlkLCBwYXlsb2FkIH0pO1xufSk7XG4vLyBTaG93IHdpZGdldCB1aVxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCBVSV9PUFRJT05TKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=