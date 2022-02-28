import ElizaBot from 'elizabot'

export default async ({ output, input }) => {
    const bot = new ElizaBot()
    await output(bot.getInitial())
    while (!bot.quit) {
        const reply = bot.transform(await input())
        await output(reply)
    }
}
