export const deepCompare = <T extends Record<string, unknown>>(a: T, b: T): boolean => 
    Object.entries(a).every(([key, value]) => 
        value !== null && typeof value === 'object'
         ? deepCompare(value as T, b[key] as T) 
         : value === b[key]
    );