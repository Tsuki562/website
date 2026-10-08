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
var props = defineProps();
var _a = useLocale(), isEnglish = _a.isEnglish, text = _a.text, localizedPath = _a.localizedPath;
var product = computed(function () { var _a; return (_a = site_1.products.find(function (item) { return item.id === props.productId; })) !== null && _a !== void 0 ? _a : site_1.products[0]; });
var productDownloads = computed(function () { return site_1.downloads.filter(function (item) { return item.productId === props.productId; }); });
var imageByProduct = {
    "f435-vmt7": "/images/site/flight-controller.jpg",
    "f435-rgt7": "/images/site/flight-controller.jpg",
    "esc-45a": "/images/site/esc.jpg",
    "beacon-vtx": "/images/site/vtx.jpg"
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
var __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.PageHero} */
PageHero;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    eyebrow: (__VLS_ctx.text(__VLS_ctx.product.eyebrow)),
    title: (__VLS_ctx.product.name),
    description: (__VLS_ctx.text(__VLS_ctx.product.description)),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        eyebrow: (__VLS_ctx.text(__VLS_ctx.product.eyebrow)),
        title: (__VLS_ctx.product.name),
        description: (__VLS_ctx.text(__VLS_ctx.product.description)),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "container content-section" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "detail-layout" }));
/** @type {__VLS_StyleScopedClasses['detail-layout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "detail-card" }));
/** @type {__VLS_StyleScopedClasses['detail-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "eyebrow" }));
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
(__VLS_ctx.isEnglish ? "Product support" : "产品支持");
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.isEnglish ? "Resources for this product" : "该产品的公开资料");
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.isEnglish ? "The public files below are being migrated into the new download center." : "以下公开文件正在迁移到新的下载中心。");
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)(__assign({ class: "spec-list" }));
/** @type {__VLS_StyleScopedClasses['spec-list']} */ ;
for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.product.highlights)); _i < _b.length; _i++) {
    var highlight = _b[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
        key: (highlight.zh),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.text(highlight));
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    // @ts-ignore
    [text, text, text, product, product, product, product, isEnglish, isEnglish, isEnglish,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "detail-card" }));
/** @type {__VLS_StyleScopedClasses['detail-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ class: "detail-product-image" }, { src: (__VLS_ctx.imageByProduct[__VLS_ctx.product.id] || '/images/site/flight-controller.jpg'), alt: (__VLS_ctx.product.name) }));
/** @type {__VLS_StyleScopedClasses['detail-product-image']} */ ;
var __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5(__assign(__assign({ class: "button-primary" }, { style: {} }), { to: (__VLS_ctx.localizedPath('/downloads/')) })));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign(__assign({ class: "button-primary" }, { style: {} }), { to: (__VLS_ctx.localizedPath('/downloads/')) })], __VLS_functionalComponentArgsRest(__VLS_6), false));
/** @type {__VLS_StyleScopedClasses['button-primary']} */ ;
var __VLS_10 = __VLS_8.slots.default;
(__VLS_ctx.isEnglish ? "Open download center" : "进入下载中心");
// @ts-ignore
[product, product, isEnglish, imageByProduct, localizedPath,];
var __VLS_8;
if (__VLS_ctx.productDownloads.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "section-heading" }, { style: {} }));
    /** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "eyebrow" }));
    /** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
    (__VLS_ctx.isEnglish ? "Related files" : "相关文件");
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    (__VLS_ctx.isEnglish ? "Public resources" : "公开资料");
}
if (__VLS_ctx.productDownloads.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "downloads-results" }));
    /** @type {__VLS_StyleScopedClasses['downloads-results']} */ ;
    for (var _c = 0, _d = __VLS_vFor((__VLS_ctx.productDownloads)); _c < _d.length; _c++) {
        var item = _d[_c][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (item.id) }, { class: "download-card" }));
        /** @type {__VLS_StyleScopedClasses['download-card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "download-card-head" }));
        /** @type {__VLS_StyleScopedClasses['download-card-head']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
        (item.fileName);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (item.version);
        (item.hardwareVersion);
        (item.fileSize);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "tag" }));
        /** @type {__VLS_StyleScopedClasses['tag']} */ ;
        (item.channel);
        // @ts-ignore
        [isEnglish, isEnglish, productDownloads, productDownloads, productDownloads,];
    }
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
