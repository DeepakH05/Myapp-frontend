import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";

// Mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

// Mock alert
global.alert = jest.fn();

describe("Home Component", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ 1. Loading state
  test("shows loading initially", () => {
    fetch.mockImplementation(() => new Promise(() => {})); // never resolve

    render(<Home user={{ valid: true }} />);

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  // ✅ 2. Products render
  test("renders products from API", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [
        { id: 1, name: "Product 1", price: 100, imageUrl: "img.jpg" }
      ]
    });

    render(<Home user={{ valid: true }} />);

    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  // ✅ 3. Invalid user → alert
  test("shows alert if user is invalid", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [
        { id: 1, name: "Product 1", price: 100 }
      ]
    });

    render(<Home user={{ valid: false }} />);

    const btn = await screen.findByText("Add To Cart");
    fireEvent.click(btn);

    expect(global.alert).toHaveBeenCalledWith("Only valid users can add to cart");
  });

  // ✅ 4. Valid user → add to cart + navigate
  test("adds to cart and navigates", async () => {
    fetch
      .mockResolvedValueOnce({
        json: async () => [
          { id: 1, name: "Product 1", price: 100 }
        ]
      })
      .mockResolvedValueOnce({
        ok: true
      });

    render(<Home user={{ valid: true }} />);

    const btn = await screen.findByText("Add To Cart");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/cart");
    });
  });

  // ✅ 5. API failure → alert
  test("shows alert on API failure", async () => {
    fetch
      .mockResolvedValueOnce({
        json: async () => [
          { id: 1, name: "Product 1", price: 100 }
        ]
      })
      .mockResolvedValueOnce({
        ok: false
      });

    render(<Home user={{ valid: true }} />);

    const btn = await screen.findByText("Add To Cart");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Error adding to cart");
    });
  });

});