type SerializeFunction<T> = (value: T) => string;
type DeserializeFunction<T> = (value: string) => T;
interface UseLocalStorageStateOptions<T> {
    serialize?: SerializeFunction<T>;
    deserialize?: DeserializeFunction<T>;
}
export declare function useLocalStorage<T>(key: string, defaultValue?: T, { serialize, deserialize, }?: UseLocalStorageStateOptions<T>): [T, (value: T) => void, () => void];
export declare enum LocalStorageKeys {
    NEYNAR_AUTHENTICATED_USER = "neynar_authenticated_user"
}
export {};
