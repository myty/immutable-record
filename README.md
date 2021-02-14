# Introduction

The sole purpose of this immutable record is to simply act as a class factory for immutable types.  For this particular implementation, it piggybacks off of immer and adds a `with` method to the record class.

# Installation

```bash
npm install simple-immutable-record
yarn add simple-immutable-record
```

# Usage

```typescript
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

const value = new TestClass();
// { testNumber: 1, testString: 'test' }

const newValue = value.with({ testNumber: 2, optionalString: 'test-optional' });
// { testNumber: 2, testString: 'test', optionalString: 'test-optional' }
```