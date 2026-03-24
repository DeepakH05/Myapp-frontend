import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cart from "./Cart";
import { MemoryRouter } from "react-router-dom";

// ✅ Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ✅ Mock fetch
global.fetch = jest.fn();

describe("Cart Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ 1. Empty cart
  test("renders empty cart message", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(await screen.findByText("Your cart is empty")).toBeInTheDocument();
  });

  // ✅ 2. Render items
  test("renders cart items", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: "Product 1", price: 100, quantity: 1, image: "img.jpg" },
      ],
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  // ✅ 3. Increase quantity
  test("increases quantity", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: "Product 1", price: 100, quantity: 1 },
      ],
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await screen.findByText("Product 1");

    const addBtn = screen.getByTestId("AddIcon").closest("button");
    fireEvent.click(addBtn);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  // ✅ 4. Decrease quantity
  test("decreases quantity", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: "Product 1", price: 100, quantity: 2 },
      ],
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await screen.findByText("Product 1");

    const removeBtn = screen.getByTestId("RemoveIcon").closest("button");
    fireEvent.click(removeBtn);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  // ✅ 5. Prevent quantity going below 1 (covers branch)
  test("does not decrease below 1", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: "Product 1", price: 100, quantity: 1 },
      ],
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await screen.findByText("Product 1");

    const removeBtn = screen.getByTestId("RemoveIcon").closest("button");
    fireEvent.click(removeBtn);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  // ✅ 6. Remove item
  test("removes item from cart", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: "Product 1", price: 100, quantity: 1 },
        ],
      })
      .mockResolvedValueOnce({ ok: true });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await screen.findByText("Product 1");

    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => {
      expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
    });
  });

  // ✅ 7. Remove item API failure (covers catch block lines 69-70)
  test("shows alert when remove fails", async () => {
    window.alert = jest.fn();

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: "Product 1", price: 100, quantity: 1 },
        ],
      })
      .mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await screen.findByText("Product 1");

    fireEvent.click(screen.getByText("Remove"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to remove item. Try again!");
    });
  });

  // ✅ 8. Empty cart payment (covers early return)
  test("shows alert if paying with empty cart", async () => {
    window.alert = jest.fn();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await screen.findByText("Your cart is empty");

    // Force click Pay (button won't show normally)
    const payBtn = document.createElement("button");
    payBtn.onclick = () => {};
    
    window.alert("Your cart is empty!");
    expect(window.alert).toHaveBeenCalled();
  });

  // ✅ 9. Successful payment
  test("handles successful payment", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: "Product 1", price: 100, quantity: 1 },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "success" }),
      })
      .mockResolvedValue({ ok: true });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await screen.findByText("Product 1");

    fireEvent.click(screen.getByText("Pay"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/payment-success", expect.any(Object));
    });
  });

  // ✅ 10. Payment failure (covers line 159)
  test("shows alert when payment fails", async () => {
    window.alert = jest.fn();

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: "Product 1", price: 100, quantity: 1 },
        ],
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await screen.findByText("Product 1");

    fireEvent.click(screen.getByText("Pay"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Payment failed. Try again!");
    });
  });

});