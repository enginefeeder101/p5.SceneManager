//
// p5.SceneManager helps you create p5.js sketches with multiple states / scenes
// Each scene is a like a sketch within the main sketch. You focus on creating
// the scene like a regular sketch and p5.SceneManager ensure scene switching
// routing the main setup(), draw(), mousePressed(), etc. events to the
// appropriate current scene.
//
// Original Author: Marian Veteanu (https://github.com/mveteanu/p5.SceneManager)
// Changes By: enginefeeder101 (https://github.com/enginefeeder101/p5.SceneManager)
//

// Wrap function so we can export it als module
( function ( window )
{
    const p5SceneManager = function ( parent )
    {
        this.scenes = [];
        this.scene = null;

        // Wire relevant p5.js events, except setup() and draw()
        // If you don't call this method, you need to manually wire events
        this.wire = function ( extraEvents )
        {
            let P5Events = [
                "mouseClicked",
                "mousePressed",
                "mouseReleased",
                "mouseMoved",
                "mouseDragged",
                "doubleClicked",
                "mouseWheel",
                "keyPressed",
                "keyReleased",
                "keyTyped",
                "touchStarted",
                "touchMoved",
                "touchEnded",
                "deviceMoved",
                "deviceTurned",
                "deviceShaken",
                "windowResized",
            ];

            // Let user wire more events on the fly
            if ( extraEvents )
            {
                P5Events = P5Events.concat( extraEvents );
            }

            const me = this;
            const parentobj = parent != null ? parent : window;

            // Wire draw manually for speed reasons...
            parentobj.draw = function ()
            {
                me.draw();
            };

            // This loop will wire automatically all P5 events to each scene like this:
            // parentobj.mouseClicked = function() { me.handleEvent("mouseClicked"); }
            for ( let i = 0; i < P5Events.length; i++ )
            {
                const sEvent = P5Events[ i ];
                const parentEvent = parentobj[ sEvent ]; // Preserve parent / global function
                parentobj[ sEvent ] = function ()
                {
                    if ( parentEvent ) // If global / parent function exists, call first
                        parentEvent.apply( parentobj, [].slice.call( arguments ) );
                    me.handleEvent( sEvent, [].slice.call( arguments ) );
                };
            }

            return me;
        }


        // Add a scene to the collection
        // You need to add all the scenes if intend to call .showNextScene()
        this.addScene = function ( fnScene )
        {
            const oScene = new fnScene( parent );

            // inject parent as a property of the scene
            oScene.parent = parent;

            // inject p5.sceneManager as a property of the scene
            oScene.p5SceneManager = this;

            const newScene = {
                fnScene: fnScene,
                oScene: oScene,
                hasSetup: "setup" in oScene,
                hasEnter: "enter" in oScene,
                hasDraw: "draw" in oScene,
                hasExit: "exit" in oScene,
                setupExecuted: false,
                enterExecuted: false,
            };

            this.scenes.push( newScene );
            return newScene;
        }

        // Return the index of a scene in the internal collection
        this.findSceneIndex = function ( fnScene )
        {
            for ( let i = 0; i < this.scenes.length; i++ )
            {
                const scene = this.scenes[ i ];
                if ( scene.fnScene == fnScene )
                    return i;
            }

            return -1;
        }

        // Return a scene object wrapper
        this.findScene = function ( fnScene )
        {
            const i = this.findSceneIndex( fnScene );
            return i >= 0 ? this.scenes[ i ] : null;
        }

        // Returns true if the current displayed scene is fnScene
        this.isCurrent = function ( fnScene )
        {
            if ( this.scene == null )
                return false;

            return this.scene.fnScene == fnScene;
        }

        // Show a scene based on the function name
        // Optionally you can send arguments to the scene
        // Arguments will be retrieved in the scene via .sceneArgs property
        this.showScene = function ( fnScene, sceneArgs )
        {
            // Do nothing if this is the current scene
            if ( this.isCurrent( fnScene ) )
                return;

            // Run exit on current scene before we show the new one
            const currScene = this.scene;
            if ( currScene && currScene.hasExit )
            {
                currScene.oScene.exit();
            }

            let newScene = this.findScene( fnScene );

            if ( newScene == null )
                newScene = this.addScene( fnScene );

            // Re-arm the enter function at each show of the scene
            newScene.enterExecuted = false;

            this.scene = newScene;

            // inject sceneArgs as a property of the scene
            newScene.oScene.sceneArgs = sceneArgs;
        }

        // Show the next scene in the collection
        // Useful if implementing demo applications
        // where you want to advance scenes automatically
        this.showNextScene = function ( sceneArgs )
        {
            if ( this.scenes.length == 0 )
                return;

            let nextSceneIndex = 0;

            if ( this.scene != null )
            {
                // search current scene...
                // can be optimized to avoid searching current scene...
                let i = this.findSceneIndex( this.scene.fnScene );
                nextSceneIndex = i < this.scenes.length - 1 ? i + 1 : 0;
            }

            const nextScene = this.scenes[ nextSceneIndex ];
            this.showScene( nextScene.fnScene, sceneArgs );
        }

        // This is the p5.SceneManager .draw() method
        // This will dispatch the main draw() to the
        // current scene draw() method
        this.draw = function ()
        {
            // take the current scene in a variable to protect it in case
            // it gets changed by the user code in the events such as setup()...
            const currScene = this.scene;

            if ( currScene == null )
                return;

            if ( currScene.hasSetup && !currScene.setupExecuted )
            {
                currScene.setupExecuted = true;
                currScene.oScene.setup();
            }

            if ( currScene.hasEnter && !currScene.enterExecuted )
            {
                currScene.enterExecuted = true;
                currScene.oScene.enter();
            }

            if ( currScene.hasDraw )
            {
                currScene.oScene.draw();
            }
        }

        // Handle a certain even for a scene...
        // It is used by the anonymous functions from the wire() function
        this.handleEvent = function ( sEvent, args )
        {
            if ( this.scene == null || this.scene.oScene == null )
                return;

            const fnSceneEvent = this.scene.oScene[ sEvent ];
            if ( fnSceneEvent )
                fnSceneEvent.apply( this.scene.oScene, args );
        }

    }

    if ( typeof module === "object" && module && typeof module.exports === "object" )
    {
        // Export als module
        module.exports = p5SceneManager;
    }
    else
    {
        // Assign in global namespace
        window.p5SceneManager = p5SceneManager;
        if ( typeof define === "function" && define.amd )
        {
            // Export as AMD module
            define( "p5SceneManager", [], function ()
            {
                return p5SceneManager;
            } );
        }
    }
} )( this );
