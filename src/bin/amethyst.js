import _ from 'lodash'
import sleep from 'sleep-promise'

import store from '@/store'

const Room = {
    farm: 'Farm',

    pelicanTownTrail: 'Pelican Town Trail',
    pelicanTownNorthwest: 'Northwest Pelican Town',
    pelicanTownNortheast: 'Northeast Pelican Town',
    pelicanTownSouthwest: 'Southwest Pelican Town',
    pelicanTownSoutheast: 'Southeast Pelican Town',

    saloon: 'The Stardrop Saloon',
    evergreenWoods: 'Evergreen Woods',
    beach: 'Beach',

    mountainTrail: 'Mountain Trail',
    mountainsWest: 'West Mountains',
    mountainsEast: 'East Mountains',
    adventurersGuild: "Adventurer's Guild",

    minesEntrance: 'The Mines',
    mines1: 'The Mines: Floor 1',
    mines1Explore: 'The Mines: Explore Floor 1',
    mines2: 'The Mines: Floor 2',
}

const aliases = {
    n: 'north',
    s: 'south',
    e: 'east',
    w: 'west',
    d: 'down',
    u: 'up',
}

const foods = {
    beer: {
        name: 'Beer',
        price: 400,
    },

    salad: {
        name: 'Salad',
        price: 220,
    },

    pizza: {
        name: 'Pizza',
        price: 600,
    },
}

const swords = {
    woodenBlade: {
        name: 'Wooden Blade',
        price: 250,
        damage: 5,
    },

    silverSaber: {
        name: 'Silver Saber',
        price: 750,
        damage: 10,
    },

    cutlass: {
        name: 'Cutlass',
        price: 1500,
        damage: 15,
    },

    claymore: {
        name: 'Claymore',
        price: 2000,
        damage: 17,
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
            north: go(Room.pelicanTownNorthwest),
            east: go(Room.pelicanTownSoutheast),
            west: go(Room.evergreenWoods),
            saloon: go(Room.saloon),
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
                    await game.kernel.output('"Oh, how fun!" Abigail shouts with excitement. "I have to run a few errands but maybe I\'ll run into you later."\n\nAs Abigail proceeds to leave you decide to follow her out. No sense in staying in an empty graveyard.')
                } else {
                    // Abigail is already gone
                    await game.kernel.output("The graveyard is still peaceful, though definitely quieter without the crunching. There's a squirrel rustling about.")
                }
            },
        },
    },

    [Room.saloon]: (game) => {
        const gusMessage = game.metGus ? '"Welcome back!" Gus exclaims.' : "\"Well hello there!\" the bartender exclaims. \"I'm Gus, the chef and owner of the Stardrop Saloon. Stop in if you need any refreshments. I've always got hot food and cold beer at the ready.\""
        game.metGus = true
        return {
            description: `The sounds of raucous laughter and clanging glasses fill your ears the moment you open the saloon door. It's a very lively place, and everybody seems to be having a great time.\n\n${gusMessage}`,
            actions: {
                async order() {
                    await game.kernel.output("\"Let me know what you're in the mood for.\"")
                    const food = await game.shop(foods, game.food)
                    if (food === false) {
                        await game.kernel.output('"Nothing looked appetizing? Come back if you change your mind!"')
                    } else if (food === null) {
                        await game.kernel.output("\"I'd love to give you that but I need to keep the lights on. Feel free to come back if there's something else you want to buy.\"")
                    } else if (food === foods.beer) {
                        game.food.pop()
                        game.beersConsumed += 1
                        await game.kernel.output("Gus hands you an ice cold pint. It's a craft New England IPA, and it's delicious.")
                        if (game.beersConsumed === 3) {
                            await sleep(1000)
                            store.commit('toggleGlitching')
                            await game.kernel.output("Of course, you're hardly tasting the beer at this point.", { delay: 0 })
                        }
                    } else {
                        await game.kernel.output(`"Enjoy!" Gus declares eagerly.\n\nYou're not super hungry so you put the ${food.name} in your pocket for later.`)
                    }
                },
                jukebox: "The jukebox is playing some classic saloon music. It has a great vibe and is certainly contributing to everyone's mood - you wouldn't want to change that.",
                leave: go(Room.pelicanTownSouthwest),
            },
        }
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
        description: "You come to a mountainous clearing featuring a crystal clear lake. The tranquility of nature surrounds you. There appears to be a mine entrance to the North, and there's trails in every direction.",
        actions: {
            north: go(Room.minesEntrance),
            south: go(Room.pelicanTownNortheast),
            east: go(Room.mountainsEast),
            west: go(Room.mountainTrail),
        },
    },

    [Room.mountainsEast]: (game, lastRoom) => ({
        description: lastRoom === Room.mountainsWest ? "You walk past the mines and come across a small cabin tucked in the trees. The sign above the door says \"Adventurer's Guild\"." : 'You head out of the guild.',
        actions: {
            west: go(Room.mountainsWest),
            guild: go(Room.adventurersGuild),
        },
    }),

    [Room.adventurersGuild]: {
        description: "You enter the guild and are greeted by a burly man wearing an eye patch.\n\n\"Hey, good afternoon.\" Marlon says. \"Let me know if you want to shop. I'm sure Gil over there wouldn't mind sharing some old stories with you either.\"",
        actions: {
            async shop(game) {
                await game.kernel.output("\"If you're looking for a sword, you've come to the right place!\" Marlon boasts. \"What're ya buyin?\"")
                const sword = await game.shop(swords, game.swords)
                if (sword === false) {
                    await game.kernel.output('"Not interested in anything, huh? That\'s alright, come back if you change your mind."')
                } else if (sword === null) {
                    await game.kernel.output('"Feel free to come back if there\'s something else you want to buy instead."')
                } else {
                    // Set the player's sword to the strongest one they own
                    game.sword = _.maxBy(game.swords, 'damage')
                    await game.kernel.output('"Great choice! Best of luck to you out there."')
                }
            },
            gil: "You approach Gil, he's enjoying his rocking chair by the fireplace. He stares at you for a moment, seemingly taking you in. Finally, he says:\n\"I used to be an adventurer like you, then I took an arrow in the knee.\"",
            leave: go(Room.mountainsEast),
        },
    },

    [Room.minesEntrance]: {
        description: "You walk through the cavernous mine entrance. A torch is casting a soft glow on the walls. It's a fairly small space, but you see a ladder that you can climb down.",
        actions: {
            south: go(Room.mountainsWest),
            down: go(Room.mines1),
        },
    },

    [Room.mines1]: {
        description: "You carefully step down the ladder. It's surprisingly illuminated down here, especially compared to the floor above.\n\nNothing valuable immediately pops out at you.",
        actions: {
            explore: go(Room.mines1Explore),
            up: go(Room.minesEntrance),
        },
    },

    [Room.mines1Explore]: {
        description: 'Which part of the floor do you want to focus on exploring?',
        actions: {
            left: "There's some coal, but not much else.",
            center: 'Nothing but rocks!',
            async right(game) {
                await game.kernel.output("As you're exploring the right side of the floor, a Green Slime jumps out from behind one of the rocks! It has you cornered - your only chance is to fight it.\n\n")
                if (!game.sword) {
                    await game.kernel.output("You reach for your sword, but you don't have one on you! The Slime attacks you until you pass out.")
                    return { win: false }
                }

                await game.kernel.output(`You lock eyes with the Slime, ready your ${game.sword.name}, and prepare for battle.`)
                if (await game.battle('Green Slime', 24, 5)) {
                    // The player won
                    await game.kernel.output('The slime fades away as you wipe the sweat from your face. After patting yourself on the back, you pick up some copper ore that you noticed during the battle. You head down a ladder that was hiding around the corner.')
                    await game.runRoom(Room.mines2)
                } else {
                    return { win: false }
                }
            },
            cancel: go(Room.mines1),
        },
    },

    [Room.mines2]: {
        description: 'TODO',
        actions: {
        },
    },

        },
    },
}

