import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { MemoryRouter } from "react-router-dom";

// mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

// mock fetch
global.fetch = jest.fn();

describe("Login Component", () => {

  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  // ✅ 1. Default login render
  test("renders login by default", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "Login" })
    ).toBeInTheDocument();
  });

  // ✅ 2. Switch to register
  test("switches to register mode", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("New User"));

    expect(
      screen.getByRole("heading", { name: "Register" })
    ).toBeInTheDocument();
  });

  // ✅ 3. Input typing
  test("updates input fields", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" }
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "1234" }
    });

    expect(screen.getByPlaceholderText("Username").value).toBe("testuser");
    expect(screen.getByPlaceholderText("Password").value).toBe("1234");
  });

  // ✅ 4. Register success
  test("registers user successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("New User"));

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "newuser" }
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "1234" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "User Registered Successfully ✅"
      );
    });
  });

  // ✅ 5. Register failure
  test("shows error on register failure", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("New User"));

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "user" }
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "1234" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText("Registration failed!")
      ).toBeInTheDocument();
    });
  });

  // ✅ 6. Login success
  test("logs in and navigates", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        username: "testuser",
        role: "USER"
      })
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" }
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "1234" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(localStorage.getItem("username")).toBe("testuser");
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  // ✅ 7. Login failure
  test("shows error on login failure", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" }
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(
        screen.getByText("Login failed!")
      ).toBeInTheDocument();
    });
  });

});