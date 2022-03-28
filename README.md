# Introduction

The sole purpose of this immutable record is to simply act as a class factory for immutable types. For this particular implementation, it piggybacks off of immer and adds a `with` method to the record class.

## Deno

```typescript
import {
  ImmutableConstructor,
  ImmutableRecord,
  ImmutableWith,
} from "https://deno.land/x/simple-immutable-record/mod.ts";
```

## Node

```sh
npm install simple-immutable-record
```

or

```sh
yarn add simple-immutable-record
```

## Usage

```typescript
interface TestDataInterface {
  testNumber: number;
  testString: string;
  optionalString?: string;
}

const defaultValues: TestDataInterface = {
  testNumber: 1,
  testString: "test",
};

class TestClass extends ImmutableRecord<TestDataInterface>(defaultValues) {
  withTestNumber(testNumber: number) {
    return this.with({ testNumber });
  }
}

const value = new TestClass();
// { testNumber: 1, testString: 'test' }

const newValue = value.with({ testNumber: 2, optionalString: "test-optional" });
// { testNumber: 2, testString: 'test', optionalString: 'test-optional' }
```

### Processing Nested Classes

```typescript
interface TestParentClassInterface {
  data: TestDataInterface;
}

class TestParentClass extends ImmutableRecord<TestParentClassInterface>(
  { data: new TestClass() },
  (values) => {
    let { data } = values;

    if (!(data instanceof TestClass)) {
      data = new TestClass(data);
    }

    return { ...values, data };
  },
) {}

const value = new TestParentClass({
  data: { testNumber, testString },
});
// value.data instanceof TestClass === true

const value = new TestParentClass().with({
  data: { testNumber, testString },
});
// value.data instanceof TestClass === true
```
