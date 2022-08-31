import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const minigrid = document.getElementById("minigrid");
const heldgrid = document.getElementById("heldgrid");

const range = (n) => Array.from({ "length": n }, (ignore, k) => k);

const cells = range(grid_rows).map(function() {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function() {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const heldcells = range(6).map(function () {
    const heldrow = document.createElement("div");
    heldrow.className = "heldrow";

    const heldrows = range(6).map(function () {
        const heldcell = document.createElement("div");
        heldcell.className = "heldcell";
        heldrow.append(heldcell);

        return heldcell;
    });

    heldgrid.append(heldrow);
    return heldrows;
});

const update_heldgrid = function () {
    heldcells.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = heldcells[line_index][column_index];
            cell.className = "heldcell";
            cell.backgroundColor = "";
        });
    });

    if (game.held_tetromino) {
        game.held_tetromino.grid.forEach(function (line, line_index) {
            line.forEach(function (block, column_index) {
                const heldcell = heldcells[line_index + 2][column_index + 2];
                heldcell.className = `heldcell ${block}`;
            });
        });
    }
};

const nextcells = range(6).map(function () {
    const nextrow = document.createElement("div");
    nextrow.className = "nextrow";

    const nextrows = range(6).map(function () {
        const nextcell = document.createElement("div");
        nextcell.className = "nextcell";

        nextrow.append(nextcell);

        return nextcell;
    });

    minigrid.append(nextrow);
    return nextrows;
});

const update_minigrid = function () {

    nextcells.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = nextcells[line_index][column_index];
            cell.className = "nextcell";
            cell.backgroundColor = "";
        });
    });

    game.next_tetromino.grid.forEach (function (line, line_index) {
        line.forEach (function (block, column_index) {
            const nextcell = nextcells[line_index + 2][column_index + 1];
            nextcell.className = `nextcell ${block}`;
        });
    });

};

const update_grid = function () {
    game.field.forEach(function(line, line_index) {
        line.forEach(function(block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function(coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );

    update_minigrid();
    update_heldgrid();
};

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function() {
    key_locked = false;
};

document.body.onkeydown = function(event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key === "c") {
        game = Tetris.hold(game);
    }
    update_grid();
};

const timer_function = function() {
    game = Tetris.next_turn(game);
    update_grid();
    setTimeout(timer_function, 500);
};

// build function for mini grid to display next_tetromino//


setTimeout(timer_function, 500);

update_grid();