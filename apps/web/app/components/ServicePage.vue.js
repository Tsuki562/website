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
var resources = computed(function () { return [
    {
        title: { zh: "AT32F435 系列飞控", en: "AT32F435 flight controllers" },
        description: { zh: "飞控说明书、接线图、固件与刷机工具。", en: "Manuals, wiring diagrams, firmware and flashing tools." },
        href: localizedPath("/flightcontrol_service/")
    },
    {
        title: { zh: "电调", en: "ESC" },
        description: { zh: "电调产品说明与相关技术资料。", en: "ESC product and technical resources." },
        href: "/esc-45a/"
    },
    {
        title: { zh: "Beacon 系列图传", en: "Beacon video transmitters" },
        description: { zh: "说明书、接线图、故障排查与图传表。", en: "Manuals, wiring, troubleshooting and VTX tables." },
        href: "/trans_grid/"
    },
    {
        title: { zh: "天线", en: "Antennas" },
        description: { zh: "定制频段与产品支持资料。", en: "Custom frequencies and product support." }
    },
    {
        title: { zh: "航空发动机", en: "Aero engines" },
        description: { zh: "SE 系列发动机规格与服务入口。", en: "SE engine specifications and support." },
        href: localizedPath("/g-motor/")
    },
    {
        title: { zh: "下载中心", en: "Download center" },
        description: { zh: "统一筛选产品资料、固件和工具。", en: "Filter product resources, firmware and tools." },
        href: localizedPath("/downloads/")
    }
]; });
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.ResourcePage} */
ResourcePage;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    eyebrow: (__VLS_ctx.isEnglish ? 'Service' : '服务支持'),
    title: (__VLS_ctx.isEnglish ? 'Service and support' : '服务与支持'),
    description: (__VLS_ctx.isEnglish ? 'Product documentation, firmware and technical support in one place.' : '集中提供产品资料、固件下载和技术支持。'),
    resources: (__VLS_ctx.resources),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        eyebrow: (__VLS_ctx.isEnglish ? 'Service' : '服务支持'),
        title: (__VLS_ctx.isEnglish ? 'Service and support' : '服务与支持'),
        description: (__VLS_ctx.isEnglish ? 'Product documentation, firmware and technical support in one place.' : '集中提供产品资料、固件下载和技术支持。'),
        resources: (__VLS_ctx.resources),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_3;
// @ts-ignore
[isEnglish, isEnglish, isEnglish, resources,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
