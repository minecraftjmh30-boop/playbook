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

    /** @param {T|object} item @returns {T} The added model. */
    add(item) {
        const model = this.Model && !(item instanceof this.Model) ? new this.Model(item) : item;
        this.items.push(model);
        return model;
    }

    /** @param {(item: T) => boolean} predicate */
    remove(predicate) { this.items = this.items.filter(i => !predicate(i)); }

    /** @param {number} index */
    removeAt(index) { if (index >= 0 && index < this.items.length) this.items.splice(index, 1); }

    /** @param {(item: T) => boolean} predicate @returns {T|undefined} */
    find(predicate) { return this.items.find(predicate); }

    /** @param {(item: T) => boolean} predicate @returns {T[]} */
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

    /** @returns {number} */
    get size() { return this.items.length; }

    /** Allows `for...of` and `v-for` over the collection. */
    [Symbol.iterator]() { return this.items[Symbol.iterator](); }
}
