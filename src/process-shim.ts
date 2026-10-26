export function processShim() {
    window.process = {
        on(name: string, _func: () => void) {
            if (name == 'on') {
            } else if (name == 'exit') {
            } else {
                console.warn('Unsupported process.on:', name)
            }
        },
        off(name: string, _func: () => void) {
            if (name == 'on') {
            } else if (name == 'exit') {
            } else {
                console.warn('Unsupported process.on:', name)
            }
        },
        execPath: 'client',
        versions: {
            nw: '100.0.0',
            'node-webkit': '100.0.0',
        },
        env: {},
        cwd() {
            return '/'
        },
        _events: {},
        nextTick(callback: Function, ...args: any[]) {
            queueMicrotask(() => callback(...args))
        },
        argv: ['/usr/bin/node'],
    } as any
}
