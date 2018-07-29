const redMax = [255, 0, 0];
const redMin = [155, 0, 0];
const greenMax = [0, 204, 0];
const greenMin = [0, 105, 0];

const maxProp = 0.1;

function EarningColor(value, forecast) {
    if (forecast === null) {
        return false;
    }

    if (forecast === 0) {
        if (value >= 0) {
            return red(value);
        } else {
            return green(Math.abs(value));
        }

    }

    switch (true) {
        case value === forecast:
            return red(0);
        case value > forecast:
            return red(Math.abs(value - forecast) / Math.abs(forecast));
        case value < forecast:
            return green(Math.abs(value - forecast) / Math.abs(forecast))
        default:
            break;
    }
}


function red(v) {
    if (v >= maxProp) {
        return rgb(redMax);
    }
    const r = (redMax[0] - redMin[0]) * v + redMin[0];
    const g = (redMax[1] - redMin[1]) * v + redMin[1];
    const b = (redMax[2] - redMin[2]) * v + redMin[2];
    return `rgb(${r},${g},${b})`
}
function green(v) {
    if (v >= maxProp) {
        return rgb(greenMax);
    }
    const r = (greenMax[0] - greenMin[0]) * v + greenMin[0];
    const g = (greenMax[1] - greenMin[1]) * v + greenMin[1];
    const b = (greenMax[2] - greenMin[2]) * v + greenMin[2];
    return `rgb(${r},${g},${b})`
}


function rgb(arr) {
    return `rgb(${arr[0]},${arr[1]},${arr[2]})`
}

module.exports = {
    EarningColor
}