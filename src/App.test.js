import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock components
jest.mock("./Login", () => () => <div>Login Page</div>);
jest.mock("./Home", () => () => <div>Home Page</div>);
jest.mock("./Cart", () => () => <div>Cart Page</div>);
jest.mock("./PaymentSuccess", () => () => <div>Payment Success Page</div>);

describe("App Routing", () => {

  test("renders Login page", () => {
    render(<App />);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

});