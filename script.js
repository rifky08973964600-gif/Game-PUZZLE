let board;
let score = 0;
const rows = 4;
const cols = 4;

window.onload = function() {
    setupGame();
}

function setupGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    document.getElementById("score").innerText = score;

    // Buat ubin awal dan gambar papan
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let val = board[r][c];
            updateTile(tile, val);
            document.getElementById("game-board").append(tile);
        }
    }
    setTwo(); // Tempatkan 2 ubin pertama
    setTwo();
}

function updateTile(tile, val) {
    tile.innerText = "";
    tile.classList.value = ""; // Bersihkan kelas lama
    tile.classList.add("tile");
    if (val > 0) {
        tile.innerText = val.toString();
        // Gunakan kelas t + nilai (misal t2, t4) untuk pewarnaan
        tile.classList.add("t" + val.toString());
    }
}

// ----------------------------------------------------
// LOGIKA GESER (SLIDE)
// ----------------------------------------------------

document.addEventListener('keyup', (e) => {
    // Tombol panah
    if (e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "ArrowUp" || e.code == "ArrowDown") {
        let hasMoved = false;

        if (e.code == "ArrowLeft") {
            hasMoved = slideLeft();
        } else if (e.code == "ArrowRight") {
            hasMoved = slideRight();
        } else if (e.code == "ArrowUp") {
            hasMoved = slideUp();
        } else if (e.code == "ArrowDown") {
            hasMoved = slideDown();
        }
        
        // Hanya buat ubin baru jika ada pergerakan
        if (hasMoved) {
            setTwo();
        }
        document.getElementById("score").innerText = score;
        checkGameOver();
    }
});

function filterZero(row) {
    return row.filter(num => num != 0); // Buat array baru tanpa nol
}

function combine(row) {
    for (let i = 0; i < row.length - 1; i++) {
        // Jika dua ubin bersebelahan sama, gabungkan
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            score += row[i];
            row[i+1] = 0; // Set ubin berikutnya menjadi 0
        }
    }
    return row;
}

function slide(row) {
    // 1. Geser ubin non-nol ke satu sisi
    row = filterZero(row); 

    // 2. Gabungkan ubin yang sama
    row = combine(row); 
    row = filterZero(row); // Geser lagi setelah penggabungan

    // 3. Tambahkan nol kembali untuk mengisi 4 kolom
    while (row.length < cols) {
        row.push(0);
    } 
    return row;
}

// ----------------------------------------------------
// FUNGSI GESER PER ARAH
// ----------------------------------------------------

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row]; // Salin array
        
        row = slide(row); // Lakukan logika geser dan gabung
        board[r] = row;

        // Cek apakah papan benar-benar berubah
        if (originalRow.join(',') !== row.join(',')) {
            moved = true;
        }

        // Perbarui tampilan ubin
        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let val = board[r][c];
            updateTile(tile, val);
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row];
        
        row.reverse(); // Balikkan baris
        row = slide(row);
        row.reverse(); // Balikkan kembali

        board[r] = row;

        if (originalRow.join(',') !== row.join(',')) {
            moved = true;
        }

        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let val = board[r][c];
            updateTile(tile, val);
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < cols; c++) {
        // Ambil kolom menjadi array sementara
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = [...col];

        col = slide(col); // Geser dan gabung

        // Salin kembali nilai dari array sementara ke papan
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
        }

        if (originalCol.join(',') !== col.join(',')) {
            moved = true;
        }

        // Perbarui tampilan
        for (let r = 0; r < rows; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let val = board[r][c];
            updateTile(tile, val);
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < cols; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = [...col];

        col.reverse(); // Balikkan kolom
        col = slide(col);
        col.reverse(); // Balikkan kembali

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
        }

        if (originalCol.join(',') !== col.join(',')) {
            moved = true;
        }

        for (let r = 0; r < rows; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let val = board[r][c];
            updateTile(tile, val);
        }
    }
    return moved;
}


// ----------------------------------------------------
// FUNGSI PEMBANTU (Helper)
// ----------------------------------------------------

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return; // Tidak ada ruang kosong
    }

    let found = false;
    while (!found) {
        // Pilih posisi (r, c) secara acak
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        if (board[r][c] == 0) {
            // Tempatkan nilai '2' (atau '4' sesekali)
            board[r][c] = Math.random() < 0.9 ? 2 : 4; 
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
            found = true;
        }
    }
}

function checkGameOver() {
    if (hasEmptyTile()) {
        return; // Game belum berakhir jika masih ada ruang kosong
    }

    // Cek apakah masih ada gerakan yang mungkin (gabungan horizontal/vertikal)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let val = board[r][c];

            // Cek ke kanan
            if (c < cols - 1 && val == board[r][c + 1]) return;
            // Cek ke bawah
            if (r < rows - 1 && val == board[r + 1][c]) return;
        }
    }

    // Jika tidak ada ruang kosong dan tidak ada gerakan yang mungkin
    setTimeout(() => {
        alert("Game Over! Skor Anda: " + score);
        setupGame(); // Mulai ulang game
    }, 100);
}
