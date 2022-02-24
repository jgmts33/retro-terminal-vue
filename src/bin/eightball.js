import _ from 'lodash'

import { alphanumeric } from '@/util/text'

const answers = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
]

const knownAnswers = {
    whatistheanswertolifetheuniverseandeverything: '42',
    [`shouldihire${process.env.VUE_APP_FIRST_NAME.toLowerCase()}`]: 'Without a doubt.',
    shouldihireyou: 'Without a doubt.',
}

export default async ({ output, input }) => {
    await output('What is your question?')
    const question = alphanumeric((await input())).toLowerCase()
    if (knownAnswers[question]) {
        await output(knownAnswers[question])
    } else {
        await output(_.sample(answers))
    }
}
