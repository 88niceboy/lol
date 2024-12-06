const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users";
const userListContainer = document.getElementById("userInfoPeopleGrid");

// 모달 관련 요소
const modal = document.getElementById("userModal");
const closeModal = document.querySelector(".close");

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

// 모달 열기 및 그래프 초기화
function showUserModal(user) {
  modal.style.display = "flex";

  // 총승률 및 포지션별 데이터 업데이트
  updatePosition("Total", user.Win, user.Lose);
  updatePosition("Top", user.TopWin, user.TopLose);
  updatePosition("Jungle", user.JungleWin, user.JungleLose);
  updatePosition("Mid", user.MidWin, user.MidLose);
  updatePosition("ADC", user.AdWin, user.AdLose);
  updatePosition("Support", user.SupportWin, user.SupportLose);
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
  // CSS 변수를 사용해 색상 가져오기
  const rootStyles = getComputedStyle(document.documentElement);
  const winColor = rootStyles.getPropertyValue("--win-color").trim();
  const loseColor = rootStyles.getPropertyValue("--lose-color").trim();
  const winBorderColor = rootStyles.getPropertyValue("--win-border-color").trim();
  const loseBorderColor = rootStyles.getPropertyValue("--lose-border-color").trim();

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
            ctx.font = "bold 18px Arial";
            ctx.fillStyle = "#ffffff";
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

// 초기 실행
fetchAndDisplayUsers();
