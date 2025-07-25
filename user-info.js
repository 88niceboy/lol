const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users";
const CHAMP_SCORE_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users/champ-score";
// const API_URL = "https://localhost:3000/users";
// const CHAMP_SCORE_URL = "https://localhost:3000/users/champ-score";
const userListContainer = document.getElementById("userInfoPeopleGrid");

// 모달 관련 요소
const modal = document.getElementById("userModal");
const closeModal = document.querySelector(".close");

// 유저 통계 테이블
const userStatsTableBody = document.getElementById("positionStatsTableBody");
// 그래프 관련 요소
const chartElements = {
  Total: document.getElementById("totalChart"),
  Top: document.getElementById("topChart"),
  Jungle: document.getElementById("jungleChart"),
  Mid: document.getElementById("midChart"),
  ADC: document.getElementById("adcChart"),
  Support: document.getElementById("supportChart"),
};

let charts = {}; // 저장된 차트 객체들

// document.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);


// 초기 모달 숨기기
modal.style.display = "none";

// 모달 닫기 이벤트
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// 유저 데이터 가져오기 및 카드 생성
async function fetchAndDisplayUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);

    const users = await response.json();
    displayUserCards(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// 유저 카드 생성
function displayUserCards(users) {
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.className = "user-info-card";

    const tierImage = getTierImage(user.Tier);
    const button = document.createElement("button");
    button.className = "custom-button";
    button.innerHTML = `<img src="${tierImage}" alt="${user.Tier} Icon"><span>${user.Name}</span>`;

    button.addEventListener("click", () => showUserModal(user));

    userCard.appendChild(button);
    userListContainer.appendChild(userCard);
  });
}

function resetModalData() {
  const positions = ["Total", "Top", "Jungle", "Mid", "ADC", "Support"];
  positions.forEach((position) => {
    document.getElementById(`${position.toLowerCase()}Wins`).textContent = "0";
    document.getElementById(`${position.toLowerCase()}Loses`).textContent = "0";
    document.getElementById(`${position.toLowerCase()}Games`).textContent = "0";
    document.getElementById(`${position.toLowerCase()}Rate`).textContent = "0%";

    if (charts[position]) {
      charts[position].destroy();
      charts[position] = null;
    }
  });

  userStatsTableBody.innerHTML = "";
}


// 모달 열기 및 그래프 초기화
// async function showUserModal(user) {
//   resetModalData(); // 모달 데이터를 초기화
//   modal.style.display = "flex";

//   // 유저 이름과 ID 설정
//   const nameAndId = `${user.Name || "이름없음"} / ${user.LolId || "아이디없음"}`;
//   document.getElementById("userNameAndId").textContent = nameAndId;

//   // 유저 데이터를 업데이트
//   updatePosition("Total", user.Win, user.Lose);
//   updatePosition("Top", user.TopWin, user.TopLose);
//   updatePosition("Jungle", user.JungleWin, user.JungleLose);
//   updatePosition("Mid", user.MidWin, user.MidLose);
//   updatePosition("ADC", user.AdWin, user.AdLose);
//   updatePosition("Support", user.SupportWin, user.SupportLose);

//   console.log("userNamesdfsdf",user.Name)
//   // 챔프 스코어 데이터 가져오기 및 테이블 업데이트
//   await fetchChampScoreData(user.Name);
// }

// async function showUserModal(user) {
//   resetModalData(); // 모달 데이터 초기화
//   modal.style.display = "flex";

//   // 유저 이름과 ID 설정
//   const nameAndId = `${user.Name || "이름없음"} / ${user.LolId || "아이디없음"}`;
//   document.getElementById("userNameAndId").textContent = nameAndId;

//   // 유저 데이터를 업데이트
//   updatePosition("Total", 
//     user.TopWin + user.JungleWin + user.MidWin + user.AdWin + user.SupportWin,
//     user.TopLose + user.JungleLose + user.MidLose + user.AdLose + user.SupportLose
//   );

//   updatePosition("Top", user.TopWin, user.TopLose);
//   updatePosition("Jungle", user.JungleWin, user.JungleLose);
//   updatePosition("Mid", user.MidWin, user.MidLose);
//   updatePosition("ADC", user.AdWin, user.AdLose);
//   updatePosition("Support", user.SupportWin, user.SupportLose);

//   await fetchChampScoreData(user.Name);
// }
async function showUserModal(user) {
  resetModalData(); 
  modal.style.display = "flex";

  const nameAndId = `${user.Name || "이름없음"} / ${user.LolId || "아이디없음"}`;
  document.getElementById("userNameAndId").textContent = nameAndId;

  await fetchChampScoreData(user.Name); // ✅ 이름 기반으로 호출
}




// 포지션 업데이트 함수
function updatePosition(position, wins, loses) {
  const games = wins + loses;
  const rate = games > 0 ? Math.round((wins / games) * 100) : 0;

  document.getElementById(`${position.toLowerCase()}Wins`).textContent = wins;
  document.getElementById(`${position.toLowerCase()}Loses`).textContent = loses;
  document.getElementById(`${position.toLowerCase()}Games`).textContent = games;
  document.getElementById(`${position.toLowerCase()}Rate`).textContent = `${rate}%`;

  updateChart(position, [wins, loses], rate);
}

