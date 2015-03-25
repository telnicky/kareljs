# kareljs
Try it out here <http://telnicky.github.io/kareljs>

Kareljs is a JavaScript game that is designed to help teach kids some
fundamentals of programming. The game is not an original idea, this was taken
from the intro to programming course taught by Stanford.

The game consists of a text-editor and a rendered world that Karel exists in.
The object of the game is to organize what are called Beepers into the proper
positions in the world. As a player, you write JavaScript in the text-editor
and that code controls the actions of Karel.

This game is very useful for teaching fundamentals like defining functions, if
statements, while loops, and for loops. It also helps the players learn the
basic syntax of JavaScript.

## Building Levels
The levels file contains an array of levels that are rendered by the renderer
class. You can build new levels by adding a new object to the `levels` array.

This object must include the following keys:

  * code - a string containing the initial code a player would start out with.
  * name - a string representing the title of the level
  * worlds - an array of world objects to be rendered

A world object contains:

  * walls: a string representing the walls to draw for the level. Each row is
         delimited by a new line, and each cell is a bit mask representing what wall to
         draw for that cell. The order of the bit mask is Top Right Bottom Left. So for
         example, 9 is 1001, that would mean that cell has a wall on the top and on the
         left edge.
  * beepers: An array of beeper objects that is used to initially place beepers in the world.
  * solution: An array of beeper objects that will be used to check the solution.
  * karel: A Karel Object

A beeper object contains:
  
  * x: a number representing the x coordinate in the world
  * y: a number representing the y coordinate in the world
  * count: a number representing the number of beepers at that cell

A Karel object contains:

  * x: a number representing the x coordinate in the world
  * y: a number representing the y coordinate in the world
  * direction: a number representing the initial direction that Karel will be facing.
  	
    * 0 - East
    * 1 - North
    * 2 - West
    * 3 - South
  
  * isSuper: a boolean that represents whether or not Karel has the Super Karel commands.
  * beeperCount: a number representing the number of beepers Karel is carrying at the start. Default is Infinity.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

