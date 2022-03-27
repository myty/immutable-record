import { ImmutableRecord } from "../mod.ts";
import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.132.0/testing/asserts.ts";

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

Deno.test("ImmutableRecord", async (t) => {
  await t.step("sets default values", () => {
    // Arrange, Act
    const value = new TestClass();

    // Assert
    assertEquals(value.testNumber, defaultValues.testNumber);
    assertEquals(value.testString, defaultValues.testString);
    assert(value.optionalString === undefined);
  });

  await t.step("with", async (t) => {
    await t.step("returns a new object", () => {
      // Arrange
      const value = new TestClass();

      // Act
      const newValue = value.with({ testNumber: 2 });

      // Assert
      assertNotEquals(value, newValue);
    });

    await t.step("returns a new object with assigned values", () => {
      // Arrange
      const newValues = {
        testNumber: 2,
        testString: "test-updated",
      };

      // Act
      const value = new TestClass().with(newValues);

      // Assert
      assertEquals(value.testNumber, newValues.testNumber);
      assertEquals(value.testString, newValues.testString);
    });
  });

  await t.step("adding additional methods", async (t) => {
    await t.step("works", () => {
      // Arrange
      const newTestNumber = 2;

      // Act
      const newValue = new TestClass().withTestNumber(newTestNumber);

      // Assert
      assertEquals(newValue.testNumber, newTestNumber);
    });
  });

  await t.step("nesting", async (t) => {
    await t.step("works", () => {
      // Arrange
      const testNumber = 3;
      const testString = "newTestString";

      // Act
      const newValue = new TestClass()
        .withTestNumber(2)
        .with({ testNumber })
        .with({ testString });

      // Assert
      assertEquals(newValue.testNumber, testNumber);
      assertEquals(newValue.testString, testString);
    });
  });

  await t.step("defaultNestedClasses", async (t) => {
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

    await t.step("processes", () => {
      // Arrange
      const testNumber = 3;
      const testString = "test-string";

      // Act
      const newValue = new TestParentClass({
        data: { testNumber, testString },
      });

      // Assert
      assertEquals(newValue.data?.testNumber, testNumber);
      assertEquals(newValue.data?.testString, testString);
      assert(newValue.data instanceof TestClass);
    });

    await t.step("processes when with is called", () => {
      // Arrange
      const testNumber = 3;
      const testString = "test-string";

      // Act
      const newValue = new TestParentClass().with({
        data: { testNumber, testString },
      });

      // Assert
      assertEquals(newValue.data?.testNumber, testNumber);
      assertEquals(newValue.data?.testString, testString);
      assert(newValue.data instanceof TestClass);
    });
  });

  await t.step("processor", async (t) => {
    class TestClassWithProcessor extends ImmutableRecord(
      { data: defaultValues as TestDataInterface | undefined },
      (values) => {
        let { data } = values;

        if (!(data instanceof TestClass)) {
          data = new TestClass(data);
        }

        return { ...values, data };
      },
    ) {}

    await t.step("processes", () => {
      // Arrange
      const testNumber = 3;
      const testString = "test-string";

      // Act
      const newValue = new TestClassWithProcessor({
        data: { testNumber, testString },
      });

      // Assert
      assertEquals(newValue.data?.testNumber, testNumber);
      assertEquals(newValue.data?.testString, testString);
      assert(newValue.data instanceof TestClass);
    });

    await t.step("processes when with is called", () => {
      // Arrange
      const testNumber = 3;
      const testString = "test-string";

      // Act
      const newValue = new TestClassWithProcessor().with({
        data: { testNumber, testString },
      });

      // Assert
      assertEquals(newValue.data?.testNumber, testNumber);
      assertEquals(newValue.data?.testString, testString);
      assert(newValue.data instanceof TestClass);
    });
  });
});
