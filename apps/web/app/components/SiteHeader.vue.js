"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = useLocale(), isEnglish = _a.isEnglish, localizedPath = _a.localizedPath;
var menu = computed(function () { return [
    { label: isEnglish.value ? "Home" : "首页", to: localizedPath("/") },
    { label: isEnglish.value ? "Products" : "产品中心", to: localizedPath("/products/") },
    { label: isEnglish.value ? "Support" : "服务支持", to: localizedPath("/service/") },
    { label: isEnglish.value ? "About" : "联系我们", to: localizedPath("/contact/") }
]; });
var languagePath = computed(function () { return (isEnglish.value ? "/" : "/en/"); });
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)(__assign({ class: "site-header" }));
/** @type {__VLS_StyleScopedClasses['site-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container header-inner" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-inner']} */ ;
var __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "brand" }, { to: (__VLS_ctx.localizedPath('/')), 'aria-label': "重山航空" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "brand" }, { to: (__VLS_ctx.localizedPath('/')), 'aria-label': "重山航空" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
var __VLS_5 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "/images/site/logo.png",
    alt: "重山航空 Great Mountain",
});
// @ts-ignore
[localizedPath,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)(__assign({ class: "primary-nav" }, { 'aria-label': (__VLS_ctx.isEnglish ? 'Main navigation' : '主导航') }));
/** @type {__VLS_StyleScopedClasses['primary-nav']} */ ;
for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.menu)); _i < _b.length; _i++) {
    var item = _b[_i][0];
    var __VLS_6 = void 0;
    /** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
    NuxtLink;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        key: (item.to),
        to: (item.to),
        activeClass: "is-active",
    }));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{
            key: (item.to),
            to: (item.to),
            activeClass: "is-active",
        }], __VLS_functionalComponentArgsRest(__VLS_7), false));
    var __VLS_11 = __VLS_9.slots.default;
    (item.label);
    // @ts-ignore
    [isEnglish, menu,];
    var __VLS_9;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header-actions" }));
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
var __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12(__assign({ class: "language-switch" }, { to: (__VLS_ctx.languagePath) })));
var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "language-switch" }, { to: (__VLS_ctx.languagePath) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
/** @type {__VLS_StyleScopedClasses['language-switch']} */ ;
var __VLS_17 = __VLS_15.slots.default;
(__VLS_ctx.isEnglish ? "中" : "EN");
// @ts-ignore
[isEnglish, languagePath,];
var __VLS_15;
var __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18(__assign({ class: "header-download" }, { to: (__VLS_ctx.localizedPath('/downloads/')) })));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([__assign({ class: "header-download" }, { to: (__VLS_ctx.localizedPath('/downloads/')) })], __VLS_functionalComponentArgsRest(__VLS_19), false));
/** @type {__VLS_StyleScopedClasses['header-download']} */ ;
var __VLS_23 = __VLS_21.slots.default;
(__VLS_ctx.isEnglish ? "Downloads" : "下载中心");
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    'aria-hidden': "true",
});
// @ts-ignore
[localizedPath, isEnglish,];
var __VLS_21;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
