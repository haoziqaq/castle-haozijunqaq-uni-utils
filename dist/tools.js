"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    /**
     * 防抖函数
     * @param method 事件触发的操作
     * @param delay 多少毫秒内连续触发事件，不会执行
     * @returns {Function}
     */
    $debounce: function $debounce(method, delay) {
        var timer = null;
        return function () {
            var self = this;
            var args = arguments;
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                method.apply(self, args);
            }, delay);
        };
    },


    /**
     * 节流函数
     * @param method 事件触发的操作
     * @param mustRunDelay 间隔多少毫秒需要触发一次事件
     */
    $throttle: function $throttle(method, mustRunDelay) {
        var timer = void 0;
        var args = arguments;
        var start = void 0;
        return function loop() {
            var self = this;
            var now = Date.now();
            if (!start) {
                start = now;
            }
            if (timer) {
                clearTimeout(timer);
            }
            if (now - start >= mustRunDelay) {
                method.apply(self, args);
                start = now;
            } else {
                timer = setTimeout(function () {
                    loop.apply(self, args);
                }, 50);
            }
        };
    }
};