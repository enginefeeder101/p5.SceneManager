var bkImage;

function preload()
{
    bkImage = loadImage( "gamefiles/bk.jpg" );
}

function setup()
{
    createCanvas( bkImage.width, bkImage.height );

    var mgr = new p5SceneManager();
    mgr.bkImage = bkImage; // inject bkImage property
    mgr.wire();
    mgr.showScene( Intro );
}
