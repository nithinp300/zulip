/*
    Use this class to manage keys where you don't care
    about case (i.e. case-insensitive).

    Keys for FoldDict should be strings.  We "fold" all
    casings of "alice" (e.g. "ALICE", "Alice", "ALIce", etc.)
    to "alice" as the key.

    Examples of case-insensitive data in Zulip are:
        - emails
        - stream names
        - topics
        - etc.
 */
type KeyValue<V> = { k: string; v: V };

export class FoldDict<V> {
    private _items: Map<string, KeyValue<V>> = new Map();

    get(key: string): V | undefined {
        const mapping = this._items.get(this._munge(key));
        if (mapping === undefined) {
            return undefined;
        }
        return mapping.v;
    }

    set(key: string, value: V): V {
        this._items.set(this._munge(key), {k: key, v: value});
        return value;
    }

    has(key: string): boolean {
        return this._items.has(this._munge(key));
    }

    del(key: string): void {
        this._items.delete(this._munge(key));
    }

    keys(): string[] {
        return [...this._items.values()].map(({k}) => k);
    }

    values(): V[] {
        return [...this._items.values()].map(({v}) => v);
    }

    items(): [string, V][] {
        return [...this._items.values()].map(({k, v}) => [k, v]);
    }

    num_items(): number {
        return this._items.size;
    }

    is_empty(): boolean {
        return this._items.size === 0;
    }

    each(f: (v: V, k?: string) => void): void {
        this._items.forEach(({k, v}) => f(v, k));
    }

    clear(): void {
        this._items.clear();
    }

    // Handle case-folding of keys and the empty string.
    private _munge(key: string): string | undefined {
        if (key === undefined) {
            blueslip.error("Tried to call a FoldDict method with an undefined key.");
            return undefined;
        }

        return key.toString().toLowerCase();
    }
}
