export const CST = {
    SCENES: {
        PRELOAD: "PRELOAD",
        LOAD: "LOAD",
        HOME: "HOME",
        BACKSTORY: "BACKSTORY", 
        HOWTO: "HOWTO", 
        GAME: "GAME",
        ERROR: "ERROR",
        GameUI: "GameUI",
        FOUND: "FOUND",
        COMPLETE: "COMPLETE",
        FAIL : "FAIL", 
        LEVELTIMER : "LEVELTIMER",
        CONGRATS:"CONGRATS",
        PRIZE: "PRIZE",
        THANKYOU: "THANKYOU", 
        LEADERBOARD: "LEADERBOARD", 
        SHARE: "SHARE", 
        COMINGSOON: "COMINGSOON"
    },
    SERVER: {
        POST : "https://sandboxj.solstice.sg/nissin/database/nissin.php?",
        LOCALPOST : "http://localhost/solstice/nissin/database/nissin.php"   
    },
    SCALE:
    {
        width: 1080,
        height: 1920 
    },
    ERRORCODES:{ 
        SPIN:{
            422 : 'Invalid Input',  
            461 : 'You have already Played', 
            471 : 'Campaign not found', 
            491 : 'The code is Invalid',
            500 : 'Server Error'
        },
        EMAIL:{
            422 : 'The email field must be a valid email address.',  
            500 : 'Server Error'
        }
    },
    API:{
        SPIN: {url:"https://msigspin.solstice.sg/api/spin", method: 'POST',  headers:{'Content-Type': 'application/json'}},
        CHECKEMAIL: {url:"https://msigspin.solstice.sg/api/check-email", method: 'GET'} ,
    }
}
 
