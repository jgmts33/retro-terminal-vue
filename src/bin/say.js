export default async ({ output }, args) => {
    await output(args.join(' '))
}
