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
var props = defineProps();
var _a = useLocale(), text = _a.text, localizedPath = _a.localizedPath;
var imageByProduct = {
    "f435-vmt7": "/images/site/flight-controller.jpg",
    "f435-rgt7": "/images/site/flight-controller.jpg",
    "esc-45a": "/images/site/esc.jpg",
    "beacon-vtx": "/images/site/vtx.jpg",
    antenna: "/images/site/antenna.png",
    "se-engine": "/images/site/engine.png"
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "product-card" }, { id: (__VLS_ctx.product.id) }));
/** @type {__VLS_StyleScopedClasses['product-card']} */ ;
var __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ to: (__VLS_ctx.localizedPath(__VLS_ctx.product.href)) }, { class: "product-image-link" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ to: (__VLS_ctx.localizedPath(__VLS_ctx.product.href)) }, { class: "product-image-link" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['product-image-link']} */ ;
var __VLS_5 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: (__VLS_ctx.imageByProduct[__VLS_ctx.product.id]),
    alt: (__VLS_ctx.product.name),
});
// @ts-ignore
[product, product, product, product, localizedPath, imageByProduct,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "product-card-body" }));
/** @type {__VLS_StyleScopedClasses['product-card-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "eyebrow" }));
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
(__VLS_ctx.text(__VLS_ctx.product.eyebrow));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.product.name);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.text(__VLS_ctx.product.description));
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)(__assign({ class: "feature-list" }));
/** @type {__VLS_StyleScopedClasses['feature-list']} */ ;
for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.product.highlights)); _i < _b.length; _i++) {
    var highlight = _b[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
        key: (highlight.zh),
    });
    (__VLS_ctx.text(highlight));
    // @ts-ignore
    [product, product, product, product, text, text, text,];
}
var __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ class: "text-link" }, { to: (__VLS_ctx.localizedPath(__VLS_ctx.product.href)) })));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ class: "text-link" }, { to: (__VLS_ctx.localizedPath(__VLS_ctx.product.href)) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
/** @type {__VLS_StyleScopedClasses['text-link']} */ ;
var __VLS_11 = __VLS_9.slots.default;
(__VLS_ctx.$route.path.startsWith('/en') ? "View details" : "查看详情");
// @ts-ignore
[product, localizedPath, $route,];
var __VLS_9;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