// 그래프 업데이트 함수
function updateChart(position, data, winRate) {
  const winColor = getComputedStyle(document.documentElement).getPropertyValue("--win-color").trim();
  const loseColor = getComputedStyle(document.documentElement).getPropertyValue("--lose-color").trim();
  const winBorderColor = getComputedStyle(document.documentElement).getPropertyValue("--win-color").trim();
  const loseBorderColor = getComputedStyle(document.documentElement).getPropertyValue("--lose-color").trim();

  if (charts[position]) {
    charts[position].data.datasets[0].data = data;
    charts[position].update();
  } else {
    const ctx = chartElements[position].getContext("2d");
    charts[position] = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Wins", "Loses"],
        datasets: [
          {
            data,
            backgroundColor: [winColor, loseColor],
            borderColor: [winBorderColor, loseBorderColor],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
      plugins: [
        {
          id: "centerText",
          beforeDraw(chart) {
            const { ctx, chartArea } = chart;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            ctx.save();
            ctx.font = "bold 22px Arial";

            if (winRate > 70) {
              ctx.fillStyle = "#ff4d4d"; // 빨간색
            } else {
              ctx.fillStyle = "#ffffff"; // 흰색
            }

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${winRate}%`, centerX, centerY);
            ctx.restore();
          },
        },
      ],
    });
  }
}

// 티어 이미지 반환
function getTierImage(tier) {
  const tierImages = {
    "아이언": "https://raw.githubusercontent.com/88niceboy/lol/main/image/iron.png",
    "브론즈": "https://raw.githubusercontent.com/88niceboy/lol/main/image/bronze.png",
    "실버": "https://raw.githubusercontent.com/88niceboy/lol/main/image/silver.png",
    "골드": "https://raw.githubusercontent.com/88niceboy/lol/main/image/gold.png",
    "플레티넘": "https://raw.githubusercontent.com/88niceboy/lol/main/image/platinum.png",
    "에메랄드": "https://raw.githubusercontent.com/88niceboy/lol/main/image/emerald.png",
    "다이아몬드": "https://raw.githubusercontent.com/88niceboy/lol/main/image/diamond.png",
    "마스터": "https://raw.githubusercontent.com/88niceboy/lol/main/image/master.png",
    "그랜드마스터": "https://raw.githubusercontent.com/88niceboy/lol/main/image/grandmaster.png",
    "챌린저": "https://raw.githubusercontent.com/88niceboy/lol/main/image/challenger.png",
  };

  return tierImages[tier] || "https://raw.githubusercontent.com/88niceboy/lol/main/image/iron.png";
}

// 챔프 스코어 데이터 가져오기
// async function fetchChampScoreData(name) {
//   try {
//     console.log("fetchChampScoreData", name);
//     const response = await fetch(`${CHAMP_SCORE_URL}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ Name: name }),
//     });
  
//     if (!response.ok) {
//       throw new Error(`Failed to fetch champ data: ${response.statusText}`);
//     }
  
//     const data = await response.json();
  
//     // 테이블에 데이터 표시
//     data.forEach((champ) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${champ.Champ}</td>
//         <td>${champ.Win}</td>
//         <td>${champ.Lose}</td>
//         <td>${parseInt(champ.Win) + parseInt(champ.Lose)}</td>
//         <td>${((parseInt(champ.Win) / (parseInt(champ.Win) + parseInt(champ.Lose))) * 100).toFixed(2)}%</td>
//       `;
//       userStatsTableBody.appendChild(row);
//     });
//   } catch (error) {
//     console.error("Error fetching champ score data:", error);
//     userStatsTableBody.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
//   }
// }

async function fetchChampScoreData(user_name) {
  try {
    console.log("Fetching champ scores for:", user_name);

    const response = await fetch(`${CHAMP_SCORE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name: user_name })
    });

    if (!response.ok) throw new Error("Failed to fetch champ data");

    const { champions, positions } = await response.json(); // ✅ 백엔드 구조 { champions:[], positions:{} }
    console.log("Champ Score Data:", champions, positions);

    // ✅ 포지션별 승/패 합산 및 그래프 업데이트 (한글 포지션명 그대로 사용)
    const totalWin = Object.values(positions).reduce((sum, pos) => sum + pos.Win, 0);
    const totalLose = Object.values(positions).reduce((sum, pos) => sum + pos.Lose, 0);

    updatePosition("Total", totalWin, totalLose);
    updatePosition("Top", positions["탑"]?.Win || 0, positions["탑"]?.Lose || 0);
    updatePosition("Jungle", positions["정글"]?.Win || 0, positions["정글"]?.Lose || 0);
    updatePosition("Mid", positions["미드"]?.Win || 0, positions["미드"]?.Lose || 0);
    updatePosition("ADC", positions["원딜"]?.Win || 0, positions["원딜"]?.Lose || 0);
    updatePosition("Support", positions["서포터"]?.Win || 0, positions["서포터"]?.Lose || 0);

    // ✅ 챔피언별 테이블 업데이트
    userStatsTableBody.innerHTML = "";

    if (!champions || champions.length === 0) {
      userStatsTableBody.innerHTML = `<tr><td colspan="5">전적 데이터가 없습니다.</td></tr>`;
      return;
    }

    champions.forEach((champ) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${champ.Champ}</td>
        <td>${champ.Position}</td>
        <td>${champ.Win}승</td>
        <td>${champ.Lose}패</td>
        <td>${champ.WinRate}%</td>
      `;
      userStatsTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching champ score data:", error);
    userStatsTableBody.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
  }
}




// 초기 실행
//fetchAndDisplayUsers();
