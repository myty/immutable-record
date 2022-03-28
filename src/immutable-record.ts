import produce, {
  enableMapSet,
  immerable,
  Immutable,
} from "https://cdn.skypack.dev/immer@9.0.12?dts";

enableMapSet();

export interface ImmutableWith<T> {
  with: (values: Partial<Immutable<T>>) => this;
}

export type ImmutableConstructor<T> = new (
  value?: Partial<Immutable<T>>,
) => Immutable<T> & ImmutableWith<T>;

export function ImmutableRecord<T>(
  defaultValues: T | Immutable<T>,
  processor?: (values: Partial<Immutable<T>>) => Partial<Immutable<T>>,
) {
  const classProcessor = processor ?? ((value: Partial<Immutable<T>>) => value);

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
