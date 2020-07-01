const getChildren = (arr, pid, pidKey) => {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][pidKey] === pid) {
            result.push(arr[i]);
        }
    }
    return result;
};
const mapChildren = (arr, result, pidKey, idKey) => {
    if (result.length === 0) {
        return
    }
    for (let i = 0; i < result.length; i++) {
        result[i].children = getChildren(arr, result[i][idKey], pidKey);
        mapChildren(arr, result[i].children, pidKey);
    }
};

export default {

    /**
     * 数组去重
     * @param arr 去重数组
     * @returns {any[]}
     */
    uniq(arr) {
        return [...new Set(arr)];
    },

    /**
     * 数组取最大值
     * @param arr
     * @returns {number}
     */
    max(arr) {
        return Math.max.apply(null, arr);
    },

    /**
     * 数组取最小值
     * @param arr
     * @returns {number}
     */
    min(arr) {
        return Math.min.apply(null, arr);
    },

    /**
     * 对象数组排序
     * @param arr
     * @param attr 属性key
     * @param order 排序方式 asc 升序 desc 降序
     */
    sortBy(arr, attr, order = 'asc') {
        const copy = JSON.parse(JSON.stringify(arr));
        for (let i = 0; i < copy.length - 1; i++) {
            for (let j = 0; j < copy.length - 1 - i; j++) {
                if (typeof copy[j] === 'object' && !Array.isArray(copy[j])) {
                    if (order === 'asc') {
                        if (copy[j][attr] > copy[j + 1][attr]) {
                            const temp = copy[j];
                            copy[j] = copy[j + 1];
                            copy[j + 1] = temp;
                        }
                    } else if (order === 'desc') {
                        if (copy[j][attr] < copy[j + 1][attr]) {
                            const temp = copy[j];
                            copy[j] = copy[j + 1];
                            copy[j + 1] = temp;
                        }
                    }
                } else {
                    throw Error('item type is invalid')
                }
            }
        }
        return copy;
    },

    /**
     * 构建树形结构(不会改变原数组)
     * @param {Array} arr 所有节点组成的数组
     * @param {String | null} rootId 根节点id的pid 如果没有传null
     * @param {String} idKey id的键名
     * @param {String} pidKey pid的键名
     * @returns {Array}
     */
    formatTree(arr, rootId, idKey, pidKey) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][pidKey] === rootId || arr[i][pidKey] === undefined) {
                result.push(arr[i]);
            }
        }
        for (let i = 0; i < result.length; i++) {
            result[i].children = getChildren(arr, result[i][idKey], pidKey);
            mapChildren(arr, result[i].children, pidKey, idKey);
        }
        return result
    },

    /**
     * 格式化时间戳
     * @param {Number | Date} time 毫秒时间戳 | 时间对象
     * @param {String} fmt 格式化方式
     * @returns {*}
     */
    formatDate(time, fmt) {
        if (!time) return '';
        let date = typeof time === 'number' ? new Date(time) : time;
        const expList = {
            "M+": date.getMonth() + 1,                //月份
            "d+": date.getDate(),                    //日
            "H+": date.getHours(),                   //小时
            "h+": date.getHours() <= 12 ? date.getHours() : date.getHours() - 12, //12制小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds(),             //毫秒
            "n": date.getHours() < 12 ? 'AM' : 'PM', //上午am,下午pm
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (let exp in expList) {
            if (new RegExp(`(${exp})`).test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ?
                  (expList[exp]) : ((`00${expList[exp]}`).substr((`${expList[exp]}`).length)));
            }
        }
        return fmt;
    },

    /**
     * 随机数方法,取[min, max]
     * @param min 最小值
     * @param max 最大值
     * @returns {number}
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
     * 函数柯里化
     * @param fn {function} 需要函数柯里化的函数
     * @param args 需要被解耦的参数集
     */
    curring(fn, ...args) {
        return (..._args) => {
            return fn.call(this, ...args, ..._args);
        }
    },



    /**
     * 防抖函数
     * @param method 事件触发的操作
     * @param delay 多少毫秒内连续触发事件，不会执行
     * @returns {Function}
     */
    debounce(method, delay) {
        let timer = null;
        return function () {
            let self = this;
            let args = arguments;
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                method.apply(self, args);
            },delay);
        }
    },

    /**
     * 节流函数
     * @param method 事件触发的操作
     * @param mustRunDelay 间隔多少毫秒需要触发一次事件
     */
    throttle(method, mustRunDelay) {
        let timer;
        let start;
        return function loop() {
            let args = arguments;
            let self = this;
            let now = Date.now();
            if(!start){
                start = now;
            }
            if(timer){
                clearTimeout(timer);
            }
            if(now - start >= mustRunDelay){
                method.apply(self, args);
                start = now;
            }else {
                timer = setTimeout(function () {
                    loop.apply(self, args);
                }, 50);
            }
        }
    },
}
