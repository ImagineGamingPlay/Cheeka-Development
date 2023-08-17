export class BotCache<K, V> {
    private cache: Map<K, V>;

    constructor() {
        this.cache = new Map();
    }

    /**
     * Add a entry to the cache
     *
     * @param {K} key
     * @param {V} value
     *
     * @returns {Map<K, V>}
     */
    set(key: K, value: V): Map<K, V> {
        return this.cache.set(key, value);
    }

    /**
     * Get value associated with the given key.
     *
     * @param {K} key
     * @returns {V | undefined}
     */
    get(key: K): V | undefined {
        return this.cache.get(key);
    }

    /**
     * Check weather a key exists on the cache
     *
     * @param {K} key
     * @returns {Boolean}
     */
    has(key: K): boolean {
        return this.cache.has(key);
    }

    /**
     * Delete an entry from the cache
     *
     * @param {K} key
     */
    delete(key: K) {
        this.cache.delete(key);
    }

    /**
     * Clear everything from the cache
     *
     */
    clear() {
        this.cache.clear();
    }
}

export const repCooldownCache = new BotCache<string, number>();
export const triggerPatternCache = new Map<
    string,
    {
        stringMatch: string[];
        regexMatch: RegExp[];
        replyMessageContent: string;
    }
>();
