export default async ({ output }) => {
    await output(`${process.env.VUE_APP_FIRST_NAME} can be reached at:`)
    await output(`${process.env.VUE_APP_FIRST_NAME.toLowerCase()}sapan@fastmail.com`, { delay: 0, speak: `${process.env.VUE_APP_FIRST_NAME} say pan at fast mail dot com` })
}
