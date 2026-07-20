import path from 'path-browserify'
export { path }

import * as os from './os-shim'

// @ts-expect-error
import util from '@jspm/core/nodelibs/util'

// @ts-expect-error
import assert from '@jspm/core/nodelibs/assert'
assert.default = assert

// @ts-expect-error
import events from '@jspm/core/nodelibs/events'

interface Config {
    fs: typeof import('fs')

    enableGreenworks?: boolean

    enableNw?: boolean
    exit?: () => void
}

export function nodeNwjsShims(config: Config) {
    window.global = window
    window.__filename = 'file.js'
    window.__dirname = '/'

    requireFix(config)
    if (config.enableNw) nwShim(config)

    processShim()
    chromeShim()
}

function chromeShim() {
    window.chrome ??= {} as any
    window.chrome.runtime = {
        reload() {
            location.reload()
        },
    } as any
}

function processShim() {
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
    } as any
}

function nwShim({ exit }: Config) {
    const nwGui = {
        App: {
            dataPath: '/nwjsData',
            argv: [],
        } satisfies Partial<nw.App> as unknown as nw.App,
        Window: {
            get(): NWJS_Helpers.win {
                return {
                    isFullscreen: false,
                    enterFullscreen() {
                        document.body.requestFullscreen()
                    },
                    leaveFullscreen() {
                        document.exitFullscreen()
                    },
                    close() {
                        exit?.()
                    },
                } as NWJS_Helpers.win
            },
            async open(url: string, _option: NWJS_Helpers.WindowOpenOption) {
                if (url.startsWith('data:image/png;base64,')) {
                    /* workaround because of https://blog.mozilla.org/security/2017/11/27/blocking-top-level-navigations-data-urls-firefox-59/ */
                    const blob = await (await fetch(url)).blob()
                    const fileURL = URL.createObjectURL(blob)
                    window.open(fileURL, '_blank')
                } else {
                    window.open(url, '_blank')
                }
            },
        } satisfies Partial<nw.Window> as unknown as nw.Window,
        Clipboard: {
            get() {
                return {
                    async set(_content: string, _type: string, _raw: boolean) {},
                    get(_type, _raw) {
                        return 'not supported'
                    },
                } satisfies Partial<NWJS_Helpers.clip> as unknown as NWJS_Helpers.clip
            },
        } satisfies Partial<nw.Clipboard> as unknown as nw.Clipboard,
        Shell: {
            openExternal(url) {
                window.open(url, '_blank')?.focus()
            },
        } satisfies Partial<nw.Shell> as unknown as nw.Shell,
    } as const satisfies Partial<typeof nw>
    window.nw = nwGui as unknown as typeof nw
}

function requireFix({ fs, enableGreenworks }: Config) {
    const crypto = {}
    const stream = {}
    const http = {}
    const https = {}

    const module = {
        createRequire: () => window.require,
    }

    const greenworks = {
        init() {},
        activateAchievement() {
            // console.log('activateAchievement', ...args)
        },
        clearAchievement() {
            // console.log('clearAchievement', ...args)
        },
    }

    const requireMap: Record<string, any> = {
        fs: fs,
        path: path,
        http: http,
        https: https,
        crypto: crypto,
        stream: stream,
        util: util,
        events: events,
        assert: assert,
        module: module,
        os: os,
    }

    // @ts-expect-error
    window.require = (src: string) => {
        const fromMap = requireMap[src]
        if (fromMap) return fromMap

        if (enableGreenworks && src.includes('greenworks')) return greenworks
        if (src == 'nw.gui') return window.nw

        console.groupCollapsed(`requireFix: unknown module: ${src}`)
        console.trace()
        console.groupEnd()
    }
}
