import _ from 'lodash'

const rateGuess = (guess, word) => {
    const lettersUsed = _.map(word, () => false)
    const rating = []

    // Check for letters in the right position first
    _.each(guess, (g, idx) => {
        if (g === word[idx]) {
            lettersUsed[idx] = true
            rating[idx] = '*'
        }
    })

    // Check for letters in the wrong position, as well as misses
    _.each(guess, (g, idx) => {
        if (g === word[idx]) return
        const remaining = _.map(lettersUsed, (used, i) => (used ? '' : word[i]))
        const actualIdx = remaining.indexOf(g)
        if (actualIdx !== -1) {
            lettersUsed[actualIdx] = true
            rating[idx] = actualIdx > idx ? '>' : '<'
        } else {
            rating[idx] = '_'
        }
    })

    return rating.join('')
}

export const intro = async (output) => {
    await output('Retrodle: Guess the five-letter word in six tries', { speak: 'Retro-dull: Guess the five-letter word in six tries' })
    await output('\n* = match\n< = letter exists somewhere to the left\n> = letter exists somewhere to the right\n_ = letter not in word\n\n', { speak: false, speed: 8 })
}

export const loadWord = async () => {
    // Choose a random 5 letter word from a gist of 1000 common words
    const response = await fetch('https://gist.githubusercontent.com/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt')
    const words = _.filter((await response.text()).split('\n'), (w) => w.length === 5)
    return _.sample(words)
}

export default async ({ output, input }) => {
    // Introduce the game and load a random word from GitHub
    const results = await Promise.all([
        intro(output),
        loadWord(),
    ])
    const word = results[1]
    await output('Enter your starting guess:', { delay: 0 })

    // Have the user take up to six guesses
    for (let i = 0; i < 6; i++) {
        let guess = ''
        while (guess.length !== 5) {
            guess = (await input()).toLowerCase()
            if (guess.length !== 5) await output('Please enter a five-letter guess.')
        }

        await output(`  ${rateGuess(guess, word)}`, { speak: false })
        if (guess === word) {
            await output(`Congratulations, you got it in ${i + 1} / 6 tries!`, { delay: 0, speak: `Congratulations, you got it in ${i + 1} out of 6 tries!` })
            return
        }
    }

    // They didn't guess it
    await output(`So sorry, the word was: ${word}`, { delay: 0 })
}
