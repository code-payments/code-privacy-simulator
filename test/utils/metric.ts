type MetricSerializer = (m: Metric) => string;
type MetricRenderer = (v: number) => string;

export const DefaultMetricRenderer = (v: number) => v.toLocaleString('en-US').padEnd(16);

export const MetricSerializer = (m: Metric, r: MetricRenderer = DefaultMetricRenderer) => {
    return [
        `mean: ${r(m.mean)}`,
        `median: ${r(m.median)}`,
        `min: ${r(m.min)}`,
        `max: ${r(m.max)}`,
    ].join('');
}

export const MetricSerializerWithTotal = (m: Metric, r: MetricRenderer = DefaultMetricRenderer) => {
    return [
        `${r(m.total)} | `,
        MetricSerializer(m, r),
    ].join('');
}

export class Metric {

    values: number[] = [];

    total: number = 0;
    mean: number = 0;
    median: number = 0;
    min: number = Number.POSITIVE_INFINITY;
    max: number = Number.NEGATIVE_INFINITY;

    serializer: MetricSerializer;

    constructor(fn: MetricSerializer = MetricSerializerWithTotal) {
        this.serializer = fn;
    }

    add(value: number) : void {
        this.values.push(value);
        this.mean += value;
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
    }

    finalize() : void {
        this.total = this.mean;
        this.values.sort();
        this.mean /= this.values.length;
        this.median = this.values[Math.floor(this.values.length / 2)];
    }

    toString() : string {
        return this.serializer(this);
    }

}