const $table = document.getElementById("table");
const $score = document.getElementById("score");
const $back = document.getElementById("back");
let data = [];
const history = [];

function startGame() {
  //게임시작
  const $fragment = document.createDocumentFragment(); //태그 한번에 전달
  [1, 2, 3, 4].forEach(function () {
    //태그 넣기
    const rowData = [];
    data.push(rowData);
    const $tr = document.createElement("tr");
    [1, 2, 3, 4].forEach(() => {
      rowData.push(0);
      const $td = document.createElement("td");
      $tr.appendChild($td);
    });
    $fragment.appendChild($tr);
  });
  $table.appendChild($fragment);
  put2ToRandomCell();
  draw();
}

function put2ToRandomCell() {
  //랜덤 자리에 2 넣기
  const emptyCells = [];
  data.forEach(function (rowData, i) {
    //비어있는 자리를 확인
    rowData.forEach(function (cellData, j) {
      if (!cellData) {
        emptyCells.push([i, j]);
      }
    });
  });
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]; //랜덤 인덱스
  data[randomCell[0]][randomCell[1]] = 2;
}

function draw() {
  //표 그리기
  data.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      const $target = $table.children[i].children[j];
      if (cellData > 0) {
        //숫자 2 색깔
        $target.textContent = cellData;
        $target.className = "color-" + cellData;
      } else {
        $target.textContent = "";
        $target.className = "";
      }
    });
  });
}

//움직여서 숫자 합치기
function moveCells(direction) {
  history.push({
    table: JSON.parse(JSON.stringify(data)),
    score: $score.textContent,
  });
  switch (direction) {
    case "left": {
      const newData = [[], [], [], []]; //같은 숫자가 있는지 판단후 숫자넣을곳
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (cellData) {
            const currentRow = newData[i];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === cellData) {
              const score = parseInt($score.textContent);
              $score.textContent =
                score + currentRow[currentRow.length - 1] * 2;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(cellData);
            }
          }
        });
      });
      console.log(newData);
      [1, 2, 3, 4].forEach((rowData, i) => {
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case "right": {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (rowData[3 - j]) {
            const currentRow = newData[i];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === rowData[3 - j]) {
              const score = parseInt($score.textContent);
              $score.textContent =
                score + currentRow[currentRow.length - 1] * 2;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(rowData[3 - j]);
            }
          }
        });
      });
      console.log(newData);
      [1, 2, 3, 4].forEach((rowData, i) => {
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][3 - j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case "up": {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (cellData) {
            const currentRow = newData[j];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === cellData) {
              const score = parseInt($score.textContent);
              $score.textContent =
                score + currentRow[currentRow.length - 1] * 2;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[j].push(cellData);
            }
          }
        });
      });
      console.log(newData);
      [1, 2, 3, 4].forEach((cellData, i) => {
        [1, 2, 3, 4].forEach((rowData, j) => {
          data[j][i] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case "down":
      {
        const newData = [[], [], [], []];
        data.forEach((rowData, i) => {
          rowData.forEach((cellData, j) => {
            if (data[3 - i][j]) {
              const currentRow = newData[j];
              const prevData = currentRow[currentRow.length - 1];
              if (prevData === data[3 - i][j]) {
                const score = parseInt($score.textContent);
                $score.textContent =
                  score + currentRow[currentRow.length - 1] * 2;
                currentRow[currentRow.length - 1] *= -2;
              } else {
                newData[j].push(data[3 - i][j]);
              }
            }
          });
        });
        console.log(newData);
        [1, 2, 3, 4].forEach((cellData, i) => {
          [1, 2, 3, 4].forEach((rowData, j) => {
            data[3 - j][i] = Math.abs(newData[i][j]) || 0;
          });
        });
      }
      break;
  }
  if (data.flat().includes(2048)) {
    draw();
    setTimeout(() => {
      alert("축하합니다. 2048을 만들었습니다");
    }, 0);
  } else if (!data.flat().includes(0)) {
    alert(`패배했습니다... ${$score.textContent}점`);
  } else {
    put2ToRandomCell();
    draw();
  }
}
//이동방향 이벤트
window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    moveCells("up");
  } else if (event.key === "ArrowDown") {
    moveCells("down");
  } else if (event.key === "ArrowLeft") {
    moveCells("left");
  } else if (event.key === "ArrowRight") {
    moveCells("right");
  }
});
let startCoord; // 마우스 첫 지점
window.addEventListener("mousedown", (event) => {
  startCoord = [event.clientX, event.clientY];
});
window.addEventListener("mouseup", (event) => {
  const endCoord = [event.clientX, event.clientY];
  const diffX = endCoord[0] - startCoord[0];
  const diffY = endCoord[1] - startCoord[1];
  if (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) {
    moveCells("left");
  } else if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) {
    moveCells("right");
  } else if (diffY > 0 && Math.abs(diffX) <= Math.abs(diffY)) {
    moveCells("down");
  } else if (diffY < 0 && Math.abs(diffX) <= Math.abs(diffY)) {
    moveCells("up");
  }
});
//되돌리기 버튼 이벤트
$back.addEventListener("click", () => {
  const prevData = history.pop();
  if (!prevData) {
    return;
  }
  $score.textContent = prevData.score;
  data = prevData.table;
  draw();
});
startGame(); //게임시작