const INSTANT = { delay: 0, speed: 0, speak: false }

const PLAYER_HP = 50

class AmethystGame {
    constructor(kernel) {
        this.kernel = kernel

        // Inventory
        this.gold = 2000
        this.food = []
        this.swords = []
        this.sword = null

        // Story
        this.abigailKnows = null
        this.beersConsumed = 0
        this.metGus = false
    }

    async runRoom(roomId, lastRoomId) {
        // Get the room state if it is dynamic
        let room = rooms[roomId]
        if (typeof room === 'function') room = await room(this, lastRoomId)

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
                await this.runRoom(action.go, roomId)
                break
            } else if (typeof action === 'function') {
                const result = await action(this)

                // Check if the result of the action caused the game to end
                if (result?.win !== undefined) {
                    await this.gameOver(result.win)
                    return
                }
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

    async shop(stock, pocket) {
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

    async battle(name, slimeHp, slimeDamage) {
        // Set up the battle
        let playerHp = PLAYER_HP
        await this.kernel.output(`\n\n=== BATTLE ===\n${name} (${slimeHp} HP)\n[You have ${playerHp} HP.]`, INSTANT)

        // Battle until someone runs out of health
        while (slimeHp > 0 && playerHp > 0) {
            // The player goes first
            const choice = await this.promptChoice([
                `Regular attack (${this.sword.damage} damage, 100% accuracy)`,
                `Critical attack (${this.sword.damage * 2} damage, 50% accuracy)`,
                ..._.map(this.food, (f) => `Eat ${f.name} (fully heal)`),
            ])

            if (choice <= 2) {
                // The player is attacking
                const damage = this.sword.damage * choice
                const hit = (_.random(1, choice) === 1)
                if (hit) {
                    slimeHp = Math.max(slimeHp - damage, 0)
                    await this.kernel.output(`The ${name} takes ${damage} damage. (${slimeHp} HP left)`)
                    if (slimeHp === 0) return true
                } else {
                    await this.kernel.output(`The ${name} evades your attack.`)
                }
            } else {
                // The player is eating
                const food = this.food.splice(choice - 3, 1)[0]
                playerHp = PLAYER_HP
                await this.kernel.output(`You eat the delicious ${food.name} and feel instantly rejuvenated!`)
            }

            // Have the Slime attack
            playerHp = Math.max(playerHp - slimeDamage, 0)
            await this.kernel.output(`The ${name} attacks you for ${slimeDamage} damage. (${playerHp} HP left)`)
            if (playerHp === 0) return false
        }
    }

    async gameOver(win) {
        if (!win) {
            await this.kernel.output('\n\n--- GAME OVER ---\n\n\n', {
                speechOptions: {
                    rate: 0.7,
                    pitch: 0.7,
                },
            })
        } else {
            await this.kernel.output('\n\n*** !!! YOU WIN !!! ***\n\n\n', {
                speechOptions: {
                    rate: 0.7,
                    pitch: 0.7,
                },
            })
        }
    }
}

export default async (kernel) => {
    const game = new AmethystGame(kernel)
    await game.runRoom(Room.farm)
}
