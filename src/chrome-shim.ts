export function chromeShim() {
    window.chrome ??= {} as any
    window.chrome.runtime ??= {
        reload() {
            location.reload()
        },
    } as any
}
