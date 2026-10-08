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
Object.defineProperty(exports, "__esModule", { value: true });
var __VLS_props = withDefaults(defineProps(), { eyebrow: "", description: "", compact: false });
var __VLS_defaults = { eyebrow: "", description: "", compact: false };
var __VLS_ctx = __assign(__assign(__assign({}, {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "page-hero" }, { class: ({ compact: __VLS_ctx.compact }) }));
/** @type {__VLS_StyleScopedClasses['page-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['compact']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
if (__VLS_ctx.eyebrow) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "eyebrow" }));
    /** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
    (__VLS_ctx.eyebrow);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
(__VLS_ctx.title);
if (__VLS_ctx.description) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "hero-description" }));
    /** @type {__VLS_StyleScopedClasses['hero-description']} */ ;
    (__VLS_ctx.description);
}
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
// @ts-ignore
[compact, eyebrow, eyebrow, title, description, description,];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
    props: {},
});
var __VLS_export = {};
exports.default = {};
