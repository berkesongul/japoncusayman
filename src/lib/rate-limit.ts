type RateLimitInfo = {
    count: number;
    resetTime: number;
};

// Next.js Edge ortamında dev/prod arası veriyi korumak için 
// global object oluşturuyoruz.
const globalForRateLimit = global as unknown as { rateLimitStore?: Map<string, RateLimitInfo> };
const store = globalForRateLimit.rateLimitStore || new Map<string, RateLimitInfo>();

if (process.env.NODE_ENV !== "production") {
    globalForRateLimit.rateLimitStore = store;
}

export function rateLimit(ip: string, prefix: string, limit: number, windowMs: number) {
    const key = `${prefix}:${ip}`;
    const now = Date.now();
    
    // Basit bir bellek temizliği (10 binden fazla IP/key birikirse)
    if (store.size > 10000) {
        for (const [k, v] of store.entries()) {
            if (now > v.resetTime) {
                store.delete(k);
            }
        }
    }

    const info = store.get(key);
    
    if (!info || now > info.resetTime) {
        store.set(key, { count: 1, resetTime: now + windowMs });
        return { success: true, count: 1 };
    }

    info.count += 1;
    store.set(key, info);

    return { 
        success: info.count <= limit, 
        count: info.count 
    };
}
