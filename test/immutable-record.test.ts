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
});
