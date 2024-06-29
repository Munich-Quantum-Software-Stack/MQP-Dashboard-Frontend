import { render, screen } from "@testing-library/react";
import Status from "./Status";

// Test Suit
describe('Status Page', () => {
    test("render Status component", () => {
        // Arrange
        render(<Status />);

        // Act
        // ....

        // Assert
        const welcomeText = screen.getByText(
            "Welcome to Bavarian Quantum Portal",
            { exact: false }
        );
        expect(welcomeText).toBeInTheDocument();
    });
});
