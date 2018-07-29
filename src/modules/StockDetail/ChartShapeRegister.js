export default function (Shape) {
    Shape.registerShape('interval', 'eps', {
        getPoints(cfg) {
            const x = cfg.x;
            const y = cfg.y;
            const y0 = cfg.y0;
            const width = cfg.size;
            const blank = width / 16;
            return [
                { x: x - width / 2 + blank, y: y0 },
                { x: x - width / 2 + blank, y: y },
                { x: x - blank, y: y },
                { x: x - blank, y: y0 }
            ]
        },
        draw(cfg, group) { // 自定义最终绘制
            const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
            const polygon = group.addShape('polygon', {
                attrs: {
                    points: [
                        [points[0].x, points[0].y],
                        [points[1].x, points[1].y],
                        [points[2].x, points[2].y],
                        [points[3].x, points[3].y]
                    ],
                    fill: cfg.color
                }
            });
            return polygon; // !必须返回 shape
        }
    });
    Shape.registerShape('interval', 'epsForecast', {
        getPoints(cfg) {
            const x = cfg.x;
            const y = cfg.y;
            const width = cfg.size;
            return [
                { x: x - width / 2, y: y },
                { x, y }
            ]
        },
        draw(cfg, group) { // 自定义最终绘制
            const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
            const polygon = group.addShape('line', {
                attrs: {
                    x1: points[0].x,
                    y1: points[0].y,
                    x2: points[1].x,
                    y2: points[1].y,
                    lineWidth: 2,
                    stroke: cfg.color
                }
            });
            return polygon; // !必须返回 shape
        }
    });
    //////////////////////////////////////////////////////////////////
    Shape.registerShape('interval', 'revenueShape', {
        getPoints(cfg) {
            const x = cfg.x;
            const y = cfg.y;
            const y0 = cfg.y0;
            const width = cfg.size;
            const blank = width / 16;
            return [
                { x: x + blank, y: y0 },
                { x: x + blank, y: y },
                { x: x + width / 2 - blank, y: y },
                { x: x + width / 2 - blank, y: y0 },
            ]
        },
        draw(cfg, group) { // 自定义最终绘制
            const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
            const polygon = group.addShape('polygon', {
                attrs: {
                    points: [
                        [points[0].x, points[0].y],
                        [points[1].x, points[1].y],
                        [points[2].x, points[2].y],
                        [points[3].x, points[3].y]
                    ],
                    fill: cfg.color
                }
            });
            return polygon; // !必须返回 shape
        }
    });
    Shape.registerShape('interval', 'revenueForcast', {
        getPoints(cfg) {
            const x = cfg.x;
            const y = cfg.y;
            const width = cfg.size;
            return [
                { x: x + width / 2, y: y },
                { x, y }
            ]
        },
        draw(cfg, group) { // 自定义最终绘制
            const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
            const polygon = group.addShape('line', {
                attrs: {
                    x1: points[0].x,
                    y1: points[0].y,
                    x2: points[1].x,
                    y2: points[1].y,
                    lineWidth: 2,
                    stroke: cfg.color
                }
            });
            return polygon; // !必须返回 shape
        }
    });
}

