import { describe, it, expect } from "vitest";
import { signupSchema, loginSchema } from "@/lib/validations/auth";

describe("Zod Validation Schemas", () => {
  describe("signupSchema", () => {
    it("validates successfully with correct data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password1!",
        confirmPassword: "Password1!",
      };
      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates successfully with optional phone number", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        password: "Password1!",
        confirmPassword: "Password1!",
      };
      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when email is invalid", () => {
      const invalidData = {
        name: "John Doe",
        email: "invalid-email",
        password: "Password1!",
        confirmPassword: "Password1!",
      };
      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email address");
      }
    });

    it("fails when password is too short", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Short1!",
        confirmPassword: "Short1!",
      };
      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must be at least 8 characters long"
        );
      }
    });

    it("fails when password lacks special character", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };
      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must contain at least one special character"
        );
      }
    });

    it("fails when passwords do not match", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password1!",
        confirmPassword: "Password2!",
      };
      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match");
      }
    });
  });

  describe("loginSchema", () => {
    it("validates successfully with correct data", () => {
      const validData = {
        email: "john@example.com",
        password: "Password1!",
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails when email is missing", () => {
      const invalidData = {
        password: "Password1!",
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("fails when password is empty", () => {
      const invalidData = {
        email: "john@example.com",
        password: "",
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
