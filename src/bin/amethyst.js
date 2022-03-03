import _ from 'lodash'

const Room = {
    farm: 'Farm',

    pelicanTownTrail: 'Pelican Town Trail',
    pelicanTownNorthwest: 'Northwest Pelican Town',
    pelicanTownNortheast: 'Northeast Pelican Town',
    pelicanTownSouthwest: 'Southwest Pelican Town',
    pelicanTownSoutheast: 'Southeast Pelican Town',

    evergreenWoods: 'Evergreen Woods',
    beach: 'Beach',

    mountainTrail: 'Mountain Trail',
    mountainsWest: 'West Mountains',
    mountainsEast: 'East Mountains',
    adventurersGuild: "Adventurer's Guild",

    mines1: 'The Mines: Floor 1',
}

const aliases = {
    n: 'north',
    s: 'south',
    e: 'east',
    w: 'west',
}

const swords = {
    woodenBlade: {
        name: 'Wooden Blade',
        price: 250,
        level: 1,
    },

    silverSaber: {
        name: 'Wooden Blade',
        price: 750,
        level: 2,
    },

    cutlass: {
        name: 'Cutlass',
        price: 1500,
        level: 3,
    },

    claymore: {
        name: 'Claymore',
        price: 2000,
        level: 5,
    },
}

export const go = (room) => {
    // Warn about room name typos
    if (!room) console.warn('Invalid room reference')
    return { go: room }
}

const rooms = {
    [Room.farm]: {
        description: "You're on a sprawling farm surrounded by lush vegetation. A light breeze sweeps across your face.",
        actions: {
            north: go(Room.mountainTrail),
            south: go(Room.evergreenWoods),
            east: go(Room.pelicanTownTrail),
        },
    },

    [Room.pelicanTownTrail]: {
        description: "You find yourself on a wooded path. There's a clearing ahead and a broken down bus off to the side.",
        actions: {
            east: go(Room.pelicanTownNorthwest),
            west: go(Room.farm),
            bus: 'You attempt to enter the bus, but the door is jammed shut. You are able to catch a glimpse of some broken bottles inside, though.',
        },
    },

    [Room.pelicanTownNorthwest]: {
        description: 'TODO',
        actions: {
            // TODO: shops
            east: go(Room.pelicanTownNortheast),
            south: go(Room.pelicanTownSouthwest),
            west: go(Room.pelicanTownTrail),
        },
    },

    [Room.pelicanTownNortheast]: {
        description: 'TODO',
        actions: {
            // TODO: shops
            north: go(Room.mountainsWest),
            south: go(Room.pelicanTownSoutheast),
            west: go(Room.pelicanTownNorthwest),
        },
    },

    [Room.pelicanTownSouthwest]: {
        description: 'TODO',
        actions: {
            // TODO: shops
            north: go(Room.pelicanTownNorthwest),
            east: go(Room.pelicanTownSoutheast),
            west: go(Room.evergreenWoods),
        },
    },

    [Room.pelicanTownSoutheast]: {
        description: "This corner of town is always a bit quieter. You can see Mayor Lewis tending to his garden. There's some rustling coming from the graveyard.",
        actions: {
            north: go(Room.pelicanTownNortheast),
            south: go(Room.beach),
            west: go(Room.pelicanTownSouthwest),
            mayor: 'You wave to the mayor. He flashes you a warm smile and promptly returns to his petunias.',
            async graveyard(game) {
                if (game.abigailKnows === null) {
                    // Abigail is in the graveyard and asks the player what they're up to
                    await game.kernel.output('You walk into the graveyard and take a moment to appreciate how peaceful it looks during the day.\n\nYou observe Abigail hanging out in the corner, as usual. She notices you and jogs over to greet you. While crunching on an amethyst, she says:\n"Hey, fancy seeing you here! What\'re you up to today?"')
                    const choice = await game.promptChoice([
                        "I'm taking a stroll around town to see if there's anything interesting happening",
                        "I'm trying to get into the bus off of the wooded trail",
                        "I'm heading to the mines to find some gems",
                        "I'm going down to the beach to catch some fish",
                    ])

                    game.abigailKnows = (choice === 3)
                    await game.kernel.output('"Oh, how fun!" Abigail exclaims. "I have to run a few errands but maybe I\'ll run into you later."\n\nAs Abigail proceeds to leave you decide to follow her out. No sense in staying in an empty graveyard.')
                } else {
                    // Abigail is already gone
                    await game.kernel.output("The graveyard is still peaceful, though definitely quieter without the crunching. There's a squirrel rustling about.")
                }
            },
        },
    },

    [Room.evergreenWoods]: {
        description: 'You walk into a beautifully wooded forest that seems to stretch on forever.',
        actions: {
            north: go(Room.farm),
            east: go(Room.pelicanTownSouthwest),
        },
    },

    [Room.beach]: {
        description: 'You walk out over the boardwalk and take in the majestic view of the ocean. The salty air fills your lungs.',
        actions: {
            north: go(Room.pelicanTownSoutheast),
        },
    },

    [Room.mountainTrail]: {
        description: 'A winding path through the mountains lies ahead.',
        actions: {
            south: go(Room.farm),
            east: go(Room.mountainsWest),
        },
    },

    [Room.mountainsWest]: {
        description: 'TODO',
        actions: {
            north: go(Room.mines1),
            south: go(Room.pelicanTownNortheast),
            east: go(Room.mountainsEast),
            west: go(Room.mountainTrail),
        },
    },

    [Room.mountainsEast]: {
        description: "You walk past the mines and come across a small cabin tucked in the trees. The sign above the door says \"Adventurer's Guild\".",
        actions: {
            west: go(Room.mountainsWest),
            guild: go(Room.adventurersGuild),
        },
    },

    [Room.adventurersGuild]: {
        description: "You enter the guild and are greeted by a burly man wearing an eye patch.\n\n\"Hey, good afternoon.\" Marlon says. \"Let me know if you want to shop. I'm sure Gil over there wouldn't mind sharing some old stories with you either.\"",
        actions: {
            async shop(game) {
                await game.kernel.output("\"If you're looking for a sword, you've come to the right place!\" Marlon boasts. \"What're ya buyin?\"")
                const sword = await game.openShop(swords, game.swords)
                if (sword === false) {
                    await game.kernel.output('"Not interested in anything, huh? That\'s alright, come back if you change your mind."')
                } else if (sword === null) {
                    await game.kernel.output('"Feel free to come back if there\'s something else you want to buy instead."')
                } else {
                    await game.kernel.output('"Great choice! Best of luck to you out there."')
                }
            },
            gil: "You approach Gil, he's enjoying his rocking chair by the fireplace. He stares at you for a moment, seemingly taking you in. Finally, he says:\n\"I used to be an adventurer like you, then I took an arrow in the knee.\"",
            leave: go(Room.mountainsEast),
        },
    },

    [Room.mines1]: {
        description: 'TODO',
        actions: {

        },
    },
}

