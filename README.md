# SRL race command for PhantomBot #
Custom script adding a race command to **[PhantomBot](https://github.com/PhantomBot/PhantomBot)**, using the **[speedrunslive](http://api.speedrunslive.com/)** api.

## Requirements ##
- [PhantomBot](https://phantombot.tv/)

## Installation ##

- Copy the script folder into the root PhantomBot folder

## Usage ##
The script will add a !race command and will look for races you're currently in using  the speedrunslive api and will return the game's name, race title, race state and the link to the race in the chat. 

### Set your account ###
By default, the script will look for races using Twitch channel's name. If for some reason you need the script to look for a different username, you can set it up in the file *scripts/lang/english/commands/commands-speedrunsliveCommand.js* :

    /*
     * Your speedrunslive account, case sensitive!
     * Empty by default. Doing so, the command will search for races according to your Twitch channel's name instead
     *
     * $.lang.register('speedrunslive.account', '');
     */
    
    $.lang.register('speedrunslive.account', '');

### While racing on speedrunslive ###

    User: !race
    Bot: Dark Souls | All Bosses (Entry Open) at http://www.speedrunslive.com/races/result/#!/201941

### While not racing on speedrunslive ###

    User: !race
    Bot: CapitaineToinon is currently not racing on speedrunslive.

## Contact me ##
- [Twitter](https://twitter.com/CapitaineToinon)
- Discord at **CapitaineToinon#6028**