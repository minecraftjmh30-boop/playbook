/**
 * Base class for all models. Handles hydration from plain objects and cloning.
 */
export class BaseModel {
    /**
     * @param {object} [data={}] - Plain object whose properties are copied onto the instance.
     */
    constructor(data = {}) {
        Object.assign(this, data);
    }

    /**
     * Create a copy of this model that is an instance of the same class.
     * (Spreading with {...model} would lose the class and its methods.)
     * @returns {this}
     */
    clone() {
        return Object.assign(new this.constructor(), structuredClone({ ...this }));
    }
}
