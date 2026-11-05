/**
 * Decorators that wrap component methods with cross-cutting guard logic.
 *
 * Two decorators are provided:
 * - {@link requireOwner} — blocks non-owners and shows a toast error.
 * - {@link withConfirm} — opens a confirmation dialog before running the method.
 *
 * They can be composed: `requireOwner(getHuddle, msg, withConfirm(title, message, fn))`.
 *
 * @module decorators/guards
 */

/**
 * Wrap a component method so it only runs for the huddle owner.
 *
 * The wrapper checks ownership before calling the inner function.
 * If the current user is not the owner, it shows a toast error and returns early.
 *
 * @param {Function} getHuddle — A function that receives `this` (the component instance)
 *     and returns the Huddle to check.
 * @param {string} errorMessage — Toast message shown when a non-owner calls the method.
 * @param {Function} fn — The method to protect.
 * @returns {Function} Wrapped method.
 *
 * @example
 * // In a Vue component methods object:
 * methods: {
 *     deleteHuddle: requireOwner(
 *         function () { return this.huddle; },
 *         'Only the owner can delete this huddle.',
 *         function () { /* actual delete logic *\/ }
 *     )
 * }
 */
export function requireOwner(getHuddle, errorMessage, fn) {
    return function (...args) {
        const huddle = getHuddle.call(this, ...args);
        if (!huddle || !huddle.isOwner(this.currentUser)) {
            this.toast.error(errorMessage);
            return;
        }
        return fn.apply(this, args);
    };
}

/**
 * Wrap a method so it asks for confirmation before running.
 *
 * Opens a ConfirmModal via `this.$refs.confirm.open()` and runs the inner
 * function only when the user confirms.
 *
 * Title and message may be strings or functions that receive the method's
 * arguments, allowing dynamic text (e.g. including a participant name).
 *
 * @param {string|Function} title — Modal title, or a function of the method's arguments.
 * @param {string|Function} message — Modal message body, or a function of the method's arguments.
 * @param {Function} fn — The method to run after confirmation.
 * @returns {Function} Wrapped method.
 *
 * @example
 * // In a Vue component methods object:
 * methods: {
 *     removeParticipant: withConfirm(
 *         'Remove Participant',
 *         'Are you sure you want to remove this participant?',
 *         function (id) { /* actual remove logic *\/ }
 *     )
 * }
 */
export function withConfirm(title, message, fn) {
    return function (...args) {
        const resolvedTitle = typeof title === 'function' ? title(...args) : title;
        const resolvedMessage = typeof message === 'function' ? message(...args) : message;
        this.$refs.confirm.open({
            title: resolvedTitle,
            message: resolvedMessage,
            onConfirm: () => fn.apply(this, args)
        });
    };
}
