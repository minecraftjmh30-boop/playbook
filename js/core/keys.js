/**
 * Shared injection keys for the application.
 *
 * Using a single exported Symbol ensures that `provide()` and `inject()`
 * match across components — calling `Symbol('toast')` in every file creates
 * unique values that never compare equal.
 */

/** Injection key for the page-level toast component. */
export const ToastKey = Symbol('toast');
