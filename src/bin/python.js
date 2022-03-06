export default async ({ output, promptAnyKey }) => {
    await output('import antigravity')
    await promptAnyKey()
    window.open('https://xkcd.com/353/', '_blank')
}
