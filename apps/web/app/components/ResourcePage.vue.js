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
var __VLS_props = defineProps();
var text = useLocale().text;
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
    eyebrow: (__VLS_ctx.eyebrow),
    title: (__VLS_ctx.title),
    description: (__VLS_ctx.description),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        eyebrow: (__VLS_ctx.eyebrow),
        title: (__VLS_ctx.title),
        description: (__VLS_ctx.description),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "container content-section" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "resource-grid" }));
/** @type {__VLS_StyleScopedClasses['resource-grid']} */ ;
for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.resources)); _i < _a.length; _i++) {
    var resource = _a[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (resource.title.zh) }, { class: "resource-card" }));
    /** @type {__VLS_StyleScopedClasses['resource-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "resource-icon" }, { 'aria-hidden': "true" }));
    /** @type {__VLS_StyleScopedClasses['resource-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    (__VLS_ctx.text(resource.title));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.text(resource.description));
    if (resource.href) {
        var __VLS_5 = void 0;
        /** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
        NuxtLink;
        // @ts-ignore
        var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5(__assign({ class: "text-link" }, { to: (resource.href) })));
        var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign({ class: "text-link" }, { to: (resource.href) })], __VLS_functionalComponentArgsRest(__VLS_6), false));
        /** @type {__VLS_StyleScopedClasses['text-link']} */ ;
        var __VLS_10 = __VLS_8.slots.default;
        (__VLS_ctx.$route.path.startsWith('/en') ? "Open" : "查看");
        // @ts-ignore
        [eyebrow, title, description, resources, text, text, $route,];
        var __VLS_8;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "coming-soon" }));
        /** @type {__VLS_StyleScopedClasses['coming-soon']} */ ;
        (__VLS_ctx.$route.path.startsWith('/en') ? "Content pending" : "内容待迁移");
    }
    // @ts-ignore
    [$route,];
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
