export default async ({ output, input }) => {
    await output("Hiya, what's your name?")
    const name = await input()
    await output(`Nice to meet you, ${name}!`)
}
