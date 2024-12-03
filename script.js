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

    const data = await response.json(); // 응답 데이터 가져오기
    const users = Array.isArray(data) ? data : [data]; // 배열 형태로 변환
    populateUsers(users); // 유저 데이터를 페이지에 표시
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
  // 선택된 카드가 이미 selected 상태라면, 선택 해제
  if (selectedPeople.includes(person)) {
    // 선택 해제
    selectedPeople.splice(selectedPeople.indexOf(person), 1);
    buttonElement.classList.remove("selected"); // 선택 해제 시 스타일 변경
  } else {
    // 선택
    selectedPeople.push(person);
    buttonElement.classList.add("selected"); // 선택 시 스타일 변경
  }

  // 우측 영역 업데이트
  updateSelectedGroups();

  // 버튼 활성화
  if (selectedPeople.length >= 10) {
    teamButton.disabled = false;
  } else {
    teamButton.disabled = true;
  }
}

// 선택된 사람 그룹 업데이트
function updateSelectedGroups() {
  selectedGroups.innerHTML = '<div class="group-title">선택한 인원</div>'; // 제목 고정
  // 선택된 사람을 카드 형태로 우측 영역에 추가
  selectedPeople.forEach((person) => {
    const button = document.createElement("button");
    button.className = "custom-button selected"; // 선택된 카드 스타일
    button.innerHTML = `
      <img src="https://via.placeholder.com/20" alt="User Icon">
      <span>${person}</span>
    `;
    button.addEventListener("click", () => selectPerson(person, button));
    selectedGroups.appendChild(button);
  });

  // "Make Teams" 버튼을 우측 영역에 추가
  selectedGroups.appendChild(teamButton);
}

// 팀 나누기 버튼 이벤트
teamButton.addEventListener("click", () => {
  if (selectedPeople.length < 10) return;

  // 랜덤으로 팀 나누기
  const shuffled = [...selectedPeople].sort(() => Math.random() - 0.5);
  const teamA = shuffled.slice(0, 5);
  const teamB = shuffled.slice(5, 10);

  // 팀 결과 출력
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
