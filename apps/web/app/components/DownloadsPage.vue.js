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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var display_1 = require("../utils/display");
var _a = useLocale(), isEnglish = _a.isEnglish, text = _a.text, localizedPath = _a.localizedPath;
var data = (await useFetch("/api/firmware/catalog", {
    default: function () { return ({ downloads: [], presets: [] }); }
})).data;
var query = ref("");
var product = ref("");
var target = ref("");
var kind = ref("");
var channel = ref("");
var hardware = ref("");
var date = ref("");
var catalog = computed(function () { var _a, _b; return (_b = (_a = data.value) === null || _a === void 0 ? void 0 : _a.downloads) !== null && _b !== void 0 ? _b : []; });
var presets = computed(function () { var _a, _b; return (_b = (_a = data.value) === null || _a === void 0 ? void 0 : _a.presets) !== null && _b !== void 0 ? _b : []; });
var products = computed(function () { return __spreadArray([], new Set(catalog.value.map(function (item) { return item.productName; })), true); });
var targets = computed(function () { return __spreadArray([], new Set(catalog.value.map(function (item) { return item.target; })), true); });
var hardwareVersions = computed(function () { return __spreadArray([], new Set(catalog.value.map(function (item) { return item.hardwareVersion; })), true); });
var results = computed(function () {
    var normalized = query.value.trim().toLowerCase();
    return catalog.value.filter(function (item) {
        var searchable = [item.productName, item.target, item.version, item.fileName, item.changelog.zh, item.changelog.en].join(" ").toLowerCase();
        return ((!normalized || searchable.includes(normalized)) &&
            (!product.value || item.productName === product.value) &&
            (!target.value || item.target === target.value) &&
            (!kind.value || item.kind === kind.value) &&
            (!channel.value || item.channel === channel.value) &&
            (!hardware.value || item.hardwareVersion === hardware.value) &&
            (!date.value || item.releaseDate >= date.value));
    });
});
var selectedPreset = computed(function () { return presets.value[0]; });
var buildForm = reactive({
    productId: "f435-vmt7",
    target: "GREATMOUNTAINF435",
    sourceRef: "stable-4.3.4",
    presetId: "great-mountain-f435-preview",
    notificationEmail: "",
    options: {
        receiver: "CRSF",
        gps: "启用",
        osd: "启用",
        blackbox: "启用",
        language: "简体中文"
    }
});
var buildSubmitting = ref(false);
var buildMessage = ref("");
var buildError = ref(false);
var submitBuild = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buildSubmitting.value = true;
                buildMessage.value = "";
                buildError.value = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, $fetch("/api/firmware/jobs", {
                        method: "POST",
                        body: buildForm
                    })];
            case 2:
                result = _a.sent();
                buildMessage.value = "".concat(result.message, " ").concat(isEnglish.value ? "Job" : "任务", ": ").concat(result.id);
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                buildError.value = true;
                buildMessage.value = error_1 instanceof Error ? error_1.message : isEnglish.value ? "Unable to submit job." : "提交任务失败。";
                return [3 /*break*/, 5];
            case 4:
                buildSubmitting.value = false;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var labelForKind = function (item) { return text(display_1.firmwareKindLabels[item.kind]); };
var labelForChannel = function (item) { return text(display_1.channelLabels[item.channel]); };
useSeoMeta({ title: function () { return (isEnglish.value ? "Downloads | Great Mountain" : "下载中心 | 重山航空"); } });
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
    eyebrow: (__VLS_ctx.isEnglish ? 'Resources' : '资料中心'),
    title: (__VLS_ctx.isEnglish ? 'Downloads and firmware' : '下载中心与固件管理'),
    description: (__VLS_ctx.isEnglish ? 'Find product documents, verified firmware and the online Betaflight build entry.' : '按产品、Target、固件类型和版本筛选资料，并预留在线 Betaflight 编译入口。'),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        eyebrow: (__VLS_ctx.isEnglish ? 'Resources' : '资料中心'),
        title: (__VLS_ctx.isEnglish ? 'Downloads and firmware' : '下载中心与固件管理'),
        description: (__VLS_ctx.isEnglish ? 'Find product documents, verified firmware and the online Betaflight build entry.' : '按产品、Target、固件类型和版本筛选资料，并预留在线 Betaflight 编译入口。'),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "container content-section" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "downloads-layout" }));
