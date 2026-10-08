"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocale = useLocale;
function useLocale() {
    var route = useRoute();
    var locale = computed(function () { return (route.path.startsWith("/en/") || route.path === "/en" ? "en" : "zh-CN"); });
    var isEnglish = computed(function () { return locale.value === "en"; });
    var text = function (value) { return (isEnglish.value ? value.en : value.zh); };
    var localizedPath = function (path) {
        if (!isEnglish.value)
            return path;
        if (path === "/")
            return "/en/";
        return "/en".concat(path).replace(/\/+/g, "/");
    };
    return { locale: locale, isEnglish: isEnglish, text: text, localizedPath: localizedPath };
}
