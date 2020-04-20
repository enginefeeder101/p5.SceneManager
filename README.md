# p5.SceneManager

## Description
p5.SceneManager helps you create [p5.js](https://p5js.org) sketches with multiple states / scenes. Each scene is a like a sketch within the main sketch. You focus on creating the scene like a regular sketch and p5.SceneManager ensure scene switching routing the main setup(), draw(), mousePressed(), etc. events to the appropriate current scene.

Instead of putting all your code in the main setup() and draw() like this:

```JavaScript
function setup() {
}

function draw() {
}
```

... you put each scene code in the setup() and draw() methods of individual Scene classes:

```JavaScript
function setup()
{
    createCanvas(400, 400);

    const mgr = new p5SceneManager();
    mgr.wire();
    mgr.showScene( First );
}

function First()
{
    this.setup = function() {
    }

    this.draw = function() {
    }

    this.keyPressed = function() {
        this.p5SceneManager.showScene( Second );
    }
}

function Second()
{
    this.setup = function() {
    }

    this.draw = function() {
    }
}
```

The p5.SceneManager will provide you with methods necesary to switch to the appropriate scene and route the main p5.js events to your defined events.

## Source Code
Source code is located in [```lib/p5scenemanager.js```](https://github.com/enginefeeder101/p5.SceneManager/blob/master/lib/p5scenemanager.js)

## Demo Code
For demos please check the ```examples``` folder

## License
[![License: CC BY 4.0](https://licensebuttons.net/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)
p5.SceneManager by [enginefeeder101](https://github.com/enginefeeder101) is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

### Attribution
This project is a fork of [p5.SceneManager](https://github.com/mveteanu/p5.SceneManager) by [mveteanu](https://github.com/mveteanu), licensed under a [Creative Commons Attribution 2.0 Generic License](https://creativecommons.org/licenses/by/2.0/).
