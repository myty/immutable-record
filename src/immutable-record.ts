import produce, { Draft, immerable, Immutable } from 'immer';

export interface ImmutableWith<T> {
    with: (values: Partial<T>) => this;
}

export type ImmutableConstructor<T> = new (value?: Partial<T>) => Immutable<T> &
    ImmutableWith<T>;

export type ImmutablePartial<T> = Partial<T | Immutable<T>>;

export function ImmutableRecord<T>(
    defaultValues: T | Immutable<T>,
    processor?: (values: ImmutablePartial<T>) => Partial<T>
) {
    const classProcessor = processor ?? ((value: ImmutablePartial<T>) => value);

    class ImmutableRecordClass implements ImmutableWith<T> {
        [immerable] = true;

        constructor(values: ImmutablePartial<T> = {}) {
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
        with(values: ImmutablePartial<T>): this {
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
