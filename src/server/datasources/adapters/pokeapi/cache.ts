export class DataSourceCache {
    public static readonly CACHE_DURATION = 5 * 60 * 1000;
    private _cache = new Map<string, { data: unknown; timestamp: number }>();

    public async get<T>(key: string, resolveData: () => Promise<T>, cacheDuration: number = DataSourceCache.CACHE_DURATION): Promise<T> {
        const cached = this._cache.get(key);
        if (cached && (cacheDuration == 0 || (Date.now() - cached.timestamp) < cacheDuration)) {
            return cached.data as T
        }

        const data = await resolveData();
        this._cache.set(key, { data, timestamp: Date.now() })
        return data;
    }

    public contains(key: string): boolean {
        return this._cache.has(key);
    }
}