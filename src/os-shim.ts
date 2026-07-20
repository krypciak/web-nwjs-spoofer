export const platform = () => 'linux'

export const arch = () => 'x64'

export const type = () => 'Linux'

export const release = () => '5.15.0'

export const hostname = () => 'linux-desktop'

export const homedir = () => '/home/user'

export const tmpdir = () => '/tmp'

export const endianness = () => 'LE'

export const EOL = '\n'

export const cpus = () => [
    {
        model: 'AMD Ryzen 7 5700G with Radeon Graphics',
        speed: 3212,
        times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0,
        },
    },
]

export const totalmem = () => 8 * 1024 * 1024 * 1024

export const freemem = () => 4 * 1024 * 1024 * 1024

export const uptime = () => 3600

export const userInfo = () => ({
    username: 'user',
    homedir: '/home/user',
    shell: '/bin/bash',
    uid: 1000,
    gid: 1000,
})
