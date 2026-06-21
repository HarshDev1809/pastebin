import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "@/app/(auth)/signup/page";
import * as actions from "@/app/(auth)/actions";
import { toast } from "sonner";

vi.mock("@/app/(auth)/actions", () => ({
  signupAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SignupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form correctly", () => {
    render(<SignupPage />);
    expect(screen.getByText("Sign Up", { selector: 'div.font-bold' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("shows validation errors for invalid data", async () => {
    render(<SignupPage />);

    // Submit empty form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 8 characters long")).toBeInTheDocument();
    });

    // Test password confirmation mismatch
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "DifferentPassword1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("submits the form successfully and redirects", async () => {
    (actions.signupAction as any).mockResolvedValue(undefined);

    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(actions.signupAction).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password1!",
        name: "John Doe",
        confirmPassword: "Password1!",
        phoneNumber: "",
      });
    });
  });
});
