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
var categories = computed(function () { return [
    {
        name: isEnglish.value ? "AT32F435 flight controllers" : "AT32F435 系列飞控",
        label: isEnglish.value ? "Flight control" : "飞控系统",
        description: isEnglish.value
            ? "High-performance domestic flight control built for reliable and expandable platforms."
            : "面向可靠飞行与灵活扩展打造的高性能国产飞控平台。",
        image: "/images/site/flight-controller.jpg",
        href: localizedPath("/flightcontrol_service/"),
        className: "featured"
    },
    {
        name: isEnglish.value ? "SE aero engines" : "SE 系列航空发动机",
        label: isEnglish.value ? "Power system" : "动力系统",
        description: isEnglish.value
            ? "A complete engine family from SE45 through SE550."
            : "覆盖 SE45 至 SE550 的航空发动机产品系列。",
        image: "/images/site/engine.png",
        href: localizedPath("/g-motor/"),
        className: "featured"
    },
    {
        name: isEnglish.value ? "High-current ESC" : "高性能电调",
        label: "ESC",
        description: isEnglish.value ? "32-bit processing and a six-layer 3OZ design." : "32 位处理器与六层 3OZ 大电流设计。",
        image: "/images/site/esc.jpg",
        href: localizedPath("/esc-45a/"),
        className: "compact"
    },
    {
        name: isEnglish.value ? "Beacon video transmitters" : "Beacon 系列图传",
        label: "VTX",
        description: isEnglish.value ? "Multi-band, high-output analog video transmission." : "多频段、高功率、高信噪比模拟图传。",
        image: "/images/site/vtx.jpg",
        href: localizedPath("/trans_grid/"),
        className: "compact"
    },
    {
        name: isEnglish.value ? "Custom antennas" : "定制天线",
        label: isEnglish.value ? "RF system" : "射频系统",
        description: isEnglish.value ? "Custom frequency bands and structures with low VSWR." : "支持频段与结构定制，兼顾低驻波与一致性。",
        image: "/images/site/antenna.png",
        href: localizedPath("/products/#antenna"),
        className: "compact"
    }
]; });
var supportItems = computed(function () { return [
    {
        number: "01",
        title: isEnglish.value ? "Firmware center" : "固件下载中心",
        description: isEnglish.value ? "Filter verified firmware by product, Target and hardware revision." : "按产品、Target 与硬件版本查找经过审核的固件。",
        href: localizedPath("/downloads/")
    },
    {
        number: "02",
        title: isEnglish.value ? "Online Betaflight build" : "在线编译 Betaflight",
        description: isEnglish.value ? "Choose an approved Target, source version and supported build options." : "选择已验证的 Target、源码版本与可用构建选项。",
        href: "".concat(localizedPath("/downloads/"), "#build")
    },
    {
        number: "03",
        title: isEnglish.value ? "Manuals and support" : "说明书与技术支持",
        description: isEnglish.value ? "Find wiring documents, product manuals and after-sales assistance." : "集中获取接线资料、产品说明书与售后支持。",
        href: localizedPath("/service/")
    }
]; });
useSeoMeta({
    title: function () { return (isEnglish.value ? "Great Mountain Aviation" : "重山航空"); },
    description: function () {
        return isEnglish.value
            ? "Great Mountain flight control, video transmission and aero engine products."
            : "重山航空飞控、图传、天线和航空发动机产品与服务。";
    }
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-page" }));
/** @type {__VLS_StyleScopedClasses['home-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "home-hero" }));
/** @type {__VLS_StyleScopedClasses['home-hero']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-hero-media" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['home-hero-media']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "/images/site/banner-1.jpg",
    alt: "",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-hero-grid" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['home-hero-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container home-hero-inner" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['home-hero-inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-hero-copy" }));
/** @type {__VLS_StyleScopedClasses['home-hero-copy']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "hero-kicker" }));
/** @type {__VLS_StyleScopedClasses['hero-kicker']} */ ;
if (__VLS_ctx.isEnglish) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "hero-lead" }));
/** @type {__VLS_StyleScopedClasses['hero-lead']} */ ;
(__VLS_ctx.isEnglish
    ? "Domestic high-performance flight controllers, video transmission and power systems — designed as one dependable platform."
    : "从高性能国产飞控，到图传与动力系统，以完整可靠的硬件平台支撑每一次飞行。");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "hero-actions" }));
