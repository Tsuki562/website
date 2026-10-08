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
var site_1 = require("~~/shared/data/site");
var isEnglish = useLocale().isEnglish;
useSeoMeta({ title: function () { return (isEnglish.value ? "Products | Great Mountain" : "产品 | 重山航空"); } });
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
var __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.PageHero} */
PageHero;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    eyebrow: (__VLS_ctx.isEnglish ? 'Product system' : '产品体系'),
    title: (__VLS_ctx.isEnglish ? 'Products built for flight' : '为飞行任务打造的产品体系'),
    description: (__VLS_ctx.isEnglish ? 'Flight control, power, video transmission, antennas and aero engines.' : '覆盖飞控、动力、图传、天线与航空发动机的产品组合。'),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        eyebrow: (__VLS_ctx.isEnglish ? 'Product system' : '产品体系'),
        title: (__VLS_ctx.isEnglish ? 'Products built for flight' : '为飞行任务打造的产品体系'),
        description: (__VLS_ctx.isEnglish ? 'Flight control, power, video transmission, antennas and aero engines.' : '覆盖飞控、动力、图传、天线与航空发动机的产品组合。'),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "container content-section" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-grid" }));
/** @type {__VLS_StyleScopedClasses['card-grid']} */ ;
for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.products)); _i < _a.length; _i++) {
    var product = _a[_i][0];
    var __VLS_5 = void 0;
    /** @ts-ignore @type { | typeof __VLS_components.ProductCard} */
    ProductCard;
    // @ts-ignore
    var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        key: (product.id),
        product: (product),
    }));
    var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{
            key: (product.id),
            product: (product),
        }], __VLS_functionalComponentArgsRest(__VLS_6), false));
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, site_1.products,];
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
