const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL

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
      <img src="https://via.placeholder.com/20" alt="User Icon">
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

  teamButton.disabled = selectedPeople.length < 10;
}

// 선택된 사람 그룹 업데이트
function updateSelectedGroups() {
  selectedGroups.innerHTML = '<div class="group-title">선택한 인원</div>';
  selectedPeople.forEach((person) => {
    const button = document.createElement("button");
    button.className = "custom-button selected";
    button.innerHTML = `
      <img src="https://via.placeholder.com/20" alt="User Icon">
      <span>${person}</span>
    `;
    button.addEventListener("click", () => selectPerson(person, button));
    selectedGroups.appendChild(button);
  });

  selectedGroups.appendChild(teamButton);
}

// 팀 나누기 버튼 이벤트
teamButton.addEventListener("click", () => {
  if (selectedPeople.length < 10) return;

  const shuffled = [...selectedPeople].sort(() => Math.random() - 0.5);
  const teamA = shuffled.slice(0, 5);
  const teamB = shuffled.slice(5, 10);

  teamDisplay.innerHTML = `
    <div class="team-a team-members">
      <div class="team-name">팀 A</div>
      <div>${teamA.join(", ")}</div>
    </div>
    <div class="vs">VS</div>
    <div class="team-b team-members">
      <div class="team-name">팀 B</div>
      <div>${teamB.join(", ")}</div>
    </div>
  `;
});

// 페이지 로드 시 유저 데이터를 가져오기
fetchUsers();
