import { enableMapSet, immerable, Immutable, produce } from "immer";

enableMapSet();

/**
 * immutable record interface
 */
export interface ImmutableWith<T> {
  /**
   * Returns a new object if values changed
   */
  with: (values: Partial<Immutable<T>>) => this;
}

/**
 * Represents a constructor for an immutable object
 */
export type ImmutableConstructor<T> = new (
  value?: Partial<Immutable<T>>,
) => Immutable<T> & ImmutableWith<T>;

/**
 * Class factory to create an immutable record
 * @param defaultValues Default values
 * @param processor Processor for values
 */
export function ImmutableRecord<T>(
  defaultValues: T | Immutable<T>,
  processor?: (values: Partial<Immutable<T>>) => Partial<Immutable<T>>,
): ImmutableConstructor<T> {
  const classProcessor = processor ?? ((value: Partial<Immutable<T>>) => value);

  /**
   * Immutable record class
   */
  class ImmutableRecordClass implements ImmutableWith<T> {
    [immerable] = true;

    constructor(values: Partial<Immutable<T>> = {}) {
      Object.assign(
        this,
        classProcessor({
          ...{
            ...defaultValues,
            ...values,
          },
        }),
      );
    }

    /**
     * Returns a new object with updated values
     */
    with(values: Partial<Immutable<T>>): this {
      return produce(this, (prev) => {
        values = classProcessor(values);

        Object.keys(values).forEach((key) => {
          if (key in prev) {
            // deno-lint-ignore no-explicit-any
            (prev as any)[key] = (values as any)[key];
          }
        });
      });
    }
  }

  return (ImmutableRecordClass as unknown) as ImmutableConstructor<T>;
}
