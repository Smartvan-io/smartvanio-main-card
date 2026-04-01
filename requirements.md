### Drag and drop requirements
- Dashboard tiles should be displayed in a grid that has row / col count computed based on screen size given a tile size between x-y. This allows for a responsive design system. Columns must fit based on width and rows based on height
- When in drag and drop mode, the posititions of the tiles must be stored the current grid size {x,y} as the index. A user can then view the gird on a different screen and change the layout. They will then have 2 saved layouts that will be displayed when the grid size is the same as them.
- Dashboard should support multiple size tiles where the x and y dimenons are multiples of the tiles + some spacing.
- When a larger tile is moved it should occupy the same amount of space as its size. 