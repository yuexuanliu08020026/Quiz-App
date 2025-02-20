/**
 * all props in object non-nullable
 * [P in keyof T] → Loops through all properties (P) in type T.
   NonNullable<T[P]> → Removes null and undefined from each property.
 */
export type RequiredNotNull<T> = {
    [P in keyof T]: NonNullable<T[P]>;
  };
  