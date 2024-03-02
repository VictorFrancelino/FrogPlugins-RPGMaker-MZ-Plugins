//=============================================================================
// FrogMessageWindow.js
//=============================================================================

/*:
    * @target MZ
    * @plugindesc Displays a message in a customized window with typing effects. This command allows you to create personalized windows with control over width, height, typing speed, and display time.
    * @author Victor Francelino
    * @version 0.0.1
    * 
    * @command Show message
    * @text Show message
    * @desc Displays a message in a customized window with typing effects. This command allows you to create personalized windows with control over width, height, typing speed, and display time.
    * 
    * @arg message
    * @type multiline_string
    * @desc Message to be displayed in the created window.
    * 
    * @arg velocity
    * @type number
    * @desc Speed at which words will be typed (Higher values result in slower speed).
    * 
    * @arg width
    * @desc Width of the window.
    * @type number
    * @default 600
    * 
    * @arg height
    * @desc Height of the window.
    * @type number
    * @default 200
    * 
    * @arg position
    * @desc Position of the window (top, center, bottom).
    * @type select
    * @option Top
    * @option Center
    * @option Bottom
    * @default Center
    * 
    * @arg displayTimeWindow.
    * @desc The amount of time the window will be displayed.
    * @type number
    * @default 20
    * 
    * @help
    * ============================================================================
    * 🐸 Quick Guide to Using the FrogMessageWindow Plugin 🐸
    * ============================================================================
    *
    * Introduction:
    * The FrogMessageWindow plugin was developed to provide an easy and customizable method for displaying messages within windows in RPG Maker MZ. Featuring typing effects and control over width, height, typing speed, and window display time, this plugin offers a unique way to present messages to players.
    * 
    * Basic Steps:
    * 
    * Installation:
    * 
    * Download the FrogMessageWindow plugin from the developer's plugin repository: (link to the repository). Place the plugin file in the "plugins" folder of your RPG Maker MZ project.
    * 
    * In the RPG Maker MZ interface, navigate to the "Plugin Manager" tab and enable the FrogMessageWindow plugin.
    * 
    * "Show message" Command:
    * 
    * This plugin introduces the "Show message" command. When creating a new event in RPG Maker MZ, add an action of the type "Plugin Command." Select "Show message" as the plugin command.
    * 
    * Command Parameters:
    * 
    * message: Set the message you want to display in the window.
    * 
    * velocity: Adjust the speed at which words will be typed. Higher values result in slower typing.
    * 
    * width and height: Define the dimensions of the window as desired.
    * 
    * position: Choose between "Top," "Center," and "Bottom" to position the window on the screen.
    * 
    * displayTimeWindow: Determine how long the window will remain visible.
    *
*/

(() => {
    'use strict';

    const pluginName = "FrogMessageWindow";
    let message = "";

    let width = 0;
    let height = 0;
    
    let lettersVelocity = 0;
    let displayTimeWindow = 0;

    let displayedWindow = false;

    PluginManager.registerCommand(pluginName, "Show message", args => {

        if(displayedWindow) {
            return;
        }

        message = String(args.message);
        width = args.width > width ? args.width : 600;
        height = args.height > height ? args.height : 200;
        lettersVelocity = args.velocity != lettersVelocity ? args.velocity : 100;
        displayTimeWindow = args.displayTimeWindow > displayTimeWindow ? args.displayTimeWindow : 5;

        let x, y;
        switch (args.position) {
            case "Top":
                x = (Graphics.width - width) / 2;
                y = 10;
                break;
            case "Center":
                x = (Graphics.width - width) / 2;
                y = (Graphics.height - height) / 2;
                break;
            case "Bottom":
                x = (Graphics.width - width) / 2;
                y = Graphics.height - height - 10;
                break;
            default:
                x = (Graphics.width - width) / 2;
                y = (Graphics.height - height) / 2;
                break;
        }

        const frogWindow = new Window_Base(new Rectangle(x, y, width, height));

        let textX = 0;
        let textY = 0;
        let formedMessageWidth = 0;

        frogWindow.contents.clear();

        const letters = message.split("");
        let index = 0;

        function addLetters() {
            if(index < letters.length) {
                const currentLetter = letters[index];
                let letterWidth = frogWindow.textWidth(currentLetter);

                if(formedMessageWidth >= width - 30) {
                    textY += frogWindow.lineHeight();
                    formedMessageWidth = 0;
                    textX = 0;
                }

                frogWindow.drawTextEx(currentLetter, textX, textY, width);
                textX += letterWidth;
                formedMessageWidth += letterWidth;
                index++;

                setTimeout(addLetters, lettersVelocity);
            } else {
                let displayTimeMilliseconds = displayTimeWindow * 1000;
                setTimeout(() => {
                    SceneManager._scene.removeChild(frogWindow);
                    displayedWindow = false;
                }, displayTimeMilliseconds)
            }
        }

        displayedWindow = true;
        addLetters();
        SceneManager._scene.addChild(frogWindow);
    });

})();
