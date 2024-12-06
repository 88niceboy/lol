const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL
const userListContainer = document.getElementById("userInfoPeopleGrid"); // userInfoPeopleGrid에 유저 정보 추가

// 모달 관련 요소
const modal = document.getElementById("userModal");
const closeModal = document.querySelector(".close");
const modalUserName = document.getElementById("modalUserName");
const userWins = document.getElementById("userWins");
const userLoses = document.getElementById("userLoses");
const userRate = document.getElementById("userRate");
const winRateChartCanvas = document.getElementById("winRateChart");
const graphTitle = document.getElementById("graphTitle");

let winRateChart; // 그래프 인스턴스

// **모달 초기 상태 숨기기**
modal.style.display = "none"; // 페이지 로드 시 모달 숨김

// 모달 닫기
closeModal.addEventListener("click", () => {
  modal.style.display = "none"; // 모달 숨기기
});

// 유저 정보를 가져와 페이지에 표시
async function fetchAndDisplayUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);

    const users = await response.json();
    displayUserCards(users); // 카드 형태로 유저 정보 표시
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// 유저 카드 나열 (각 유저에 대해 카드 생성)
function displayUserCards(users) {
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.className = "user-info-card";

    const tierImage = getTierImage(user.Tier);
    const button = document.createElement("button");
    button.className = "custom-button";
    button.innerHTML = `
      <img src="${tierImage}" alt="${user.Tier} Icon">
      <span>${user.Name}</span>
    `;

    // **유저 카드 클릭 이벤트로만 모달 표시**
    button.addEventListener("click", () => {
      showUserDetails(user);
    });

    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.innerHTML = `
      <div class="user-tier">${user.Tier} ${user.TierRank}</div>
      <div class="user-positions">${[user.Position1, user.Position2, user.Position3, user.Position4, user.Position5].filter(Boolean).join(", ")}</div>
    `;

    userCard.appendChild(button);
    userCard.appendChild(userInfo);
    userListContainer.appendChild(userCard);
  });
}

// 유저 상세 정보 표시 함수
function showUserDetails(user) {
  modalUserName.textContent = user.Name;
  userWins.textContent = user.Win;
  userLoses.textContent = user.Lose;
  const winRate = Math.round((user.Win / (user.Win + user.Lose)) * 100) || 0;
  userRate.textContent = `${winRate}%`;

  // 기본 총승률 그래프 표시
  updateGraph("Total", user);

  // **유저 카드 클릭 시에만 모달 표시**
  modal.style.display = "flex";
}

// 그래프 업데이트 함수
function updateGraph(position, user = null) {
  let wins = 0;
  let loses = 0;

  if (position === "Total") {
    wins = user.Win;
    loses = user.Lose;
  } else {
    const positionKey = `${position.toLowerCase()}Win`;
    const loseKey = `${position.toLowerCase()}Lose`;
    wins = user[positionKey];
    loses = user[loseKey];
  }

  const totalGames = wins + loses;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  // 그래프 데이터
  const chartData = {
    labels: ["Wins", "Loses"],
    datasets: [
      {
        label: "Win Rate",
        data: [wins, loses],
        backgroundColor: [
          getComputedStyle(document.documentElement).getPropertyValue("--win-color"),
          getComputedStyle(document.documentElement).getPropertyValue("--lose-color"),
        ],
        borderColor: [
          getComputedStyle(document.documentElement).getPropertyValue("--win-border-color"),
          getComputedStyle(document.documentElement).getPropertyValue("--lose-border-color"),
        ],
        borderWidth: 1,
      },
    ],
  };

  // 그래프 타이틀 업데이트
  graphTitle.textContent = position === "Total" ? "총승률" : `${position} 승률`;

  // 그래프 중앙 텍스트 플러그인
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
      const { ctx, width, height } = chart;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${winRate}%`, centerX, centerY);
      ctx.restore();
    },
  };

  // 그래프 생성 또는 업데이트
  if (winRateChart) {
    winRateChart.data = chartData;
    winRateChart.update();
  } else {
    winRateChart = new Chart(winRateChartCanvas.getContext("2d"), {
      type: "doughnut",
      data: chartData,
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
      plugins: [centerTextPlugin],
    });
  }

  // 상세 데이터 업데이트
  userWins.textContent = wins;
  userLoses.textContent = loses;
  userRate.textContent = `${winRate}%`;
}

// 티어 이미지 반환 함수
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

  return tierImages[tier] || "https://raw.githubusercontent.com/88niceboy/lol/main/image/iron.png"; // 기본값은 아이언
}

// 페이지 로드 시 유저 정보 가져오기
fetchAndDisplayUsers();
