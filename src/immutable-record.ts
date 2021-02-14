import produce, { Draft, immerable, Immutable } from 'immer';

export interface ImmutableWith<T> {
    with: (values: Partial<T>) => this;
}

export type ImmutableConstructor<T> = new (value?: Partial<T>) => Immutable<T> &
    ImmutableWith<T>;

export function ImmutableRecord<T>(
    defaultValues: T,
    processor?: (values: Partial<T>) => Partial<T>
) {
    const classProcessor = processor ?? ((value: Partial<T>) => value);

    class ImmutableRecordClass implements ImmutableWith<T> {
        [immerable] = true;

        constructor(values: Partial<T> = {}) {
            Object.assign(
                this,
                classProcessor({
                    ...{
                        ...defaultValues,
                        ...values,
                    },
                })
            );
        }

        /**
         * Returns a new object with updated values
         */
        with(values: Partial<T>): this {
            return produce(this, (prev: Draft<T>) => {
                values = classProcessor(values);

                Object.keys(values).forEach((key: string) => {
                    (prev as any)[key] = (values as any)[key];
                });
            });
        }
    }

    return (ImmutableRecordClass as unknown) as ImmutableConstructor<T>;
}