/** @type {__VLS_StyleScopedClasses['hero-actions']} */ ;
var __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "button-primary button-large" }, { to: (__VLS_ctx.localizedPath('/products/')) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "button-primary button-large" }, { to: (__VLS_ctx.localizedPath('/products/')) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['button-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['button-large']} */ ;
var __VLS_5 = __VLS_3.slots.default;
(__VLS_ctx.isEnglish ? "Explore products" : "查看产品");
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    'aria-hidden': "true",
});
// @ts-ignore
[isEnglish, isEnglish, isEnglish, localizedPath,];
var __VLS_3;
var __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ class: "button-ghost button-large" }, { to: (__VLS_ctx.localizedPath('/downloads/')) })));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ class: "button-ghost button-large" }, { to: (__VLS_ctx.localizedPath('/downloads/')) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
/** @type {__VLS_StyleScopedClasses['button-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['button-large']} */ ;
var __VLS_11 = __VLS_9.slots.default;
(__VLS_ctx.isEnglish ? "Firmware & downloads" : "固件与下载");
// @ts-ignore
[isEnglish, localizedPath,];
var __VLS_9;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-hero-index" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['home-hero-index']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "home-proof" }, { 'aria-label': "核心能力" }));
/** @type {__VLS_StyleScopedClasses['home-proof']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container home-proof-grid" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['home-proof-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.isEnglish ? "High-performance MCU" : "高性能国产主控");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.isEnglish ? "Firmware ecosystem" : "成熟固件生态");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.isEnglish ? "Flight-control platforms" : "飞控硬件平台");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.isEnglish ? "Aero engine family" : "航空发动机系列");
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "home-products" }));
/** @type {__VLS_StyleScopedClasses['home-products']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-section-heading" }));
/** @type {__VLS_StyleScopedClasses['home-section-heading']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "section-index" }));
/** @type {__VLS_StyleScopedClasses['section-index']} */ ;
(__VLS_ctx.isEnglish ? "PRODUCT SYSTEM" : "产品体系");
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.isEnglish ? "Built as a complete system" : "不止单一硬件，构建完整飞行系统");
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.isEnglish ? "Flight control, RF and power products developed around real operational needs." : "围绕真实飞行需求，覆盖控制、射频与动力的完整产品组合。");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-product-grid" }));
/** @type {__VLS_StyleScopedClasses['home-product-grid']} */ ;
for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.categories)); _i < _b.length; _i++) {
    var _c = _b[_i], category = _c[0], index = _c[1];
    var __VLS_12 = void 0;
    /** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
    NuxtLink;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12(__assign(__assign({ key: (category.name), to: (category.href) }, { class: "home-product-card" }), { class: (category.className) })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign(__assign({ key: (category.name), to: (category.href) }, { class: "home-product-card" }), { class: (category.className) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
    /** @type {__VLS_StyleScopedClasses['home-product-card']} */ ;
    var __VLS_17 = __VLS_15.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (category.image),
        alt: (category.name),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "product-card-shade" }));
    /** @type {__VLS_StyleScopedClasses['product-card-shade']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "product-card-number" }));
    /** @type {__VLS_StyleScopedClasses['product-card-number']} */ ;
    (index + 1);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "product-card-copy" }));
    /** @type {__VLS_StyleScopedClasses['product-card-copy']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
    (category.label);
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (category.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (category.description);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "product-card-arrow" }, { 'aria-hidden': "true" }));
    /** @type {__VLS_StyleScopedClasses['product-card-arrow']} */ ;
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, categories,];
    var __VLS_15;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ id: "services" }, { class: "home-support" }));
/** @type {__VLS_StyleScopedClasses['home-support']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-section-heading light" }));
/** @type {__VLS_StyleScopedClasses['home-section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['light']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "section-index" }));
/** @type {__VLS_StyleScopedClasses['section-index']} */ ;
(__VLS_ctx.isEnglish ? "SUPPORT" : "服务支持");
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.isEnglish ? "From documentation to firmware" : "从资料查询到固件构建");
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.isEnglish ? "A clearer path to verified files, build jobs and technical assistance." : "让经过审核的文件、编译任务和技术支持更容易被找到。");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-support-grid" }));
/** @type {__VLS_StyleScopedClasses['home-support-grid']} */ ;
for (var _d = 0, _e = __VLS_vFor((__VLS_ctx.supportItems)); _d < _e.length; _d++) {
    var item = _e[_d][0];
    var __VLS_18 = void 0;
    /** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
    NuxtLink;
    // @ts-ignore
    var __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18(__assign({ key: (item.number), to: (item.href) }, { class: "support-item" })));
    var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([__assign({ key: (item.number), to: (item.href) }, { class: "support-item" })], __VLS_functionalComponentArgsRest(__VLS_19), false));
    /** @type {__VLS_StyleScopedClasses['support-item']} */ ;
    var __VLS_23 = __VLS_21.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "support-number" }));
    /** @type {__VLS_StyleScopedClasses['support-number']} */ ;
    (item.number);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    (item.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (item.description);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "support-arrow" }, { 'aria-hidden': "true" }));
    /** @type {__VLS_StyleScopedClasses['support-arrow']} */ ;
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, supportItems,];
    var __VLS_21;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ id: "contact" }, { class: "home-contact" }));
/** @type {__VLS_StyleScopedClasses['home-contact']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container home-contact-inner" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['home-contact-inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "section-index" }));
/** @type {__VLS_StyleScopedClasses['section-index']} */ ;
(__VLS_ctx.isEnglish ? "CONTACT" : "联系我们");
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.isEnglish ? "Have a product or integration question?" : "有产品选型或系统集成需求？");
var __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.NuxtLink | typeof __VLS_components.NuxtLink} */
NuxtLink;
// @ts-ignore
var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign({ class: "contact-link" }, { to: (__VLS_ctx.localizedPath('/contact/')) })));
var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign({ class: "contact-link" }, { to: (__VLS_ctx.localizedPath('/contact/')) })], __VLS_functionalComponentArgsRest(__VLS_25), false));
/** @type {__VLS_StyleScopedClasses['contact-link']} */ ;
var __VLS_29 = __VLS_27.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.isEnglish ? "Talk to us" : "与我们联系");
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    'aria-hidden': "true",
});
// @ts-ignore
[isEnglish, isEnglish, isEnglish, localizedPath,];
var __VLS_27;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
