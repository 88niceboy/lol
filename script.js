const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL
const TEAM_GENERATOR_URL = `${API_URL}/team-generator`; // 팀 생성 엔드포인트

// DOM 요소
const peopleGrid = document.getElementById("peopleGrid");
const selectedGroups = document.getElementById("selectedGroups");
const teamButton = document.createElement("button");
teamButton.textContent = "Make Teams";
teamButton.className = "custom-button"; // 스타일 적용
teamButton.disabled = true; // 기본적으로 비활성화
const teamDisplay = document.getElementById("teamDisplay");

// 선택된 사람 리스트
const selectedPeople = [];

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
    const users = Array.isArray(data) ? data : [data];
    populateUsers(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// 사람 카드 생성
function populateUsers(users) {
  users.forEach((user) => {
    const button = document.createElement("button");
    button.className = "custom-button";
    button.innerHTML = `
      <img src="https://via.placeholder.com/40" alt="User Icon">
      <span>${user.Name}</span>
    `;
    button.addEventListener("click", () => selectPerson(user.Name, button));
    peopleGrid.appendChild(button);
  });
}

// 사람 선택 이벤트
function selectPerson(person, buttonElement) {
  if (selectedPeople.includes(person)) {
    selectedPeople.splice(selectedPeople.indexOf(person), 1);
    buttonElement.classList.remove("selected");
  } else {
    selectedPeople.push(person);
    buttonElement.classList.add("selected");
  }

  updateSelectedGroups();

  teamButton.disabled = selectedPeople.length !== 10; // 정확히 10명이 선택되어야 활성화
}

// 선택된 사람 그룹 업데이트
function updateSelectedGroups() {
  selectedGroups.innerHTML = '<div class="group-title">선택한 인원</div>';
  selectedPeople.forEach((person) => {
    const button = document.createElement("button");
    button.className = "custom-button selected";
    button.innerHTML = `
      <img src="https://via.placeholder.com/40" alt="User Icon">
      <span>${person}</span>
    `;
    button.addEventListener("click", () => selectPerson(person, button));
    selectedGroups.appendChild(button);
  });

  selectedGroups.appendChild(teamButton);
}

// 팀 나누기 버튼 이벤트 (백엔드 POST 요청)
// 팀 나누기 버튼 이벤트 (백엔드 POST 요청)
teamButton.addEventListener("click", async () => {
  if (selectedPeople.length !== 10) return; // 10명이 선택되지 않으면 실행하지 않음

  try {
    const response = await fetch(TEAM_GENERATOR_URL, {
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

    // 팀 결과 표시
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
                  (user) => `
                <li class="user-info">
                  <div class="user-name">${user.Name} (${user.Tier})</div>
                  <div class="user-positions">
                    Positions: 
                    ${user.Position1 || "N/A"}, 
                    ${user.Position2 || "N/A"}, 
                    ${user.Position3 || "N/A"}, 
                    ${user.Position4 || "N/A"}, 
                    ${user.Position5 || "N/A"}
                  </div>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
          <div class="team">
            <h4>Team B</h4>
            <ul>
              ${result.teamB
                .map(
                  (user) => `
                <li class="user-info">
                  <div class="user-name">${user.Name} (${user.Tier})</div>
                  <div class="user-positions">
                    Positions: 
                    ${user.Position1 || "N/A"}, 
                    ${user.Position2 || "N/A"}, 
                    ${user.Position3 || "N/A"}, 
                    ${user.Position4 || "N/A"}, 
                    ${user.Position5 || "N/A"}
                  </div>
                </li>
              `
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
  } catch (error) {
    console.error("Error generating teams:", error);
    teamDisplay.innerHTML = `<div class="error">팀 생성 실패: ${error.message}</div>`;
  }
});


// 페이지 로드 시 유저 데이터를 가져오기
fetchUsers();
