
export function getDarkmode() {
    const darkmode = localStorage.getItem("darkmode");
    if (!darkmode || darkmode === "false") {
        return false;
    }
    else {
        return true;
    }
  
}

export function getDefaultFontsize() {
    return "16";
}
export function getFontsize() {
    const fs = localStorage.getItem("font-size");
    if (!fs || fs === null) {
        return getDefaultFontsize();
    }
    else {
        return fs;
    }
}
