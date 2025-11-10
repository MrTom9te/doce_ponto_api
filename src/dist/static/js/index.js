(() => { // webpackBootstrap
"use strict";
var __webpack_modules__ = ({
"./node_modules/@rspack/core/dist/cssExtractHmr.js": (function (__unused_webpack_module, exports) {

var __nested_webpack_require_18_37__ = {};
__nested_webpack_require_18_37__.d = (exports1, definition)=>{
    for(var key in definition)__nested_webpack_require_18_37__.o(definition, key) && !__nested_webpack_require_18_37__.o(exports1, key) && Object.defineProperty(exports1, key, {
        enumerable: !0,
        get: definition[key]
    });
}, __nested_webpack_require_18_37__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop), __nested_webpack_require_18_37__.r = (exports1)=>{
    'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports1, Symbol.toStringTag, {
        value: 'Module'
    }), Object.defineProperty(exports1, '__esModule', {
        value: !0
    });
};
var __nested_webpack_exports__ = {};
function normalizeUrl(url) {
    let urlString = url.trim();
    if (/^data:/i.test(urlString)) return urlString;
    let protocol = -1 !== urlString.indexOf("//") ? `${urlString.split("//")[0]}//` : "", components = urlString.replace(RegExp(protocol, "i"), "").split("/"), host = components[0].toLowerCase().replace(/\.$/, "");
    return components[0] = "", protocol + host + components.reduce((accumulator, item)=>{
        switch(item){
            case "..":
                accumulator.pop();
                break;
            case ".":
                break;
            default:
                accumulator.push(item);
        }
        return accumulator;
    }, []).join("/");
}
__nested_webpack_require_18_37__.r(__nested_webpack_exports__), __nested_webpack_require_18_37__.d(__nested_webpack_exports__, {
    cssReload: ()=>cssReload,
    normalizeUrl: ()=>normalizeUrl
});
const srcByModuleId = Object.create(null), noDocument = "undefined" == typeof document, { forEach } = Array.prototype;
function noop() {}
function updateCss(el, url) {
    let normalizedUrl;
    if (url) normalizedUrl = url;
    else {
        let href = el.getAttribute("href");
        if (!href) return;
        normalizedUrl = href.split("?")[0];
    }
    if (!isUrlRequest(el.href) || !1 === el.isLoaded || !normalizedUrl || !(normalizedUrl.indexOf(".css") > -1)) return;
    el.visited = !0;
    let newEl = el.cloneNode();
    newEl.isLoaded = !1, newEl.addEventListener("load", ()=>{
        !newEl.isLoaded && (newEl.isLoaded = !0, el.parentNode && el.parentNode.removeChild(el));
    }), newEl.addEventListener("error", ()=>{
        !newEl.isLoaded && (newEl.isLoaded = !0, el.parentNode && el.parentNode.removeChild(el));
    }), newEl.href = `${normalizedUrl}?${Date.now()}`;
    let parent = el.parentNode;
    parent && (el.nextSibling ? parent.insertBefore(newEl, el.nextSibling) : parent.appendChild(newEl));
}
function reloadAll() {
    let elements = document.querySelectorAll("link");
    forEach.call(elements, (el)=>{
        !0 !== el.visited && updateCss(el);
    });
}
function isUrlRequest(url) {
    return !!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}
function cssReload(moduleId, options) {
    var fn;
    let timeout;
    if (noDocument) return console.log("[HMR] No `window.document` found, CSS HMR disabled"), noop;
    let getScriptSrc = function(moduleId) {
        let src = srcByModuleId[moduleId];
        if (!src) {
            if (document.currentScript) ({ src } = document.currentScript);
            else {
                let scripts = document.getElementsByTagName("script"), lastScriptTag = scripts[scripts.length - 1];
                lastScriptTag && ({ src } = lastScriptTag);
            }
            srcByModuleId[moduleId] = src;
        }
        return (fileMap)=>{
            if (!src) return null;
            let splitResult = src.match(/([^\\/]+)\.js$/), filename = splitResult && splitResult[1];
            return filename && fileMap ? fileMap.split(",").map((mapRule)=>{
                let reg = RegExp(`${filename}\\.js$`, "g");
                return normalizeUrl(src.replace(reg, `${mapRule.replace(/{fileName}/g, filename)}.css`));
            }) : [
                src.replace(".js", ".css")
            ];
        };
    }(moduleId);
    return fn = function() {
        let src = getScriptSrc(options.filename), reloaded = function(src) {
            if (!src) return !1;
            let elements = document.querySelectorAll("link"), loaded = !1;
            return forEach.call(elements, (el)=>{
                var href;
                let ret, normalizedHref;
                if (!el.href) return;
                let url = (href = el.href, ret = "", normalizedHref = normalizeUrl(href), src.some((url)=>{
                    normalizedHref.indexOf(src) > -1 && (ret = url);
                }), ret);
                !isUrlRequest(url) || !0 !== el.visited && url && (updateCss(el, url), loaded = !0);
            }), loaded;
        }(src);
        if (options.locals) {
            console.log("[HMR] Detected local CSS Modules. Reload all CSS"), reloadAll();
            return;
        }
        reloaded ? console.log("[HMR] CSS reload %s", src && src.join(" ")) : (console.log("[HMR] Reload all CSS"), reloadAll());
    }, timeout = 0, function(...args) {
        let self = this;
        clearTimeout(timeout), timeout = setTimeout(function() {
            return fn.apply(self, args);
        }, 50);
    };
}
for(var __webpack_i__ in exports.cssReload = __nested_webpack_exports__.cssReload, exports.normalizeUrl = __nested_webpack_exports__.normalizeUrl, __nested_webpack_exports__)-1 === [
    "cssReload",
    "normalizeUrl"
].indexOf(__webpack_i__) && (exports[__webpack_i__] = __nested_webpack_exports__[__webpack_i__]);
Object.defineProperty(exports, "__esModule", ({
    value: !0
}));


}),
"./src/App.css": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
// extracted by css-extract-rspack-plugin

    if(true) {
      (function() {
        var localsJsonString = undefined;
        // 1762734881109
        var cssReload = (__webpack_require__("./node_modules/@rspack/core/dist/cssExtractHmr.js")/* .cssReload */.cssReload)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

}),
"./src/components/Alert.css": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
// extracted by css-extract-rspack-plugin

    if(true) {
      (function() {
        var localsJsonString = undefined;
        // 1762734881119
        var cssReload = (__webpack_require__("./node_modules/@rspack/core/dist/cssExtractHmr.js")/* .cssReload */.cssReload)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

}),
"./src/components/ProductCard.css": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
// extracted by css-extract-rspack-plugin

    if(true) {
      (function() {
        var localsJsonString = undefined;
        // 1762734881112
        var cssReload = (__webpack_require__("./node_modules/@rspack/core/dist/cssExtractHmr.js")/* .cssReload */.cssReload)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

}),
"./src/components/Spinner.css": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
// extracted by css-extract-rspack-plugin

    if(true) {
      (function() {
        var localsJsonString = undefined;
        // 1762734881117
        var cssReload = (__webpack_require__("./node_modules/@rspack/core/dist/cssExtractHmr.js")/* .cssReload */.cssReload)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

}),
"./src/pages/OrderPage.css": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
// extracted by css-extract-rspack-plugin

    if(true) {
      (function() {
        var localsJsonString = undefined;
        // 1762734881115
        var cssReload = (__webpack_require__("./node_modules/@rspack/core/dist/cssExtractHmr.js")/* .cssReload */.cssReload)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

}),
"./src/pages/OrderSummaryPage.css": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
// extracted by css-extract-rspack-plugin

    if(true) {
      (function() {
        var localsJsonString = undefined;
        // 1762734881113
        var cssReload = (__webpack_require__("./node_modules/@rspack/core/dist/cssExtractHmr.js")/* .cssReload */.cssReload)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

}),
"./src/pages/OrderTrackPage.css": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
// extracted by css-extract-rspack-plugin

    if(true) {
      (function() {
        var localsJsonString = undefined;
        // 1762734881116
        var cssReload = (__webpack_require__("./node_modules/@rspack/core/dist/cssExtractHmr.js")/* .cssReload */.cssReload)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

}),
"./src/App.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/react-router/dist/development/chunk-UIGDSWPH.mjs");
/* ESM import */var _App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/App.css");
/* ESM import */var _pages_ProductListPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/pages/ProductListPage.tsx");
/* ESM import */var _pages_OrderPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/pages/OrderPage.tsx");
/* ESM import */var _pages_OrderSummaryPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/pages/OrderSummaryPage.tsx");
/* ESM import */var _pages_OrderTrackPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/pages/OrderTrackPage.tsx");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");







const App = ()=>{
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.BrowserRouter, {
        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("header", {
                    className: "app-header",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Link, {
                            to: "/",
                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h1", {
                                        children: "Doce Ponto"
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                        lineNumber: 15,
                                        columnNumber: 15
                                    }, undefined),
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                                        children: "Sua vitrine de doce online"
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                        lineNumber: 16,
                                        columnNumber: 15
                                    }, undefined)
                                ]
                            }, void 0, true, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                lineNumber: 14,
                                columnNumber: 13
                            }, undefined)
                        }, void 0, false, {
                            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                            lineNumber: 13,
                            columnNumber: 11
                        }, undefined),
                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("nav", {
                            children: [
                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Link, {
                                    to: "/",
                                    children: "Cat\xe1logo"
                                }, void 0, false, {
                                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                    lineNumber: 20,
                                    columnNumber: 13
                                }, undefined),
                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Link, {
                                    to: "/track-order",
                                    children: "Acompanhar Pedido"
                                }, void 0, false, {
                                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                    lineNumber: 21,
                                    columnNumber: 13
                                }, undefined)
                            ]
                        }, void 0, true, {
                            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, undefined)
                    ]
                }, void 0, true, {
                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, undefined),
                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("main", {
                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Routes, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Route, {
                                path: "/",
                                element: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_pages_ProductListPage__WEBPACK_IMPORTED_MODULE_2__.ProductListPage, {}, void 0, false, {
                                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                    lineNumber: 27,
                                    columnNumber: 38
                                }, void 0)
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, undefined),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Route, {
                                path: "/product/:productId",
                                element: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_pages_OrderPage__WEBPACK_IMPORTED_MODULE_3__.OrderPage, {}, void 0, false, {
                                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                    lineNumber: 28,
                                    columnNumber: 56
                                }, void 0)
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                lineNumber: 28,
                                columnNumber: 13
                            }, undefined),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Route, {
                                path: "/order/:orderId/summary",
                                element: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_pages_OrderSummaryPage__WEBPACK_IMPORTED_MODULE_4__.OrderSummaryPage, {}, void 0, false, {
                                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                    lineNumber: 31,
                                    columnNumber: 24
                                }, void 0)
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, undefined),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Route, {
                                path: "/track-order",
                                element: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_pages_OrderTrackPage__WEBPACK_IMPORTED_MODULE_5__.OrderTrackPage, {}, void 0, false, {
                                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                    lineNumber: 33,
                                    columnNumber: 49
                                }, void 0)
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, undefined)
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, undefined)
                }, void 0, false, {
                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, undefined)
            ]
        }, void 0, true, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/App.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, undefined);
};
_c = App;
/* ESM default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);
var _c;
$RefreshReg$(_c, "App");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/components/Alert.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Alert: () => (Alert)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var _Alert_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/components/Alert.css");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");


function Alert(param) {
    let { message, type } = param;
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: `alert alert-${type}`,
        children: message
    }, void 0, false, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/Alert.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = Alert;
var _c;
$RefreshReg$(_c, "Alert");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/components/ProductCard.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ProductCard: () => (ProductCard)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/react-router/dist/development/chunk-UIGDSWPH.mjs");
/* ESM import */var _ProductCard_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/components/ProductCard.css");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");



