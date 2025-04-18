import { expect, test, describe } from "bun:test";
import { ResultHelper, MyError } from "../../src/core/result";

describe("ResultHelper", () => {
  test("success() should create a successful result", () => {
    const data = { name: "test" };
    const result = ResultHelper.success(data);
    
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual(data);
  });

  test("failure() should create a failed result with string error", () => {
    const errorMessage = "Something went wrong";
    const result = ResultHelper.failure<string>(errorMessage);
    
    expect(result.success).toBe(false);

    if (result.success) return;
    expect(result.error).toBeInstanceOf(MyError);
    expect(result.error.message).toBe(errorMessage);
  });

  test("failure() should create a failed result with Error object", () => {
    const error = new Error("Error object");
    const result = ResultHelper.failure<string>(error);
    
    expect(result.success).toBe(false);

    if (result.success) return;
    expect(result.error).toBeInstanceOf(MyError);
    expect(result.error.message).toBe("Error object");
  });
});

describe("MyError", () => {
  test("toString() should return formatted message with errors", () => {
    const error = MyError.fromUnknown("Base error");
    error.errors = { field1: "Error 1", field2: "Error 2" };
    
    const errorString = error.toString();
    expect(errorString).toContain("Base error");
    expect(errorString).toContain("field1: Error 1");
    expect(errorString).toContain("field2: Error 2");
  });

  test("fromUnknown() should handle various error types", () => {
    const stringError = MyError.fromUnknown("String error");
    expect(stringError.message).toBe("String error");
    
    const errorObj = MyError.fromUnknown(new Error("Error object"));
    expect(errorObj.message).toBe("Error object");
    
    const unknownError = MyError.fromUnknown({});
    expect(unknownError.message).toBe("Unknown error occurred");
  });
});