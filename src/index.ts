import produce, { Draft, immerable, Immutable } from 'immer';

interface ImmutableWith<T> {
    with: (values: Partial<T>) => this;
}

type ImmutableConstructor<T> = new (value?: Partial<T>) => Immutable<T> &
    ImmutableWith<T>;

export function ImmutableRecord<T>(defaultValues: T) {
    class ImmutableRecordClass implements ImmutableWith<T> {
        [immerable] = true;

        constructor(values: Partial<T> = {}) {
            Object.assign(this, {
                ...{
                    ...defaultValues,
                    ...values,
                },
            });
        }

        /**
         * Returns a new object with updated values
         */
        with(values: Partial<T>): this {
            return produce(this, (prev: Draft<T>) => {
                Object.keys(values).forEach((key: string) => {
                    (prev as any)[key] = (values as any)[key];
                });
            });
        }
    }

    return (ImmutableRecordClass as unknown) as ImmutableConstructor<T>;
}
