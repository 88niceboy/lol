const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL
const userListContainer = document.getElementById("userInfoPeopleGrid"); // userInfoPeopleGrid에 유저 정보 추가

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

    // 티어 이미지 설정
    const tierImage = getTierImage(user.Tier);

    const button = document.createElement("button");
    button.className = "custom-button";
    button.innerHTML = `
      <img src="${tierImage}" alt="${user.Tier} Icon"> <!-- 티어 이미지 -->
      <span>${user.Name}</span>
    `;

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
    "챌린저": "https://raw.githubusercontent.com/88niceboy/lol/main/image/challenger.png"
  };

  return tierImages[tier] || "https://raw.githubusercontent.com/88niceboy/lol/main/image/iron.png"; // 기본값은 아이언
}

// 페이지 로드 시 유저 정보 가져오기
fetchAndDisplayUsers();
