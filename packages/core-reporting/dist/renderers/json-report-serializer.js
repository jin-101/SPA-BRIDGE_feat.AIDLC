const sortValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(sortValue);
    }
    if (value && typeof value === 'object' && value.constructor === Object) {
        return Object.fromEntries(Object.entries(value)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, entry]) => [key, sortValue(entry)]));
    }
    return value;
};
export const serializeCanonicalJson = (value) => JSON.stringify(sortValue(value), null, 2);
//# sourceMappingURL=json-report-serializer.js.map