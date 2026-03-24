import { render, screen, fireEvent } from "@testing-library/react";
import PaymentSuccess from "./PaymentSuccess";
import { MemoryRouter } from "react-router-dom";

// mock navigate
const mockNavigate = jest.fn();

// mock location + navigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn()
}));

import { useLocation } from "react-router-dom";

describe("PaymentSuccess Component", () => {

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ✅ 1. No state case
  test("shows fallback message when no state", () => {
    useLocation.mockReturnValue({ state: null });

    render(
      <MemoryRouter>
        <PaymentSuccess />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No purchase found. Please go back to the store.")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Back to Store" })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  // ✅ 2. With state - renders items
  test("renders purchased items and total", () => {
    useLocation.mockReturnValue({
      state: {
        items: [
          {
            id: 1,
            name: "Product 1",
            price: 100,
            quantity: 2,
            image: "img.jpg"
          }
        ],
        total: 200
      }
    });

    render(
      <MemoryRouter>
        <PaymentSuccess />
      </MemoryRouter>
    );

    // heading
    expect(
      screen.getByText("Thank You for Your Purchase! 🎉")
    ).toBeInTheDocument();

    // product
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(
      screen.getByText("Price: 100 × Quantity: 2")
    ).toBeInTheDocument();

    // total
    expect(
      screen.getByText("Total Paid: $200.00")
    ).toBeInTheDocument();
  });

  // ✅ 3. Back button navigation
  test("navigates back to store", () => {
    useLocation.mockReturnValue({
      state: {
        items: [],
        total: 0
      }
    });

    render(
      <MemoryRouter>
        <PaymentSuccess />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Back to Store" })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

});