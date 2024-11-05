# Introduction

Built on `immer`, immutable recorda are class factories for immutable types.

## Deno

```sh
deno add jsr:@myty/immutable-record
```

## Node

```sh
npm install @myty/immutable-record
```

## Usage

```typescript
import { ImmutableConstructor, ImmutableRecord, ImmutableWith } from "@myty/immutable-record";

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
