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
var _a = useLocale(), isEnglish = _a.isEnglish, text = _a.text, localizedPath = _a.localizedPath;
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
    eyebrow: (__VLS_ctx.isEnglish ? 'Aero engine' : '航空发动机'),
    title: (props.engine.name),
    description: (__VLS_ctx.text(props.engine.description)),
    compact: true,
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        eyebrow: (__VLS_ctx.isEnglish ? 'Aero engine' : '航空发动机'),
        title: (props.engine.name),
        description: (__VLS_ctx.text(props.engine.description)),
        compact: true,
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
(__VLS_ctx.isEnglish ? "Technical specifications" : "技术参数");
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.isEnglish ? "Engine data" : "发动机信息");
__VLS_asFunctionalElement1(__VLS_intrinsics.dl, __VLS_intrinsics.dl)({});
for (var _i = 0, _b = __VLS_vFor((props.engine.rows)); _i < _b.length; _i++) {
    var row = _b[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.template)({
        key: (row.label.zh),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.dt, __VLS_intrinsics.dt)({});
    (__VLS_ctx.text(row.label));
    __VLS_asFunctionalElement1(__VLS_intrinsics.dd, __VLS_intrinsics.dd)({});
    (row.value);
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, text, text,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "detail-card" }));
/** @type {__VLS_StyleScopedClasses['detail-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ class: "detail-product-image" }, { src: "/images/site/engine.png", alt: (props.engine.name) }));
/** @type {__VLS_StyleScopedClasses['detail-product-image']} */ ;
var __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5(__assign(__assign({ class: "button-secondary" }, { style: {} }), { to: (__VLS_ctx.localizedPath('/downloads/')) })));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign(__assign({ class: "button-secondary" }, { style: {} }), { to: (__VLS_ctx.localizedPath('/downloads/')) })], __VLS_functionalComponentArgsRest(__VLS_6), false));
/** @type {__VLS_StyleScopedClasses['button-secondary']} */ ;
var __VLS_10 = __VLS_8.slots.default;
(__VLS_ctx.isEnglish ? "Open downloads" : "查看下载资料");
// @ts-ignore
[isEnglish, localizedPath,];
var __VLS_8;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
