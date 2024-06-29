import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopBar from "./TopBar";
import AccessibilitiesNavbar from "./AccessibilitiesNavbar";
import ToggleDarkmodeButton from "./ToggleDarkmodeButton";

describe('Accessibilities component', () => {
    test('render Darkmode toggle was clicked', () => {
        render(<TopBar />);
        const darkmode_btn = screen.getByTitle("Disable Darkmode");
        userEvent.click(darkmode_btn);

        const output = screen.getByText("Disable Darkmode");
        expect(output).toBeInTheDocument();
    });
});