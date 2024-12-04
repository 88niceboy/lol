const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL

// DOM 요소
const peopleGrid = document.getElementById("peopleGrid");
const selectedGroups = document.getElementById("selectedGroups");
const teamButton = document.createElement("button");
teamButton.textContent = "팀 뽑기";
teamButton.className = "make-team-button";
teamButton.disabled = true;
const teamDisplay = document.getElementById("teamDisplay");

// 선택된 사람 리스트
const selectedPeople = [];
let users = [];
// 유저 데이터를 백엔드에서 가져오기
async function fetchUsers() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    users = data;  // 유저 데이터를 전역 변수에 저장
    populateUsers(data);  // 사용자 데이터를 화면에 표시
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// 사람 카드 생성
// function populateUsers(users) {
//   users.forEach((user) => {
//     const userCard = document.createElement("div");
//     userCard.className = "user-card";

//     const button = document.createElement("button");
//     button.className = "custom-button";
//     button.innerHTML = `
//       <img src="https://via.placeholder.com/40" alt="User Icon">
//       <span>${user.Name}</span>
//     `;
//     button.addEventListener("click", () => selectPerson(user.Name, button));

//     const userInfo = document.createElement("div");
//     userInfo.className = "user-info";
//     userInfo.innerHTML = `
//       <div class="user-tier">${user.Tier} ${user.TierRank}</div>
//       <div class="user-positions">${[user.Position1, user.Position2, user.Position3, user.Position4, user.Position5].filter(Boolean).join(", ")}</div>
//     `;

//     userCard.appendChild(button);
//     userCard.appendChild(userInfo);
//     peopleGrid.appendChild(userCard);
//   });
// }

function populateUsers(users) {
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.className = "user-card";

    // 티어 이미지 설정
    const tierImage = getTierImage(user.Tier);

    const button = document.createElement("button");
    button.className = "custom-button";
    button.innerHTML = `
      <img src="${tierImage}" alt="${user.Tier} Icon"> <!-- 티어 이미지 -->
      <span>${user.Name}</span>
    `;
    button.addEventListener("click", () => selectPerson(user.Name, button));

    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.innerHTML = `
      <div class="user-tier">${user.Tier} ${user.TierRank}</div>
      <div class="user-positions">${[user.Position1, user.Position2, user.Position3, user.Position4, user.Position5].filter(Boolean).join(", ")}</div>
    `;

    userCard.appendChild(button);
    userCard.appendChild(userInfo);
    peopleGrid.appendChild(userCard);
  });
}


// 유저 선택 이벤트
function selectPerson(person, buttonElement) {
  if (selectedPeople.includes(person)) {
    // 선택을 취소하면 배열에서 삭제하고 버튼에서 'selected' 클래스를 제거
    selectedPeople.splice(selectedPeople.indexOf(person), 1);
    buttonElement.classList.remove("selected");
  } else {
    // 새로운 유저를 선택하면 배열에 추가하고 버튼에 'selected' 클래스를 추가
    selectedPeople.push(person);
    buttonElement.classList.add("selected");
  }

  // 선택된 사람들을 표시
  updateSelectedGroups();

  // 10명이 선택되었을 때만 '팀 뽑기' 버튼 활성화
  teamButton.disabled = selectedPeople.length !== 10; 
}

// 선택된 사람 그룹 업데이트
function updateSelectedGroups() {
  selectedGroups.innerHTML = '<div class="group-title">선택한 인원</div>';
  
  // selectedPeople에 있는 각 사람을 순회하면서 버튼 생성
  selectedPeople.forEach((person) => {
    // person을 기반으로 user 객체 찾기
    const user = users.find(u => u.Name === person);
    if (!user) return;  // 유저 정보가 없다면 넘어가기

    const button = document.createElement("button");
    button.className = "custom-button selected";
    
    // 유저의 티어 이미지 설정
    const tierImage = getTierImage(user.Tier);

    button.innerHTML = `
      <img src="${tierImage}" alt="${user.Tier} Icon"> <!-- 티어 이미지 -->
      <span>${person}</span>
    `;
    button.addEventListener("click", () => selectPerson(person, button));

    selectedGroups.appendChild(button);
  });

  // '팀 뽑기' 버튼을 마지막에 추가
  selectedGroups.appendChild(teamButton);
}

// 팀 나누기 버튼 이벤트 (백엔드 POST 요청)
teamButton.addEventListener("click", async () => {
  if (selectedPeople.length !== 10) return;

  try {
    const response = await fetch(`${API_URL}/team-generator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userNames: selectedPeople }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate teams: ${response.statusText}`);
    }

    const results = await response.json();
    displayTeams(results);
  } catch (error) {
    console.error("Error generating teams:", error);
    teamDisplay.innerHTML = `<div class="error">팀 생성 실패: ${error.message}</div>`;
  }
});

// 팀 결과 표시
function displayTeams(results) {
  teamDisplay.innerHTML = results
    .map(
      (result, index) => `
      <div class="team-set">
        <h3>Team Set ${index + 1}</h3>
        <div class="team-container">
          <div class="team">
            <h4>Team A</h4>
            <ul>
              ${result.teamA
                .map(
                  (user) =>
                    `<li>${user.Name} (${user.Tier} ${user.TierRank}) - 
                    ${[1, 2, 3, 4, 5]
                      .map((i) => user[`Position${i}`] || "")
                      .filter(Boolean)
                      .join(", ")}</li>`
                )
                .join("")}
            </ul>
          </div>
          <div class="team">
            <h4>Team B</h4>
            <ul>
              ${result.teamB
                .map(
                  (user) =>
                    `<li>${user.Name} (${user.Tier} ${user.TierRank}) - 
                    ${[1, 2, 3, 4, 5]
                      .map((i) => user[`Position${i}`] || "")
                      .filter(Boolean)
                      .join(", ")}</li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
        <div class="mmr-diff">MMR 차이: ${result.mmrDiff}</div>
      </div>
    `
    )
    .join("");
}

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
// 페이지 로드 시 유저 데이터를 가져오기
fetchUsers();
