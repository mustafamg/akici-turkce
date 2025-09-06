"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avoidNoCacheable = exports.NoCacheableError = void 0;
exports.redisStore = redisStore;
exports.redisInsStore = redisInsStore;
exports.redisClusterStore = redisClusterStore;
exports.redisClusterInsStore = redisClusterInsStore;
const redis_1 = require("redis");
require("@redis/client");
require("@redis/bloom");
require("@redis/graph");
require("@redis/json");
require("@redis/search");
require("@redis/time-series");
class NoCacheableError {
    message;
    name = 'NoCacheableError';
    constructor(message) {
        this.message = message;
    }
}
exports.NoCacheableError = NoCacheableError;
const avoidNoCacheable = async (p) => {
    try {
        return await p;
    }
    catch (e) {
        if (!(e instanceof NoCacheableError))
            throw e;
    }
};
exports.avoidNoCacheable = avoidNoCacheable;
const getVal = (value) => JSON.stringify(value) || '"undefined"';
const getFullKey = (originalKey, keyPrefix) => `${keyPrefix ? `${keyPrefix}:` : ''}${originalKey}`;
function builder(redisCache, name, reset, keys, options) {
    const isCacheable = options?.isCacheable || ((value) => value !== undefined && value !== null);
    return {
        async get(key) {
            const val = await redisCache.get(getFullKey(key, options?.keyPrefix));
            if (val === undefined || val === null)
                return undefined;
            else
                return JSON.parse(val);
        },
        async set(key, value, ttl) {
            if (!isCacheable(value))
                throw new NoCacheableError(`"${value}" is not a cacheable value`);
            const t = ttl === undefined ? options?.ttl : ttl;
            if (t !== undefined && t !== 0)
                await redisCache.set(getFullKey(key, options?.keyPrefix), getVal(value), { PX: t });
            else
                await redisCache.set(getFullKey(key, options?.keyPrefix), getVal(value));
        },
        async mset(args, ttl) {
            const t = ttl === undefined ? options?.ttl : ttl;
            if (t !== undefined && t !== 0) {
                const multi = redisCache.multi();
                for (const [key, value] of args) {
                    if (!isCacheable(value))
                        throw new NoCacheableError(`"${getVal(value)}" is not a cacheable value`);
                    multi.set(getFullKey(key, options?.keyPrefix), getVal(value), { PX: t });
                }
                await multi.exec();
            }
            else
                await redisCache.mSet(args.map(([key, value]) => {
                    if (!isCacheable(value))
                        throw new Error(`"${getVal(value)}" is not a cacheable value`);
                    return [key, getVal(value)];
                }));
        },
        mget: (...args) => redisCache
            .mGet(args)
            .then((x) => x.map((x) => x === null || x === undefined
            ? undefined
            : JSON.parse(x))),
        async mdel(...args) {
            let keys = args.map((key) => getFullKey(key, options?.keyPrefix));
            await redisCache.del(args);
        },
        async del(key) {
            await redisCache.del(getFullKey(key, options?.keyPrefix));
        },
        ttl: async (key) => redisCache.pTTL(key),
        keys: (pattern = '*') => keys(pattern),
        reset,
        isCacheable,
        name,
        get client() {
            return redisCache;
        },
    };
}
// TODO: past instance as option
async function redisStore(options) {
    const redisCache = (0, redis_1.createClient)(options);
    try {
        await redisCache.connect();
    }
    catch (e) {
        console.error("Redis Connection Error: ", e);
        throw e;
    }
    return redisInsStore(redisCache, options);
}
/**
 * redisCache should be connected
 */
function redisInsStore(redisCache, options) {
    const reset = async () => {
        await redisCache.flushDb();
    };
    const keys = (pattern) => redisCache.keys(pattern);
    return builder(redisCache, 'redis', reset, keys, options);
}
// TODO: coverage
async function redisClusterStore(options) {
    const redisCache = (0, redis_1.createCluster)(options);
    try {
        await redisCache.connect();
    }
    catch (e) {
        console.error("Redis Connection Error: ", e);
        throw e;
    }
    return redisClusterInsStore(redisCache, options);
}
// TODO: coverage
/**
 * redisCache should be connected
 */
function redisClusterInsStore(redisCache, options) {
    const reset = async () => {
        await Promise.all(redisCache.getMasters().map(async (node) => {
            if (node.client) {
                const client = await node.client;
                await client.flushDb();
            }
        }));
    };
    const keys = async (pattern) => (await Promise.all(redisCache.getMasters().map(async (node) => {
        if (node.client) {
            const client = await node.client;
            return await client.keys(pattern);
        }
        return [];
    }))).flat();
    return builder(redisCache, 'redis-cluster', reset, keys, options);
}
//# sourceMappingURL=index.js.map