const getImageUrl = (imagePath)=>{
    // A API retorna a URL com 'images/...' e o servidor expõe em /static/
    return `/static/${imagePath}`;
};
function ProductCard(param) {
    let { product } = param;
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__.Link, {
        to: `/product/${product.id}`,
        className: "product-card",
        children: [
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("img", {
                src: getImageUrl(product.imageUrl),
                alt: product.name,
                className: "product-card-image"
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/ProductCard.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: "product-card-content",
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h3", {
                        className: "product-card-name",
                        children: product.name
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/ProductCard.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                        className: "product-card-price",
                        children: [
                            "R$ ",
                            product.price.toFixed(2).replace(".", ",")
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/ProductCard.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
                        type: "button",
                        className: "product-card-button",
                        children: "Ver detalhes"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/ProductCard.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/ProductCard.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/ProductCard.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = ProductCard;
var _c;
$RefreshReg$(_c, "ProductCard");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/components/Spinner.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Spinner: () => (Spinner)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var _Spinner_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/components/Spinner.css");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");


function Spinner() {
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: "spinner-overlay",
        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
            className: "spinner"
        }, void 0, false, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/Spinner.tsx",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/components/Spinner.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Spinner;
var _c;
$RefreshReg$(_c, "Spinner");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/index.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react/index.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* ESM import */var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/react-dom/client.js");
/* ESM import */var _App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/App.tsx");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");




const rootEl = document.getElementById('root');
if (rootEl) {
    const root = react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot(rootEl);
    root.render(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((react__WEBPACK_IMPORTED_MODULE_1___default().StrictMode), {
        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_App__WEBPACK_IMPORTED_MODULE_3__["default"], {}, void 0, false, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/index.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/index.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, undefined));
}

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/pages/OrderPage.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  OrderPage: () => (OrderPage)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react/index.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* ESM import */var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/react-router/dist/development/chunk-UIGDSWPH.mjs");
/* ESM import */var _services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/services/api.ts");
/* ESM import */var _components_Spinner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/Spinner.tsx");
/* ESM import */var _components_Alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/Alert.tsx");
/* ESM import */var _OrderPage_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/pages/OrderPage.css");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");

var _s = $RefreshSig$();






const getImageUrl = (imagePath)=>{
    return `/static/${imagePath}`;
};
function OrderPage() {
    _s();
    const { productId } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useParams)();
    const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useNavigate)();
    const [product, setProduct] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [submitting, setSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [formData, setFormData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerTaxId: "",
        deliveryDate: "",
        deliveryTime: "",
        quantity: 1
    });
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const fetchProduct = async ()=>{
            try {
                setLoading(true);
                const response = await _services_api__WEBPACK_IMPORTED_MODULE_2__["default"].get("/public/products");
                const foundProduct = response.data.data.find((p)=>p.id === productId);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    setError("Produto não encontrado.");
                }
            } catch (err) {
                setError("Falha ao carregar o produto.");
                console.error(err);
            } finally{
                setLoading(false);
            }
        };
        fetchProduct();
    }, [
        productId
    ]);
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!product) return;
        setSubmitting(true);
        setError(null);
        const orderData = {
            ...formData,
            productId: product.id,
            deliveryType: "PICKUP"
        };
        try {
            const response = await _services_api__WEBPACK_IMPORTED_MODULE_2__["default"].post("/public/orders", orderData);
            const order = response.data.data;
            navigate(`/order/${order.id}/summary`, {
                state: {
                    order
                }
            });
        } catch (err) {
            var _err_response_data, _err_response;
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.error) || "Ocorreu um erro ao criar o pedido.");
        } finally{
            setSubmitting(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Spinner__WEBPACK_IMPORTED_MODULE_3__.Spinner, {}, void 0, false, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
            lineNumber: 89,
            columnNumber: 12
        }, this);
    }
    if (!product && !error) {
        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Alert__WEBPACK_IMPORTED_MODULE_4__.Alert, {
            message: "Produto n\xe3o encontrado.",
            type: "error"
        }, void 0, false, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
            lineNumber: 93,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: "order-page-container",
        children: [
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
                type: "button",
                onClick: ()=>navigate(-1),
                className: "back-button",
                children: "← Voltar ao cat\xe1logo"
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Alert__WEBPACK_IMPORTED_MODULE_4__.Alert, {
                message: error,
                type: "error"
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                lineNumber: 105,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: "order-layout",
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                        className: "product-details",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("img", {
                                src: getImageUrl(product.imageUrl),
                                alt: product.name,
                                className: "product-image"
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h2", {
                                children: product.name
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                                className: "product-description",
                                children: product.description
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                                className: "product-price",
                                children: [
                                    "R$ ",
                                    product.price.toFixed(2).replace(".", ",")
                                ]
                            }, void 0, true, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                        className: "order-form-container",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h3", {
                                children: "Finalize seu Pedido"
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("form", {
                                onSubmit: handleSubmit,
                                className: "order-form",
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
                                        type: "text",
                                        name: "customerName",
                                        placeholder: "Nome Completo",
                                        onChange: handleChange,
                                        required: true
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                        lineNumber: 122,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
                                        type: "email",
                                        name: "customerEmail",
                                        placeholder: "Seu melhor e-mail",
                                        onChange: handleChange,
                                        required: true
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                        lineNumber: 129,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
                                        type: "tel",
                                        name: "customerPhone",
                                        placeholder: "Telefone (somente n\xfameros)",
                                        onChange: handleChange,
                                        required: true
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
                                        type: "text",
                                        name: "customerTaxId",
                                        placeholder: "CPF (somente n\xfameros)",
                                        onChange: handleChange,
                                        required: true
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
                                        type: "date",
                                        name: "deliveryDate",
                                        onChange: handleChange,
                                        required: true
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
                                        type: "text",
                                        name: "deliveryTime",
                                        placeholder: "Hor\xe1rio de Retirada (ex: 14h)",
                                        onChange: handleChange,
                                        required: true
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
                                        type: "number",
                                        name: "quantity",
                                        value: formData.quantity,
                                        onChange: handleChange,
                                        min: "1",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
                                        type: "submit",
                                        className: "submit-button",
                                        disabled: submitting,
                                        children: submitting ? "Enviando..." : "Confirmar Pedido e Pagar"
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                        lineNumber: 171,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderPage.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(OrderPage, "bccRaE2xePrJVCs19Qleirv4GJI=", false, function() {
    return [
        react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useParams,
        react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useNavigate
    ];
});
_c = OrderPage;
var _c;
$RefreshReg$(_c, "OrderPage");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/pages/OrderSummaryPage.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  OrderSummaryPage: () => (OrderSummaryPage)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/react-router/dist/development/chunk-UIGDSWPH.mjs");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react/index.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* ESM import */var _services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/services/api.ts");
/* ESM import */var _OrderSummaryPage_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/pages/OrderSummaryPage.css");
/* ESM import */var _components_Alert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/Alert.tsx");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");

var _s = $RefreshSig$(), _s1 = $RefreshSig$();





// Hook para polling
const useOrderStatus = (orderId)=>{
    _s();
    const [status, setStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("pending");
    const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useNavigate)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (!orderId) return;
        const interval = setInterval(async ()=>{
            try {
                const response = await _services_api__WEBPACK_IMPORTED_MODULE_2__["default"].get(`/public/orders/${orderId}`);
                const newStatus = response.data.data.status;
                if (newStatus === "confirmed") {
                    setStatus("confirmed");
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Erro ao buscar status do pedido:", error);
            }
        }, 5000); // Verifica a cada 5 segundos
        // Limpa o intervalo após 5 minutos ou quando o componente desmontar
        const timeout = setTimeout(()=>{
            clearInterval(interval);
        }, 300000);
        return ()=>{
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [
        orderId,
        navigate
    ]);
    return status;
};
_s(useOrderStatus, "zPMWBSFFtkOtC3KnLJgLJDrldj4=", false, function() {
    return [
        react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useNavigate
    ];
});
function OrderSummaryPage() {
    _s1();
    const location = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useLocation)();
    const { order } = location.state || {};
    const orderStatus = useOrderStatus(order === null || order === void 0 ? void 0 : order.id);
    if (!order) {
        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
            className: "summary-container",
            children: [
                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Alert__WEBPACK_IMPORTED_MODULE_4__.Alert, {
                    message: "Detalhes do pedido n\xe3o encontrados.",
                    type: "error"
                }, void 0, false, {
                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.Link, {
                    to: "/",
                    children: "Voltar para a loja"
                }, void 0, false, {
                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this);
    }
    const { paymentPix } = order;
    const handleCopy = ()=>{
        if (paymentPix === null || paymentPix === void 0 ? void 0 : paymentPix.qrCodeText) {
            navigator.clipboard.writeText(paymentPix.qrCodeText);
            alert("Código PIX copiado para a área de transferência!");
        }
    };
    if (orderStatus === "confirmed") {
        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
            className: "summary-container",
            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: "payment-confirmed-box",
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h2", {
                        children: "Pagamento Confirmado!"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                        children: [
                            "Obrigado, ",
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("strong", {
                                children: order.customerName
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                                lineNumber: 71,
                                columnNumber: 23
                            }, this),
                            "! Seu pedido",
                            " ",
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("strong", {
                                children: [
                                    "#",
                                    order.orderNumber
                                ]
                            }, void 0, true, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this),
                            " foi confirmado e j\xe1 est\xe1 em prepara\xe7\xe3o."
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                        className: "summary-actions",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.Link, {
                                to: `/track-order?orderId=${order.orderNumber}`,
                                children: "Acompanhar meu pedido"
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.Link, {
                                to: "/",
                                children: "Voltar para a loja"
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: "summary-container",
        children: [
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h2", {
                children: "Pedido Realizado! Falta pouco..."
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                children: [
                    "Para confirmar seu pedido ",
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("strong", {
                        children: [
                            "#",
                            order.orderNumber
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 90,
                        columnNumber: 35
                    }, this),
                    ", fa\xe7a o pagamento via PIX."
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: "pix-payment-box",
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h3", {
                        children: "Pague com PIX"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    (paymentPix === null || paymentPix === void 0 ? void 0 : paymentPix.qrCodeImage) ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("img", {
                        src: paymentPix.qrCodeImage,
                        alt: "PIX QR Code",
                        className: "pix-qrcode"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Alert__WEBPACK_IMPORTED_MODULE_4__.Alert, {
                        message: "N\xe3o foi poss\xedvel carregar o QR Code.",
                        type: "error"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                        children: 'Ou use o c\xf3digo "Copia e Cola":'
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                        className: "pix-code-text",
                        children: (paymentPix === null || paymentPix === void 0 ? void 0 : paymentPix.qrCodeText) || "Código indisponível"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
                        type: "button",
                        onClick: handleCopy,
                        disabled: !(paymentPix === null || paymentPix === void 0 ? void 0 : paymentPix.qrCodeText),
                        className: "copy-button",
                        children: "Copiar C\xf3digo"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                        className: "pix-expiry",
                        children: [
                            "O c\xf3digo expira em",
                            " ",
                            new Date(paymentPix.expiresAt).toLocaleTimeString()
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: "order-summary-details",
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h4", {
                        children: "Resumo do Pedido"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("strong", {
                                children: "Produto:"
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            " ",
                            order.productName
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("strong", {
                                children: "Quantidade:"
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            " ",
                            order.quantity
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("strong", {
                                children: "Valor Total:"
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            " R$",
                            " ",
                            order.totalPrice.toFixed(2).replace(".", ",")
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: "summary-actions",
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.Link, {
                        to: `/track-order?orderId=${order.orderNumber}`,
                        children: "Acompanhar meu pedido"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.Link, {
                        to: "/",
                        children: "Voltar para a loja"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderSummaryPage.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_s1(OrderSummaryPage, "RztaAkVVb8BBBf3LBjzP14upuBk=", false, function() {
    return [
        react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useLocation,
        useOrderStatus
    ];
});
_c = OrderSummaryPage;
var _c;
$RefreshReg$(_c, "OrderSummaryPage");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/pages/OrderTrackPage.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  OrderTrackPage: () => (OrderTrackPage)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react/index.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* ESM import */var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/react-router/dist/development/chunk-UIGDSWPH.mjs");
/* ESM import */var _services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/services/api.ts");
/* ESM import */var _components_Alert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/Alert.tsx");
/* ESM import */var _OrderTrackPage_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/pages/OrderTrackPage.css");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");

var _s = $RefreshSig$();





const statusMap = {
    pending: {
        text: "Aguardando Pagamento",
        step: 1
    },
    confirmed: {
        text: "Pedido Confirmado",
        step: 2
    },
    production: {
        text: "Em Produção",
        step: 3
    },
    ready: {
        text: "Pronto para Retirada",
        step: 4
    },
    delivered: {
        text: "Entregue",
        step: 5
    },
    cancelled: {
        text: "Cancelado",
        step: 0
    }
};
const StatusTimeline = (param)=>{
    let { currentStatus } = param;
    const { step: currentStep } = statusMap[currentStatus] || {
        step: 0
    };
    if (currentStatus === "cancelled") {
        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Alert__WEBPACK_IMPORTED_MODULE_3__.Alert, {
            message: "Este pedido foi cancelado.",
            type: "error"
        }, void 0, false, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
            lineNumber: 22,
            columnNumber: 12
        }, undefined);
    }
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: "timeline",
        children: Object.values(statusMap).filter((s)=>s.step > 0 && s.step < 5) // Don't show cancelled or delivered in timeline
        .map((param)=>{
            let { text, step } = param;
            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: `timeline-step ${step <= currentStep ? "completed" : ""}`,
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                        className: "timeline-dot"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                        lineNumber: 34,
                        columnNumber: 13
                    }, undefined),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                        className: "timeline-text",
                        children: text
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                        lineNumber: 35,
                        columnNumber: 13
                    }, undefined)
                ]
            }, step, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                lineNumber: 30,
                columnNumber: 11
            }, undefined);
        })
    }, void 0, false, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, undefined);
};
_c = StatusTimeline;
function OrderTrackPage() {
    _s();
    const [searchParams, setSearchParams] = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useSearchParams)();
    const [orderId, setOrderId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(searchParams.get("orderId") || "");
    const [order, setOrder] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const fetchOrder = async (id)=>{
        if (!id) return;
        setLoading(true);
        setError(null);
        setOrder(null);
        try {
            const response = await _services_api__WEBPACK_IMPORTED_MODULE_2__["default"].get(`/public/orders/${id}`);
            setOrder(response.data.data);
        } catch (err) {
            var _err_response_data, _err_response;
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.error) || "Erro ao buscar o pedido. Verifique o código.");
        } finally{
            setLoading(false);
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const initialOrderId = searchParams.get("orderId");
        if (initialOrderId) {
            fetchOrder(initialOrderId);
        }
    }, []);
    const handleSearch = (e)=>{
        e.preventDefault();
        setSearchParams({
            orderId
        });
        fetchOrder(orderId);
    };
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: "track-page-container",
        children: [
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h2", {
                children: "Acompanhe seu Pedido"
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("form", {
                onSubmit: handleSearch,
                className: "track-form",
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
                        type: "text",
                        value: orderId,
                        onChange: (e)=>setOrderId(e.target.value),
                        placeholder: "Digite o c\xf3digo do seu pedido (ex: PED-...)"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
                        type: "submit",
                        disabled: loading,
                        children: loading ? "Buscando..." : "Buscar"
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Alert__WEBPACK_IMPORTED_MODULE_3__.Alert, {
                message: error,
                type: "error"
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                lineNumber: 95,
                columnNumber: 17
            }, this),
            order && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: "status-card",
                children: [
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h3", {
                        children: [
                            "Pedido: ",
                            order.orderNumber
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                        children: [
                            "Ol\xe1, ",
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("strong", {
                                children: order.customerName
                            }, void 0, false, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                                lineNumber: 101,
                                columnNumber: 18
                            }, this),
                            "! Este \xe9 o status atual do seu pedido:"
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(StatusTimeline, {
                        currentStatus: order.status
                    }, void 0, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                        className: "status-footer",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("strong", {
                                        children: "Data de Entrega/Retirada:"
                                    }, void 0, false, {
                                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, this),
                                    " ",
                                    new Date(order.deliveryDate).toLocaleDateString(),
                                    " \xe0s",
                                    " ",
                                    order.deliveryTime
                                ]
                            }, void 0, true, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                                children: [
                                    "\xdaltima atualiza\xe7\xe3o: ",
                                    new Date(order.updatedAt).toLocaleString()
                                ]
                            }, void 0, true, {
                                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/OrderTrackPage.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_s(OrderTrackPage, "tO4N3sTMEuRwIjBsGOmDl+0LNGA=", false, function() {
    return [
        react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useSearchParams
    ];
});
_c1 = OrderTrackPage;
var _c, _c1;
$RefreshReg$(_c, "StatusTimeline");
$RefreshReg$(_c1, "OrderTrackPage");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/pages/ProductListPage.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ProductListPage: () => (ProductListPage)
});
/* ESM import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/react/jsx-dev-runtime.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/react/index.js");
/* ESM import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* ESM import */var _services_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/services/api.ts");
/* ESM import */var _components_ProductCard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/components/ProductCard.tsx");
/* ESM import */var _components_Spinner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/components/Spinner.tsx");
/* ESM import */var _components_Alert__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/components/Alert.tsx");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");

var _s = $RefreshSig$();





function ProductListPage() {
    _s();
    const [products, setProducts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        const fetchProducts = async ()=>{
            try {
                setLoading(true);
                const response = await _services_api__WEBPACK_IMPORTED_MODULE_2__["default"].get("/public/products");
                setProducts(response.data.data);
                setError(null);
            } catch (err) {
                setError("Falha ao carregar os produtos. Tente novamente mais tarde.");
                console.error(err);
            } finally{
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    if (loading) {
        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Spinner__WEBPACK_IMPORTED_MODULE_4__.Spinner, {}, void 0, false, {
            fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/ProductListPage.tsx",
            lineNumber: 32,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        children: [
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h2", {
                children: "Nossos Produtos"
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/ProductListPage.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Alert__WEBPACK_IMPORTED_MODULE_5__.Alert, {
                message: error,
                type: "error"
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/ProductListPage.tsx",
                lineNumber: 38,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
                className: "product-grid",
                children: products.length === 0 && !error ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
                    style: {
                        textAlign: "center",
                        gridColumn: "1 / -1"
                    },
                    children: "Nenhum produto dispon\xedvel no momento. Volte em breve!"
                }, void 0, false, {
                    fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/ProductListPage.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this) : products.map((product)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ProductCard__WEBPACK_IMPORTED_MODULE_3__.ProductCard, {
                        product: product
                    }, product.id, false, {
                        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/ProductListPage.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/ProductListPage.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "/home/mr_tomate/Lixeira/JavaScript/doce_ponto_api/spa/src/pages/ProductListPage.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(ProductListPage, "3+N/VFIgZOBgubN9oS5aTzm2qqY=");
_c = ProductListPage;
var _c;
$RefreshReg$(_c, "ProductListPage");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/services/api.ts": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});
/* ESM import */var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/axios/lib/axios.js");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");

const api = axios__WEBPACK_IMPORTED_MODULE_0__["default"].create({
    baseURL: 'http://localhost:3000/api'
});
/* ESM default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),

});
/************************************************************************/
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
if (cachedModule.error !== undefined) throw cachedModule.error;
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
id: moduleId,
loaded: false,
exports: {}
});
// Execute the module function
try {

var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
module = execOptions.module;
if (!execOptions.factory) {
  console.error("undefined factory", moduleId);
  throw Error("RuntimeError: factory is undefined (" + moduleId + ")");
}
execOptions.factory.call(module.exports, module, module.exports, execOptions.require);

} catch (e) {
module.error = e;
throw e;
}
// Flag the module as loaded
module.loaded = true;
// Return the exports of the module
return module.exports;

}

// expose the modules object (__webpack_modules__)
__webpack_require__.m = __webpack_modules__;

// expose the module cache
__webpack_require__.c = __webpack_module_cache__;

// expose the module execution interceptor
__webpack_require__.i = [];

/************************************************************************/
// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/get mini-css chunk filename
(() => {
// This function allow to reference chunks
__webpack_require__.miniCssF = (chunkId) => {
  // return url for filenames not based on template
  
  // return url for filenames based on template
  return "static/css/" + chunkId + ".css"
}
})();
// webpack/runtime/get_chunk_update_filename
(() => {
__webpack_require__.hu = (chunkId) => ('' + chunkId + '.' + __webpack_require__.h() + '.hot-update.js')
})();
// webpack/runtime/get_full_hash
(() => {
__webpack_require__.h = () => ("3ad49fb6ec36bc08")
})();
// webpack/runtime/get_main_filename/update manifest
(() => {
__webpack_require__.hmrF = function () {
            return "index." + __webpack_require__.h() + ".hot-update.json";
         };
        
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
// webpack/runtime/hot_module_replacement
(() => {
var currentModuleData = {};
var installedModules = __webpack_require__.c;

// module and require creation
var currentChildModule;
var currentParents = [];

// status
var registeredStatusHandlers = [];
var currentStatus = "idle";

// while downloading
var blockingPromises = 0;
var blockingPromisesWaiting = [];

// The update info
var currentUpdateApplyHandlers;
var queuedInvalidatedModules;

__webpack_require__.hmrD = currentModuleData;
__webpack_require__.i.push(function (options) {
	var module = options.module;
	var require = createRequire(options.require, options.id);
	module.hot = createModuleHotObject(options.id, module);
	module.parents = currentParents;
	module.children = [];
	currentParents = [];
	options.require = require;
});

__webpack_require__.hmrC = {};
__webpack_require__.hmrI = {};

function createRequire(require, moduleId) {
	var me = installedModules[moduleId];
	if (!me) return require;
	var fn = function (request) {
		if (me.hot.active) {
			if (installedModules[request]) {
				var parents = installedModules[request].parents;
				if (parents.indexOf(moduleId) === -1) {
					parents.push(moduleId);
				}
			} else {
				currentParents = [moduleId];
				currentChildModule = request;
			}
			if (me.children.indexOf(request) === -1) {
				me.children.push(request);
			}
		} else {
			console.warn(
				"[HMR] unexpected require(" +
				request +
				") from disposed module " +
				moduleId
			);
			currentParents = [];
		}
		return require(request);
	};
	var createPropertyDescriptor = function (name) {
		return {
			configurable: true,
			enumerable: true,
			get: function () {
				return require[name];
			},
			set: function (value) {
				require[name] = value;
			}
		};
	};
	for (var name in require) {
		if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
			Object.defineProperty(fn, name, createPropertyDescriptor(name));
		}
	}

	fn.e = function (chunkId, fetchPriority) {
		return trackBlockingPromise(require.e(chunkId, fetchPriority));
	};

	return fn;
}

function createModuleHotObject(moduleId, me) {
	var _main = currentChildModule !== moduleId;
	var hot = {
		_acceptedDependencies: {},
		_acceptedErrorHandlers: {},
		_declinedDependencies: {},
		_selfAccepted: false,
		_selfDeclined: false,
		_selfInvalidated: false,
		_disposeHandlers: [],
		_main: _main,
		_requireSelf: function () {
			currentParents = me.parents.slice();
			currentChildModule = _main ? undefined : moduleId;
			__webpack_require__(moduleId);
		},
		active: true,
		accept: function (dep, callback, errorHandler) {
			if (dep === undefined) hot._selfAccepted = true;
			else if (typeof dep === "function") hot._selfAccepted = dep;
			else if (typeof dep === "object" && dep !== null) {
				for (var i = 0; i < dep.length; i++) {
					hot._acceptedDependencies[dep[i]] = callback || function () { };
					hot._acceptedErrorHandlers[dep[i]] = errorHandler;
				}
			} else {
				hot._acceptedDependencies[dep] = callback || function () { };
				hot._acceptedErrorHandlers[dep] = errorHandler;
			}
		},
		decline: function (dep) {
			if (dep === undefined) hot._selfDeclined = true;
			else if (typeof dep === "object" && dep !== null)
				for (var i = 0; i < dep.length; i++)
					hot._declinedDependencies[dep[i]] = true;
			else hot._declinedDependencies[dep] = true;
		},
		dispose: function (callback) {
			hot._disposeHandlers.push(callback);
		},
		addDisposeHandler: function (callback) {
			hot._disposeHandlers.push(callback);
		},
		removeDisposeHandler: function (callback) {
			var idx = hot._disposeHandlers.indexOf(callback);
			if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
		},
		invalidate: function () {
			this._selfInvalidated = true;
			switch (currentStatus) {
				case "idle":
					currentUpdateApplyHandlers = [];
					Object.keys(__webpack_require__.hmrI).forEach(function (key) {
						__webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
					});
					setStatus("ready");
					break;
				case "ready":
					Object.keys(__webpack_require__.hmrI).forEach(function (key) {
						__webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
					});
					break;
				case "prepare":
				case "check":
				case "dispose":
				case "apply":
					(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
						moduleId
					);
					break;
				default:
					break;
			}
		},
		check: hotCheck,
		apply: hotApply,
		status: function (l) {
			if (!l) return currentStatus;
			registeredStatusHandlers.push(l);
		},
		addStatusHandler: function (l) {
			registeredStatusHandlers.push(l);
		},
		removeStatusHandler: function (l) {
			var idx = registeredStatusHandlers.indexOf(l);
			if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
		},
		data: currentModuleData[moduleId]
	};
	currentChildModule = undefined;
	return hot;
}

function setStatus(newStatus) {
	currentStatus = newStatus; 
	var results = [];
	for (var i = 0; i < registeredStatusHandlers.length; i++)
		results[i] = registeredStatusHandlers[i].call(null, newStatus);

	return Promise.all(results).then(function () { });
}

function unblock() {
	if (--blockingPromises === 0) {
		setStatus("ready").then(function () {
			if (blockingPromises === 0) {
				var list = blockingPromisesWaiting;
				blockingPromisesWaiting = [];
				for (var i = 0; i < list.length; i++) {
					list[i]();
				}
			}
		});
	}
}

function trackBlockingPromise(promise) {
	switch (currentStatus) {
		case "ready":
			setStatus("prepare");
		case "prepare":
			blockingPromises++;
			promise.then(unblock, unblock);
			return promise;
		default:
			return promise;
	}
}

function waitForBlockingPromises(fn) {
	if (blockingPromises === 0) return fn();
	return new Promise(function (resolve) {
		blockingPromisesWaiting.push(function () {
			resolve(fn());
		});
	});
}

function hotCheck(applyOnUpdate) {
	if (currentStatus !== "idle") {
		throw new Error("check() is only allowed in idle status");
	} 
	return setStatus("check")
		.then(__webpack_require__.hmrM)
		.then(function (update) {
			if (!update) {
				return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
					function () {
						return null;
					}
				);
			}

			return setStatus("prepare").then(function () {
				var updatedModules = [];
				currentUpdateApplyHandlers = [];

				return Promise.all(
					Object.keys(__webpack_require__.hmrC).reduce(function (
						promises,
						key
					) {
						__webpack_require__.hmrC[key](
							update.c,
							update.r,
							update.m,
							promises,
							currentUpdateApplyHandlers,
							updatedModules
						);
						return promises;
					},
						[])
				).then(function () {
					return waitForBlockingPromises(function () {
						if (applyOnUpdate) {
							return internalApply(applyOnUpdate);
						}
						return setStatus("ready").then(function () {
							return updatedModules;
						});
					});
				});
			});
		});
}

function hotApply(options) {
	if (currentStatus !== "ready") {
		return Promise.resolve().then(function () {
			throw new Error(
				"apply() is only allowed in ready status (state: " + currentStatus + ")"
			);
		});
	}
	return internalApply(options);
}

function internalApply(options) {
	options = options || {};
	applyInvalidatedModules();
	var results = currentUpdateApplyHandlers.map(function (handler) {
		return handler(options);
	});
	currentUpdateApplyHandlers = undefined;
	var errors = results
		.map(function (r) {
			return r.error;
		})
		.filter(Boolean);

	if (errors.length > 0) {
		return setStatus("abort").then(function () {
			throw errors[0];
		});
	}

	var disposePromise = setStatus("dispose");

	results.forEach(function (result) {
		if (result.dispose) result.dispose();
	});

	var applyPromise = setStatus("apply");

	var error;
	var reportError = function (err) {
		if (!error) error = err;
	};

	var outdatedModules = [];
	results.forEach(function (result) {
		if (result.apply) {
			var modules = result.apply(reportError);
			if (modules) {
				for (var i = 0; i < modules.length; i++) {
					outdatedModules.push(modules[i]);
				}
			}
		}
	});

	return Promise.all([disposePromise, applyPromise]).then(function () {
		if (error) {
			return setStatus("fail").then(function () {
				throw error;
			});
		}

		if (queuedInvalidatedModules) {
			return internalApply(options).then(function (list) {
				outdatedModules.forEach(function (moduleId) {
					if (list.indexOf(moduleId) < 0) list.push(moduleId);
				});
				return list;
			});
		}

		return setStatus("idle").then(function () {
			return outdatedModules;
		});
	});
}

function applyInvalidatedModules() {
	if (queuedInvalidatedModules) {
		if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
		Object.keys(__webpack_require__.hmrI).forEach(function (key) {
			queuedInvalidatedModules.forEach(function (moduleId) {
				__webpack_require__.hmrI[key](moduleId, currentUpdateApplyHandlers);
			});
		});
		queuedInvalidatedModules = undefined;
		return true;
	}
}

})();
// webpack/runtime/load_script
(() => {
var inProgress = {};

var dataWebpackPrefix = "spa:";
// loadScript function to load a script via script tag
__webpack_require__.l = function (url, done, key, chunkId) {
	if (inProgress[url]) {
		inProgress[url].push(done);
		return;
	}
	var script, needAttach;
	if (key !== undefined) {
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {
			var s = scripts[i];
			if (s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) {
				script = s;
				break;
			}
		}
	}
	if (!script) {
		needAttach = true;
		
    script = document.createElement('script');
    
		
		script.timeout = 120;
		if (__webpack_require__.nc) {
			script.setAttribute("nonce", __webpack_require__.nc);
		}
		script.setAttribute("data-webpack", dataWebpackPrefix + key);
		
		script.src = url;
		
    
	}
	inProgress[url] = [done];
	var onScriptComplete = function (prev, event) {
		script.onerror = script.onload = null;
		clearTimeout(timeout);
		var doneFns = inProgress[url];
		delete inProgress[url];
		script.parentNode && script.parentNode.removeChild(script);
		doneFns &&
			doneFns.forEach(function (fn) {
				return fn(event);
			});
		if (prev) return prev(event);
	};
	var timeout = setTimeout(
		onScriptComplete.bind(null, undefined, {
			type: 'timeout',
			target: script
		}),
		120000
	);
	script.onerror = onScriptComplete.bind(null, script.onerror);
	script.onload = onScriptComplete.bind(null, script.onload);
	needAttach && document.head.appendChild(script);
};

})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
})();
// webpack/runtime/node_module_decorator
(() => {
__webpack_require__.nmd = (module) => {
  module.paths = [];
  if (!module.children) module.children = [];
  return module;
};
})();
// webpack/runtime/on_chunk_loaded
(() => {
var deferred = [];
__webpack_require__.O = (result, chunkIds, fn, priority) => {
	if (chunkIds) {
		priority = priority || 0;
		for (var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--)
			deferred[i] = deferred[i - 1];
		deferred[i] = [chunkIds, fn, priority];
		return;
	}
	var notFulfilled = Infinity;
	for (var i = 0; i < deferred.length; i++) {
		var [chunkIds, fn, priority] = deferred[i];
		var fulfilled = true;
		for (var j = 0; j < chunkIds.length; j++) {
			if (
				(priority & (1 === 0) || notFulfilled >= priority) &&
				Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))
			) {
				chunkIds.splice(j--, 1);
			} else {
				fulfilled = false;
				if (priority < notFulfilled) notFulfilled = priority;
			}
		}
		if (fulfilled) {
			deferred.splice(i--, 1);
			var r = fn();
			if (r !== undefined) result = r;
		}
	}
	return result;
};

})();
// webpack/runtime/public_path
(() => {
__webpack_require__.p = "/";
})();
// webpack/runtime/css loading
(() => {
if (typeof document === "undefined") return;
var createStylesheet = function (
	chunkId, fullhref, oldTag, resolve, reject
) {
	var linkTag = document.createElement("link");
	
	linkTag.rel = "stylesheet";
	linkTag.type="text/css";
	if (__webpack_require__.nc) {
		linkTag.nonce = __webpack_require__.nc;
	}
	var onLinkComplete = function (event) {
		// avoid mem leaks.
		linkTag.onerror = linkTag.onload = null;
		if (event.type === 'load') {
			resolve();
		} else {
			var errorType = event && (event.type === 'load' ? 'missing' : event.type);
			var realHref = event && event.target && event.target.href || fullhref;
			var err = new Error("Loading CSS chunk " + chunkId + " failed.\\n(" + realHref + ")");
			err.code = "CSS_CHUNK_LOAD_FAILED";
			err.type = errorType;
			err.request = realHref;
			if (linkTag.parentNode) linkTag.parentNode.removeChild(linkTag)
			reject(err);
		}
	}

	linkTag.onerror = linkTag.onload = onLinkComplete;
	linkTag.href = fullhref;
	
	if (oldTag) {
  oldTag.parentNode.insertBefore(linkTag, oldTag.nextSibling);
} else {
  document.head.appendChild(linkTag);
}
	return linkTag;
}
var findStylesheet = function (href, fullhref) {
	var existingLinkTags = document.getElementsByTagName("link");
	for (var i = 0; i < existingLinkTags.length; i++) {
		var tag = existingLinkTags[i];
		var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
		if (dataHref) {
			dataHref = dataHref.split('?')[0]
		}
		if (tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
	}

	var existingStyleTags = document.getElementsByTagName("style");
	for (var i = 0; i < existingStyleTags.length; i++) {
		var tag = existingStyleTags[i];
		var dataHref = tag.getAttribute("data-href");
		if (dataHref === href || dataHref === fullhref) return tag;
	}
}

var loadStylesheet = function (chunkId) {
	return new Promise(function (resolve, reject) {
		var href = __webpack_require__.miniCssF(chunkId);
		var fullhref = __webpack_require__.p + href;
		if (findStylesheet(href, fullhref)) return resolve();
		createStylesheet(chunkId, fullhref, null, resolve, reject);
	})
}

// no chunk loading
var oldTags = [];
var newTags = [];
var applyHandler = function (options) {
	return {
		dispose: function () {
			for (var i = 0; i < oldTags.length; i++) {
				var oldTag = oldTags[i];
				if (oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
			}
			oldTags.length = 0;
		},
		apply: function () {
			for (var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
			newTags.length = 0;
		}
	}
}
__webpack_require__.hmrC.miniCss = function (chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) {
	applyHandlers.push(applyHandler);
	chunkIds.forEach(function (chunkId) {
		var href = __webpack_require__.miniCssF(chunkId);
		var fullhref = __webpack_require__.p + href;
		var oldTag = findStylesheet(href, fullhref);
		if (!oldTag) return;
		promises.push(new Promise(function (resolve, reject) {
			var tag = createStylesheet(
				chunkId,

				/**
					If dynamically add link tag through dom API and there is already a loaded style link, browsers sometimes treats the new link tag as the same link, and won't fetch the new style.
					Use query to avoid browser cache the link tag, force to re-fetch new style, this is the same strategy as updateCss API, this can happen during lazy compilation
				 */
				`${fullhref}?${Date.now()}`,
				oldTag,
				function () {
					tag.as = "style";
					tag.rel = "preload";
					resolve();
				},
				reject
			);
			oldTags.push(oldTag);
			newTags.push(tag);
		}))
	});
}


})();
// webpack/runtime/jsonp_chunk_loading
(() => {

      // object to store loaded and loading chunks
      // undefined = chunk not loaded, null = chunk preloaded/prefetched
      // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
      var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {"index": 0,};
      var currentUpdatedModulesList;
var waitingUpdateResolves = {};
function loadUpdateChunk(chunkId, updatedModulesList) {
	currentUpdatedModulesList = updatedModulesList;
	return new Promise((resolve, reject) => {
		waitingUpdateResolves[chunkId] = resolve;
		// start update chunk loading
		var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
		// create error before stack unwound to get useful stacktrace later
		var error = new Error();
		var loadingEnded = (event) => {
			if (waitingUpdateResolves[chunkId]) {
				waitingUpdateResolves[chunkId] = undefined;
				var errorType =
					event && (event.type === 'load' ? 'missing' : event.type);
				var realSrc = event && event.target && event.target.src;
				error.message =
					'Loading hot update chunk ' +
					chunkId +
					' failed.\n(' +
					errorType +
					': ' +
					realSrc +
					')';
				error.name = 'ChunkLoadError';
				error.type = errorType;
				error.request = realSrc;
				reject(error);
			}
		};
		__webpack_require__.l(url, loadingEnded);
	});
}

self["webpackHotUpdatespa"] = (chunkId, moreModules, runtime) => {
	for (var moduleId in moreModules) {
		if (__webpack_require__.o(moreModules, moduleId)) {
			currentUpdate[moduleId] = moreModules[moduleId];
			if (currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
		}
	}
	if (runtime) currentUpdateRuntime.push(runtime);
	if (waitingUpdateResolves[chunkId]) {
		waitingUpdateResolves[chunkId]();
		waitingUpdateResolves[chunkId] = undefined;
	}
};
var currentUpdateChunks;
var currentUpdate;
var currentUpdateRemovedChunks;
var currentUpdateRuntime;
function applyHandler(options) {
	if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
	currentUpdateChunks = undefined;
	function getAffectedModuleEffects(updateModuleId) {
		var outdatedModules = [updateModuleId];
		var outdatedDependencies = {};
		var queue = outdatedModules.map(function (id) {
			return {
				chain: [id],
				id: id
			};
		});
		while (queue.length > 0) {
			var queueItem = queue.pop();
			var moduleId = queueItem.id;
			var chain = queueItem.chain;
			var module = __webpack_require__.c[moduleId];
			if (
				!module ||
				(module.hot._selfAccepted && !module.hot._selfInvalidated)
			) {
				continue;
			}

			if (module.hot._selfDeclined) {
				return {
					type: "self-declined",
					chain: chain,
					moduleId: moduleId
				};
			}

			if (module.hot._main) {
				return {
					type: "unaccepted",
					chain: chain,
					moduleId: moduleId
				};
			}

			for (var i = 0; i < module.parents.length; i++) {
				var parentId = module.parents[i];
				var parent = __webpack_require__.c[parentId];
				if (!parent) {
					continue;
				}
				if (parent.hot._declinedDependencies[moduleId]) {
					return {
						type: "declined",
						chain: chain.concat([parentId]),
						moduleId: moduleId,
						parentId: parentId
					};
				}
				if (outdatedModules.indexOf(parentId) !== -1) {
					continue;
				}
				if (parent.hot._acceptedDependencies[moduleId]) {
					if (!outdatedDependencies[parentId]) {
						outdatedDependencies[parentId] = [];
					}
					addAllToSet(outdatedDependencies[parentId], [moduleId]);
					continue;
				}
				delete outdatedDependencies[parentId];
				outdatedModules.push(parentId);
				queue.push({
					chain: chain.concat([parentId]),
					id: parentId
				});
			}
		}

		return {
			type: "accepted",
			moduleId: updateModuleId,
			outdatedModules: outdatedModules,
			outdatedDependencies: outdatedDependencies
		};
	}

	function addAllToSet(a, b) {
		for (var i = 0; i < b.length; i++) {
			var item = b[i];
			if (a.indexOf(item) === -1) a.push(item);
		}
	}

	var outdatedDependencies = {};
	var outdatedModules = [];
	var appliedUpdate = {};

	var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
		console.warn(
			"[HMR] unexpected require(" + module.id + ") to disposed module"
		);
		throw Error("RuntimeError: factory is undefined(" + module.id + ")");
	};

	for (var moduleId in currentUpdate) {
		if (__webpack_require__.o(currentUpdate, moduleId)) {
			var newModuleFactory = currentUpdate[moduleId];
			var result = newModuleFactory ? getAffectedModuleEffects(moduleId) : {
				type: "disposed",
				moduleId: moduleId
			};
			var abortError = false;
			var doApply = false;
			var doDispose = false;
			var chainInfo = "";
			if (result.chain) {
				chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
			}
			switch (result.type) {
				case "self-declined":
					if (options.onDeclined) options.onDeclined(result);
					if (!options.ignoreDeclined)
						abortError = new Error(
							"Aborted because of self decline: " + result.moduleId + chainInfo
						);
					break;
				case "declined":
					if (options.onDeclined) options.onDeclined(result);
					if (!options.ignoreDeclined)
						abortError = new Error(
							"Aborted because of declined dependency: " +
							result.moduleId +
							" in " +
							result.parentId +
							chainInfo
						);
					break;
				case "unaccepted":
					if (options.onUnaccepted) options.onUnaccepted(result);
					if (!options.ignoreUnaccepted)
						abortError = new Error(
							"Aborted because " + moduleId + " is not accepted" + chainInfo
						);
					break;
				case "accepted":
					if (options.onAccepted) options.onAccepted(result);
					doApply = true;
					break;
				case "disposed":
					if (options.onDisposed) options.onDisposed(result);
					doDispose = true;
					break;
				default:
					throw new Error("Unexception type " + result.type);
			}
			if (abortError) {
				return {
					error: abortError
				};
			}
			if (doApply) {
				appliedUpdate[moduleId] = newModuleFactory;
				addAllToSet(outdatedModules, result.outdatedModules);
				for (moduleId in result.outdatedDependencies) {
					if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
						if (!outdatedDependencies[moduleId])
							outdatedDependencies[moduleId] = [];
						addAllToSet(
							outdatedDependencies[moduleId],
							result.outdatedDependencies[moduleId]
						);
					}
				}
			}
			if (doDispose) {
				addAllToSet(outdatedModules, [result.moduleId]);
				appliedUpdate[moduleId] = warnUnexpectedRequire;
			}
		}
	}
	currentUpdate = undefined;

	var outdatedSelfAcceptedModules = [];
	for (var j = 0; j < outdatedModules.length; j++) {
		var outdatedModuleId = outdatedModules[j];
		var module = __webpack_require__.c[outdatedModuleId];
		if (
			module &&
			(module.hot._selfAccepted || module.hot._main) &&
			// removed self-accepted modules should not be required
			appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
			// when called invalidate self-accepting is not possible
			!module.hot._selfInvalidated
		) {
			outdatedSelfAcceptedModules.push({
				module: outdatedModuleId,
				require: module.hot._requireSelf,
				errorHandler: module.hot._selfAccepted
			});
		}
	} 

	var moduleOutdatedDependencies;
	return {
		dispose: function () {
			currentUpdateRemovedChunks.forEach(function (chunkId) {
				delete installedChunks[chunkId];
			});
			currentUpdateRemovedChunks = undefined;

			var idx;
			var queue = outdatedModules.slice();
			while (queue.length > 0) {
				var moduleId = queue.pop();
				var module = __webpack_require__.c[moduleId];
				if (!module) continue;

				var data = {};

				// Call dispose handlers
				var disposeHandlers = module.hot._disposeHandlers; 
				for (j = 0; j < disposeHandlers.length; j++) {
					disposeHandlers[j].call(null, data);
				}
				__webpack_require__.hmrD[moduleId] = data;

				module.hot.active = false;

				delete __webpack_require__.c[moduleId];

				delete outdatedDependencies[moduleId];

				for (j = 0; j < module.children.length; j++) {
					var child = __webpack_require__.c[module.children[j]];
					if (!child) continue;
					idx = child.parents.indexOf(moduleId);
					if (idx >= 0) {
						child.parents.splice(idx, 1);
					}
				}
			}

			var dependency;
			for (var outdatedModuleId in outdatedDependencies) {
				if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
					module = __webpack_require__.c[outdatedModuleId];
					if (module) {
						moduleOutdatedDependencies = outdatedDependencies[outdatedModuleId];
						for (j = 0; j < moduleOutdatedDependencies.length; j++) {
							dependency = moduleOutdatedDependencies[j];
							idx = module.children.indexOf(dependency);
							if (idx >= 0) module.children.splice(idx, 1);
						}
					}
				}
			}
		},
		apply: function (reportError) {
			// insert new code
			for (var updateModuleId in appliedUpdate) {
				if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
					__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId]; 
				}
			}

			// run new runtime modules
			for (var i = 0; i < currentUpdateRuntime.length; i++) {
				currentUpdateRuntime[i](__webpack_require__);
			}

			// call accept handlers
			for (var outdatedModuleId in outdatedDependencies) {
				if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
					var module = __webpack_require__.c[outdatedModuleId];
					if (module) {
						moduleOutdatedDependencies = outdatedDependencies[outdatedModuleId];
						var callbacks = [];
						var errorHandlers = [];
						var dependenciesForCallbacks = [];
						for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
							var dependency = moduleOutdatedDependencies[j];
							var acceptCallback = module.hot._acceptedDependencies[dependency];
							var errorHandler = module.hot._acceptedErrorHandlers[dependency];
							if (acceptCallback) {
								if (callbacks.indexOf(acceptCallback) !== -1) continue;
								callbacks.push(acceptCallback);
								errorHandlers.push(errorHandler); 
								dependenciesForCallbacks.push(dependency);
							}
						}
						for (var k = 0; k < callbacks.length; k++) {
							try {
								callbacks[k].call(null, moduleOutdatedDependencies);
							} catch (err) {
								if (typeof errorHandlers[k] === "function") {
									try {
										errorHandlers[k](err, {
											moduleId: outdatedModuleId,
											dependencyId: dependenciesForCallbacks[k]
										});
									} catch (err2) {
										if (options.onErrored) {
											options.onErrored({
												type: "accept-error-handler-errored",
												moduleId: outdatedModuleId,
												dependencyId: dependenciesForCallbacks[k],
												error: err2,
												originalError: err
											});
										}
										if (!options.ignoreErrored) {
											reportError(err2);
											reportError(err);
										}
									}
								} else {
									if (options.onErrored) {
										options.onErrored({
											type: "accept-errored",
											moduleId: outdatedModuleId,
											dependencyId: dependenciesForCallbacks[k],
											error: err
										});
									}
									if (!options.ignoreErrored) {
										reportError(err);
									}
								}
							}
						}
					}
				}
			}

			// Load self accepted modules
			for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
				var item = outdatedSelfAcceptedModules[o];
				var moduleId = item.module;
				try {
					item.require(moduleId);
				} catch (err) {
					if (typeof item.errorHandler === "function") {
						try {
							item.errorHandler(err, {
								moduleId: moduleId,
								module: __webpack_require__.c[moduleId]
							});
						} catch (err1) {
							if (options.onErrored) {
								options.onErrored({
									type: "self-accept-error-handler-errored",
									moduleId: moduleId,
									error: err1,
									originalError: err
								});
							}
							if (!options.ignoreErrored) {
								reportError(err1);
								reportError(err);
							}
						}
					} else {
						if (options.onErrored) {
							options.onErrored({
								type: "self-accept-errored",
								moduleId: moduleId,
								error: err
							});
						}
						if (!options.ignoreErrored) {
							reportError(err);
						}
					}
				}
			}

			return outdatedModules;
		}
	};
}

__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
	if (!currentUpdate) {
		currentUpdate = {};
		currentUpdateRuntime = [];
		currentUpdateRemovedChunks = [];
		applyHandlers.push(applyHandler);
	}
	if (!__webpack_require__.o(currentUpdate, moduleId)) {
		currentUpdate[moduleId] = __webpack_require__.m[moduleId];
	}
};

__webpack_require__.hmrC.jsonp = function (
	chunkIds,
	removedChunks,
	removedModules,
	promises,
	applyHandlers,
	updatedModulesList
) {
	applyHandlers.push(applyHandler);
	currentUpdateChunks = {};
	currentUpdateRemovedChunks = removedChunks;
	currentUpdate = removedModules.reduce(function (obj, key) {
		obj[key] = false;
		return obj;
	}, {});
	currentUpdateRuntime = [];
	chunkIds.forEach(function (chunkId) {
		if (
			__webpack_require__.o(installedChunks, chunkId) &&
			installedChunks[chunkId] !== undefined
		) {
			promises.push(loadUpdateChunk(chunkId, updatedModulesList));
			currentUpdateChunks[chunkId] = true;
		} else {
			currentUpdateChunks[chunkId] = false;
		}
	});
	if (__webpack_require__.f) {
		__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
			if (
				currentUpdateChunks &&
				__webpack_require__.o(currentUpdateChunks, chunkId) &&
				!currentUpdateChunks[chunkId]
			) {
				promises.push(loadUpdateChunk(chunkId));
				currentUpdateChunks[chunkId] = true;
			}
		};
	}
};
__webpack_require__.hmrM = () => {
	if (typeof fetch === "undefined")
		throw new Error("No browser support: need fetch API");
	return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then(
		(response) => {
			if (response.status === 404) return; // no update available
			if (!response.ok)
				throw new Error(
					"Failed to fetch update manifest " + response.statusText
				);
			return response.json();
		}
	);
};
__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
// install a JSONP callback for chunk loading
var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
	var [chunkIds, moreModules, runtime] = data;
	// add "moreModules" to the modules object,
	// then flag all "chunkIds" as loaded and fire callback
	var moduleId, chunkId, i = 0;
	if (chunkIds.some((id) => (installedChunks[id] !== 0))) {
		for (moduleId in moreModules) {
			if (__webpack_require__.o(moreModules, moduleId)) {
				__webpack_require__.m[moduleId] = moreModules[moduleId];
			}
		}
		if (runtime) var result = runtime(__webpack_require__);
	}
	if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
	for (; i < chunkIds.length; i++) {
		chunkId = chunkIds[i];
		if (
			__webpack_require__.o(installedChunks, chunkId) &&
			installedChunks[chunkId]
		) {
			installedChunks[chunkId][0]();
		}
		installedChunks[chunkId] = 0;
	}
	return __webpack_require__.O(result);
};

var chunkLoadingGlobal = self["webpackChunkspa"] = self["webpackChunkspa"] || [];
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));

})();
/************************************************************************/
// module cache are used so entry inlining is disabled
// startup
// Load entry module and return exports
__webpack_require__.O(undefined, ["lib-react", "lib-router", "lib-axios"], function() { return __webpack_require__("./node_modules/@rspack/plugin-react-refresh/client/reactRefreshEntry.js") });
var __webpack_exports__ = __webpack_require__.O(undefined, ["lib-react", "lib-router", "lib-axios"], function() { return __webpack_require__("./src/index.tsx") });
__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
})()
;
//# sourceMappingURL=index.js.map