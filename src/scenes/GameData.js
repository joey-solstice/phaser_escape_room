export const GameData = {
    GENERAL: {
        challengeCompletedText : "This challenge is Completted!"
    },
    ROOMS:  [
        {
            name: "Room 1: The Fractured Gateway", 
            description: "You find yourself in a digital rift where reality is glitching. You must stabilize the portal before they get permanently trapped in a fragmented dimension.",
            lives: 1,
            numberOfChallenges: 4,
            numberOfChallengesCompleted: 0,
            challenges: [
                {
                    room  : 1,
                    challenge: 1,
                    scene: "R1C1", // Room 1 Challenge 1
                    name:"Pattern Reassembly", description: "Fix a scrambled sequence of symbols to stabilize part of the portal.",
                    successTitle: "Symbols in harmony.",
                    successBody: (count, total) => `${count} of ${total} Challenges Completed`,
                    gameoverTitle: "Reassembly Failed.",
                    gameoverBody: "You're out of moves.",
                    movesName: "Moves",
                    moves: 20,
                    completed: false,
                },  
                {  
                    room  : 1, 
                    challenge: 2,
                    scene: "R1C2", // Room 1 Challenge 2
                    name:"Soundwave Decoder", description: "Listen to a distorted audio message and extract key clues.",
                    successTitle: "Soundwave Decoded Successfully",
                    successBody: (count, total) => `${count} of ${total} Challenges Completed`,
                    gameoverTitle: "Decoding Failed.",
                    gameoverBody: "You're out of tries",
                    movesName : "Tries",
                    moves: 3,
                    completed: false,
                },
                {  
                    room  : 1, 
                    challenge: 3,
                    scene: "R1C3", // Room 1 Challenge 3
                    name:"Color Frequency Puzzle", description: "Match shifting colors to synchronize the portal energy.",
                    successTitle: "Color Puzzle Solved",
                    successBody: (count, total) => `${count} of ${total} Challenges Completed`,
                    gameoverTitle: "Color Puzzle Failed.",
                    gameoverBody: "You're out of tries",
                    movesName : "Tries",
                    moves: 3,
                    completed: false,
                },
                {  
                    room  : 1, 
                    challenge: 4,
                    scene: "R1C4", // Room 1 Challenge 3
                    name:"Logic Bridge", description: "Solve a paradoxical riddle to unlock the next segment.",
                    successTitle: "Riddle Completed",
                    successBody: (count, total) => `${count} of ${total} Challenges Completed`,
                    gameoverTitle: "Riddle Failed.",
                    gameoverBody: "You're out of tries",
                    movesName : "Tries",
                    moves: 3,
                    completed: false,
                },
            ], 
        }
    ]  
}