const INSTANT = { delay: 0, speed: 0, speak: false }

class AmethystGame {
    constructor(kernel) {
        this.kernel = kernel

        // Inventory
        this.gold = 2000
        this.swords = []

        // Story
        this.abigailKnows = null
    }

    async runRoom(roomId) {
        // Get the room state if it is dynamic
        let room = rooms[roomId]
        if (typeof room === 'function') room = await room(this)

        // Present the room and its available actions
        await this.kernel.output(`[${roomId}]`, INSTANT)
        await this.kernel.output(room.description)
        await this.kernel.output(`Available actions: ${Object.keys(room.actions).join(', ')}`, INSTANT)

        // Prompt for an action
        while (true) { // eslint-disable-line no-constant-condition
            const actionName = (await this.kernel.input()).toLowerCase()
            const action = room.actions[aliases[actionName] || actionName]

            // Run the action
            if (!action) {
                await this.kernel.output("You can't do that here.")
            } else if (action.go) {
                await this.runRoom(action.go)
                break
            } else if (typeof action === 'function') {
                await action(this)
            } else if (typeof action === 'string') {
                // Annouce the result of the action but prompt for another one
                await this.kernel.output(action)
            }
        }
    }

    async promptChoice(choices) {
        const choicesStr = _.map(choices, (c, idx) => `${idx + 1}) ${c}`).join('\n')
        await this.kernel.output(`\n${choicesStr}`, INSTANT)
        let response = null
        while (!response) {
            response = parseInt(await this.kernel.input())
            if (Number.isNaN(response) || response < 1 || response > choices.length) {
                await this.kernel.output(`Please enter a number between 1 and ${choices.length}.`)
                response = null
            }
        }
        return response
    }

    async openShop(stock, pocket) {
        // Let the player know how much gold they have and ask what they want to buy
        const stockList = _.toArray(stock)
        await this.kernel.output(`\n[You have ${this.gold} gold.]`, INSTANT)
        const choice = await this.promptChoice([
            ..._.map(stockList, (s) => `${s.name} (${s.price} gold)`),
            'Nevermind',
        ])
        const item = stockList[choice - 1]
        if (!item) return false

        // Check that they can buy this item
        if (this.gold < item.price) {
            await this.kernel.output("You can't afford that.")
            return null
        }

        // Complete the purchase
        this.gold -= item.price
        pocket.push(item)
        return item
    }
}

export default async (kernel) => {
    const game = new AmethystGame(kernel)
    await game.runRoom(Room.farm)
}
