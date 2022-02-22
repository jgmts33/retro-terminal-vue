export default async ({ output }) => {
    await output('Echo! Echo! Echo!')
    window.open('https://www.youtube.com/watch?v=CahNAauFgys', '_blank')
}
