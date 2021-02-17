import { ImmutableRecord } from '../src/index';

describe('ImmutableRecord', () => {
    interface TestDataInterface {
        testNumber: number;
        testString: string;
        optionalString?: string;
    }

    const defaultValues: TestDataInterface = {
        testNumber: 1,
        testString: 'test',
    };

    class TestClass extends ImmutableRecord<TestDataInterface>(defaultValues) {
        withTestNumber(testNumber: number) {
            return this.with({ testNumber });
        }
    }

    it('sets default values', () => {
        // Arrange, Act
        const value = new TestClass();

        // Assert
        expect(value.testNumber).toEqual(defaultValues.testNumber);
        expect(value.testString).toEqual(defaultValues.testString);
        expect(value.optionalString).toBeUndefined();
    });

    describe('with', () => {
        it('returns a new object', () => {
            // Arrange
            const value = new TestClass();

            // Act
            const newValue = value.with({ testNumber: 2 });

            // Assert
            expect(value).not.toEqual(newValue);
        });

        it('returns a new object with assigned values', () => {
            // Arrange
            const newValues = {
                testNumber: 2,
                testString: 'test-updated',
            };

            // Act
            const value = new TestClass().with(newValues);

            // Assert
            expect(value.testNumber).toEqual(newValues.testNumber);
            expect(value.testString).toEqual(newValues.testString);
        });
    });

    describe('adding additional methods', () => {
        it('works', () => {
            // Arrange
            const newTestNumber = 2;

            // Act
            const newValue = new TestClass().withTestNumber(newTestNumber);

            // Assert
            expect(newValue.testNumber).toEqual(newTestNumber);
        });
    });

    describe('nesting', () => {
        it('works', () => {
            // Arrange
            const testNumber = 3;
            const testString = 'newTestString';

            // Act
            const newValue = new TestClass()
                .withTestNumber(2)
                .with({ testNumber })
                .with({ testString });

            // Assert
            expect(newValue.testNumber).toEqual(testNumber);
            expect(newValue.testString).toEqual(testString);
        });
    });

    describe('defaultNestedClasses', () => {
        interface TestParentClassInterface {
            data: TestDataInterface;
        }

        class TestParentClass extends ImmutableRecord<TestParentClassInterface>(
            { data: new TestClass() },
            values => {
                let { data } = values;

                if (!(data instanceof TestClass)) {
                    data = new TestClass(data);
                }

                return { ...values, data };
            }
        ) {}

        it('processes', () => {
            // Arrange
            const testNumber = 3;
            const testString = 'test-string';

            // Act
            const newValue = new TestParentClass({
                data: { testNumber, testString },
            });

            // Assert
            expect(newValue.data?.testNumber).toEqual(testNumber);
            expect(newValue.data?.testString).toEqual(testString);
            expect(newValue.data instanceof TestClass).toEqual(true);
        });

        it('processes when with is called', () => {
            // Arrange
            const testNumber = 3;
            const testString = 'test-string';

            // Act
            const newValue = new TestParentClass().with({
                data: { testNumber, testString },
            });

            // Assert
            expect(newValue.data?.testNumber).toEqual(testNumber);
            expect(newValue.data?.testString).toEqual(testString);
            expect(newValue.data instanceof TestClass).toEqual(true);
        });
    });

    describe('processor', () => {
        class TestClassWithProcessor extends ImmutableRecord(
            { data: defaultValues as TestDataInterface | undefined },
            values => {
                let { data } = values;

                if (!(data instanceof TestClass)) {
                    data = new TestClass(data);
                }

                return { ...values, data };
            }
        ) {}

        it('processes', () => {
            // Arrange
            const testNumber = 3;
            const testString = 'test-string';

            // Act
            const newValue = new TestClassWithProcessor({
                data: { testNumber, testString },
            });

            // Assert
            expect(newValue.data?.testNumber).toEqual(testNumber);
            expect(newValue.data?.testString).toEqual(testString);
            expect(newValue.data instanceof TestClass).toEqual(true);
        });

        it('processes when with is called', () => {
            // Arrange
            const testNumber = 3;
            const testString = 'test-string';

            // Act
            const newValue = new TestClassWithProcessor().with({
                data: { testNumber, testString },
            });

            // Assert
            expect(newValue.data?.testNumber).toEqual(testNumber);
            expect(newValue.data?.testString).toEqual(testString);
            expect(newValue.data instanceof TestClass).toEqual(true);
        });
    });
});
