
export default function setBodyColor({ color }: { color: string }) {
    document.documentElement.style.setProperty('--gradient-color', color);
}
