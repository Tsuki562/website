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
var engines = [
    { id: "se45", name: "SE45", href: "/g-motor-se45/", spec: "2.4 kW · 45 cm³" },
    { id: "se110", name: "SE110", href: "/g-motor-se110/", spec: "13.2 kW · 100.2 cm³" },
    { id: "se170", name: "SE170", href: "/g-motor-se170/", spec: "13.2 kW · 170 cm³" },
    { id: "se275", name: "SE275", href: "/g-motor-se275/", spec: "16 kW · 274 cm³" },
    { id: "se550", name: "SE550", href: "/g-motor-se550/", spec: "36.5 kW · 548 cm³" }
];
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
    eyebrow: (__VLS_ctx.isEnglish ? 'Aero engine' : '航空发动机'),
    title: (__VLS_ctx.isEnglish ? 'SE series aero engines' : 'SE 系列航空发动机'),
    description: (__VLS_ctx.isEnglish ? 'Strong output, low weight and reliable operation for demanding aviation applications.' : '强劲动力、超轻重量、可靠稳定，覆盖多种航空应用场景。'),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        eyebrow: (__VLS_ctx.isEnglish ? 'Aero engine' : '航空发动机'),
        title: (__VLS_ctx.isEnglish ? 'SE series aero engines' : 'SE 系列航空发动机'),
        description: (__VLS_ctx.isEnglish ? 'Strong output, low weight and reliable operation for demanding aviation applications.' : '强劲动力、超轻重量、可靠稳定，覆盖多种航空应用场景。'),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "container content-section" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-grid" }));
/** @type {__VLS_StyleScopedClasses['card-grid']} */ ;
for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.engines)); _i < _b.length; _i++) {
    var engine = _b[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (engine.id) }, { class: "resource-card" }));
    /** @type {__VLS_StyleScopedClasses['resource-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "resource-icon" }));
    /** @type {__VLS_StyleScopedClasses['resource-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "eyebrow" }));
    /** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
    (__VLS_ctx.isEnglish ? "Aero engine" : "航空发动机");
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    (engine.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (engine.spec);
    var __VLS_5 = void 0;
    /** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
    NuxtLink;
    // @ts-ignore
    var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5(__assign({ class: "text-link" }, { to: (__VLS_ctx.localizedPath(engine.href)) })));
    var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([__assign({ class: "text-link" }, { to: (__VLS_ctx.localizedPath(engine.href)) })], __VLS_functionalComponentArgsRest(__VLS_6), false));
    /** @type {__VLS_StyleScopedClasses['text-link']} */ ;
    var __VLS_10 = __VLS_8.slots.default;
    (__VLS_ctx.isEnglish ? "View specifications" : "查看技术参数");
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, engines, localizedPath,];
    var __VLS_8;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
