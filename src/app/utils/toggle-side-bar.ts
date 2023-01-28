export class ToggleSideBar {
    static toggleSideBar = false;
    static toggle() {
        ToggleSideBar.toggleSideBar = !ToggleSideBar.toggleSideBar;
    }

    getToggleSideBar() {
        return ToggleSideBar.toggleSideBar;
    }
}
