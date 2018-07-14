function MoneyFormat(v, type) {
    if (typeof v === 'number' && !Number.isNaN(v)) {
        let len = String(Math.abs(Math.floor(v))).length
        switch (Math.floor(len / 3)) {
            case 0:
                return v;
            case 1:
                return v

            case 2:
                {
                    let num = v / 1000000;
                    let arr = [num.toFixed(2), 'M'];
                    if (type === 'arr') {
                        return arr
                    }
                    return arr.join('');
                }
            default:
                {
                    let num = v / 1000000000;
                    let arr = [num.toFixed(2), 'B'];
                    if (type === 'arr') {
                        return arr
                    }
                    return arr.join('');
                }
        }
    }
    if (typeof v === 'string') {
        if (v === '') {
            return null;
        }
        if (isNaN(v)) {
            if (isNaN(v.slice(0, -1))) {
                return v;
            }
            switch (v.slice(-1).toUpperCase()) {
                case 'K':
                    v = parseFloat(v) * 1000
                    return Number(v.toFixed(0));//解决浮点数精度问题
                case 'M':
                    v = parseFloat(v) * 1000000;
                    return Number(v.toFixed(0));
                case 'B':
                    v = parseFloat(v) * 1000000000;
                    return Number(v.toFixed(0));
                default:
                    return v;
            }
        } else {
            //本身就能被转换为数字类型
            //空字符串会返回0
            return Number(v);
        }
    }
    return v;
}

module.exports = {
    MoneyFormat
}