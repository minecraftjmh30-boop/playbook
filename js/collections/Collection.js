/**
 * Generic ordered list of models.
 * @template T
 */
export class Collection {
    /**
     * @param {Array<T|object>} [items=[]] - Models or plain objects (plain objects are hydrated).
     * @param {new (data: object) => T} [Model] - Class used to hydrate plain objects.
     */
    constructor(items = [], Model = null) {
        this.Model = Model;
        this.items = [];
        items.forEach(item => this.add(item));
    }

    /**
     * Add an item to the collection, hydrating plain objects if a Model is set.
     * @param {T|object} item - Model instance or plain object.
     * @returns {T} The added model.
     */
    add(item) {
        const model = this.Model && !(item instanceof this.Model) ? new this.Model(item) : item;
        this.items.push(model);
        return model;
    }

    /**
     * Remove items matching a predicate.
     * @param {(item: T) => boolean} predicate - Test function.
     */
    remove(predicate) { this.items = this.items.filter(i => !predicate(i)); }

    /**
     * Remove the item at a specific index.
     * @param {number} index - Zero-based index.
     */
    removeAt(index) { if (index >= 0 && index < this.items.length) this.items.splice(index, 1); }

    /**
     * Find the first item matching a predicate.
     * @param {(item: T) => boolean} predicate - Test function.
     * @returns {T|undefined} The first matching item.
     */
    find(predicate) { return this.items.find(predicate); }

    /**
     * Return all items matching a predicate.
     * @param {(item: T) => boolean} predicate - Test function.
     * @returns {T[]} Matching items.
     */
    filter(predicate) { return this.items.filter(predicate); }

    /**
     * Return a sorted copy without changing the collection.
     * @param {keyof T} key
     * @param {'asc'|'desc'} [dir='asc']
     * @returns {T[]}
     */
    sortBy(key, dir = 'asc') {
        const m = dir === 'asc' ? 1 : -1;
        return [...this.items].sort((a, b) => (a[key] > b[key] ? m : a[key] < b[key] ? -m : 0));
    }

    /**
     * Number of items in the collection.
     * @returns {number}
     */
    get size() { return this.items.length; }

    /** Allows `for...of` and `v-for` over the collection. */
    [Symbol.iterator]() { return this.items[Symbol.iterator](); }
}
