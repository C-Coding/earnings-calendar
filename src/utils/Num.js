function numFixed(num, amount = 1) {//截取数字     用于对大数字截取后进行是否互为正负数判断
    if (num === 0) {
        return 0;
    }
    if (num > 0) {
        return Number(String(num).slice(0, amount))
    } else {
        return Number(String(num).slice(0, amount + 1))
    }
}

module.exports = {
    numFixed
}