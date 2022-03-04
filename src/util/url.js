import binaries from '@/bin'

export const binaryFromUrl = () => {
    const name = window.location.pathname.substring(1)
    return binaries[name]
}