/** @type {__VLS_StyleScopedClasses['downloads-layout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "filter-panel" }, { 'aria-label': "下载筛选" }));
/** @type {__VLS_StyleScopedClasses['filter-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.isEnglish ? "Filter resources" : "筛选资料");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "filter-field" }));
/** @type {__VLS_StyleScopedClasses['filter-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "download-query",
});
(__VLS_ctx.isEnglish ? "Keyword" : "关键词");
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "download-query",
    type: "search",
    placeholder: (__VLS_ctx.isEnglish ? 'Search...' : '搜索产品、Target或文件名'),
});
(__VLS_ctx.query);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "filter-field" }));
/** @type {__VLS_StyleScopedClasses['filter-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "download-product",
});
(__VLS_ctx.isEnglish ? "Product" : "产品型号");
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "download-product",
    value: (__VLS_ctx.product),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
(__VLS_ctx.isEnglish ? "All products" : "全部产品");
for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.products)); _i < _b.length; _i++) {
    var item = _b[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (item),
        value: (item),
    });
    (item);
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, query, product, products,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "filter-field" }));
/** @type {__VLS_StyleScopedClasses['filter-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "download-target",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "download-target",
    value: (__VLS_ctx.target),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
(__VLS_ctx.isEnglish ? "All targets" : "全部 Target");
for (var _c = 0, _d = __VLS_vFor((__VLS_ctx.targets)); _c < _d.length; _c++) {
    var item = _d[_c][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (item),
        value: (item),
    });
    (item);
    // @ts-ignore
    [isEnglish, target, targets,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "filter-field" }));
/** @type {__VLS_StyleScopedClasses['filter-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "download-kind",
});
(__VLS_ctx.isEnglish ? "Type" : "文件类型");
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "download-kind",
    value: (__VLS_ctx.kind),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
(__VLS_ctx.isEnglish ? "All types" : "全部类型");
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "firmware",
});
(__VLS_ctx.isEnglish ? "Firmware" : "固件");
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "manual",
});
(__VLS_ctx.isEnglish ? "Manual" : "说明书");
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "vtx-table",
});
(__VLS_ctx.isEnglish ? "VTX table" : "图传表");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "filter-field" }));
/** @type {__VLS_StyleScopedClasses['filter-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "download-channel",
});
(__VLS_ctx.isEnglish ? "Channel" : "发布通道");
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "download-channel",
    value: (__VLS_ctx.channel),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
(__VLS_ctx.isEnglish ? "All channels" : "全部版本");
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "stable",
});
(__VLS_ctx.isEnglish ? "Stable" : "稳定版");
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "alpha",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "development",
});
(__VLS_ctx.isEnglish ? "Development" : "开发版");
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "filter-field" }));
/** @type {__VLS_StyleScopedClasses['filter-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "download-hardware",
});
(__VLS_ctx.isEnglish ? "Hardware" : "硬件版本");
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "download-hardware",
    value: (__VLS_ctx.hardware),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
(__VLS_ctx.isEnglish ? "All hardware" : "全部硬件");
for (var _e = 0, _f = __VLS_vFor((__VLS_ctx.hardwareVersions)); _e < _f.length; _e++) {
    var item = _f[_e][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (item),
        value: (item),
    });
    (item);
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, kind, channel, hardware, hardwareVersions,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "filter-field" }));
/** @type {__VLS_StyleScopedClasses['filter-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "download-date",
});
(__VLS_ctx.isEnglish ? "Released after" : "发布日期起始");
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "download-date",
    type: "date",
});
(__VLS_ctx.date);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "downloads-results" }));
/** @type {__VLS_StyleScopedClasses['downloads-results']} */ ;
for (var _g = 0, _h = __VLS_vFor((__VLS_ctx.results)); _g < _h.length; _g++) {
    var item = _h[_g][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (item.id) }, { class: "download-card" }));
    /** @type {__VLS_StyleScopedClasses['download-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "download-card-head" }));
    /** @type {__VLS_StyleScopedClasses['download-card-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "eyebrow" }));
    /** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
    (item.productName);
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    (item.fileName);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "tag" }));
    /** @type {__VLS_StyleScopedClasses['tag']} */ ;
    (__VLS_ctx.labelForChannel(item));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "download-card-meta" }));
    /** @type {__VLS_StyleScopedClasses['download-card-meta']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "tag" }));
    /** @type {__VLS_StyleScopedClasses['tag']} */ ;
    (__VLS_ctx.labelForKind(item));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "tag muted" }));
    /** @type {__VLS_StyleScopedClasses['tag']} */ ;
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
    (item.version);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "tag muted" }));
    /** @type {__VLS_StyleScopedClasses['tag']} */ ;
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
    (item.hardwareVersion);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "tag muted" }));
    /** @type {__VLS_StyleScopedClasses['tag']} */ ;
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
    (item.target);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.text(item.changelog));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.isEnglish ? "Released" : "发布日期");
    (item.releaseDate);
    (item.fileSize);
    (item.sha256);
    if (item.buildOptions.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (__VLS_ctx.isEnglish ? "Build options" : "构建选项");
        (item.buildOptions.join(" / "));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "download-card-actions" }));
    /** @type {__VLS_StyleScopedClasses['download-card-actions']} */ ;
    if (item.href) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign({ class: "button-primary" }, { href: (item.href), download: true }));
        /** @type {__VLS_StyleScopedClasses['button-primary']} */ ;
        (__VLS_ctx.isEnglish ? "Download" : "下载");
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "button-secondary" }));
        /** @type {__VLS_StyleScopedClasses['button-secondary']} */ ;
        (__VLS_ctx.isEnglish ? "File migration pending" : "文件迁移待完成");
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "muted-text" }));
    /** @type {__VLS_StyleScopedClasses['muted-text']} */ ;
    (__VLS_ctx.isEnglish ? "Downloads" : "下载次数");
    (item.downloadCount);
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, date, results, labelForChannel, labelForKind, text,];
}
if (!__VLS_ctx.results.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty-state" }));
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    (__VLS_ctx.isEnglish ? "No resources match these filters." : "没有符合筛选条件的资料。");
}
__VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ id: "build" }, { class: "build-card" }));
/** @type {__VLS_StyleScopedClasses['build-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "eyebrow" }));
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
(__VLS_ctx.isEnglish ? "Online build (scaffold)" : "在线编译（框架入口）");
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.isEnglish ? "Build a Betaflight firmware" : "按 Target 编译 Betaflight 固件");
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.isEnglish ? "Only administrator-approved repositories, refs and verified option combinations will be accepted. The real F435 build remains disabled until target hardware is verified." : "仅接受管理员配置的仓库、提交和验证过的选项组合。真实 F435 Target 完成硬件确认前，编译任务只作为流程演示。");
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)(__assign({ onSubmit: (__VLS_ctx.submitBuild) }, { class: "build-form" }));
/** @type {__VLS_StyleScopedClasses['build-form']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
(__VLS_ctx.isEnglish ? "Product" : "产品");
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    value: (__VLS_ctx.buildForm.productId),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "f435-vmt7",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "f435-rgt7",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    readonly: true,
});
(__VLS_ctx.buildForm.target);
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
(__VLS_ctx.isEnglish ? "Source ref" : "源码版本");
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    value: (__VLS_ctx.buildForm.sourceRef),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "stable-4.3.4",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "alpha",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "development",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
(__VLS_ctx.isEnglish ? "Verified preset" : "验证配置");
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    value: (__VLS_ctx.buildForm.presetId),
});
for (var _j = 0, _k = __VLS_vFor((__VLS_ctx.presets)); _j < _k.length; _j++) {
    var preset = _k[_j][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (preset.id),
        value: (preset.id),
    });
    (__VLS_ctx.text(preset.label));
    // @ts-ignore
    [isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, isEnglish, results, text, submitBuild, buildForm, buildForm, buildForm, buildForm, presets,];
}
if (__VLS_ctx.selectedPreset) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "full option-list" }));
    /** @type {__VLS_StyleScopedClasses['full']} */ ;
    /** @type {__VLS_StyleScopedClasses['option-list']} */ ;
    for (var _l = 0, _m = __VLS_vFor((__VLS_ctx.selectedPreset.options)); _l < _m.length; _l++) {
        var option = _m[_l][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
            key: (option.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.text(option.label));
        __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
            value: (__VLS_ctx.buildForm.options[option.id]),
        });
        for (var _o = 0, _p = __VLS_vFor((option.values)); _o < _p.length; _o++) {
            var value = _p[_o][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
                key: (value),
                value: (value),
            });
            (value);
            // @ts-ignore
            [text, buildForm, selectedPreset, selectedPreset,];
        }
        // @ts-ignore
        [];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
(__VLS_ctx.isEnglish ? "Email (optional)" : "邮箱（可选）");
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "email",
    placeholder: "name@example.com",
});
(__VLS_ctx.buildForm.notificationEmail);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "full" }));
/** @type {__VLS_StyleScopedClasses['full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ class: "button-primary" }, { type: "submit", disabled: (__VLS_ctx.buildSubmitting) }));
/** @type {__VLS_StyleScopedClasses['button-primary']} */ ;
(__VLS_ctx.buildSubmitting ? (__VLS_ctx.isEnglish ? "Submitting…" : "提交中…") : (__VLS_ctx.isEnglish ? "Submit build job" : "提交编译任务"));
if (__VLS_ctx.buildMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "form-message" }, { class: ({ error: __VLS_ctx.buildError }) }));
    /** @type {__VLS_StyleScopedClasses['form-message']} */ ;
    /** @type {__VLS_StyleScopedClasses['error']} */ ;
    (__VLS_ctx.buildMessage);
}
// @ts-ignore
[isEnglish, isEnglish, isEnglish, buildForm, buildSubmitting, buildSubmitting, buildMessage, buildMessage, buildError,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
