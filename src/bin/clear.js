export default async (kernel) => {
    kernel.history = []
    await kernel.output('', { delay: 0 })
}
