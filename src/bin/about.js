import { FIRST_NAME } from '@/config'

export default async ({ output }) => {
    await output(`Hi there, I'm ${FIRST_NAME}, a product-minded software engineer with over ${new Date().getFullYear() - 2009} years of professional software development experience.\n\n`)
    await output('I have an extensive background in tech lead and architect roles, with various clients spanning healthcare, fintech, ecommerce and more.\n\n')
    await output("I take pride in building products that delight users and exceed my clients' expectations.\n\n")
    await output("When I'm not coding you can probably find me golfing with my wife, or having a game night.\n\n")
    await output('Type "resume" for a sample of my work experience, or "contact" to get in touch.\n\n', { speak: 'Type resume for a sample of my work experience, or "contact" to get in touch.' })
    await output('I look forward to working with you!')
}
