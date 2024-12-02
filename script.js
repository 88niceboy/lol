// // 사람 이름 배열
// const people = [
//   "도연", "근영", "현석", "날영준", "현준", "주형", "병욱", "재호", "현기", "희수",
//   "기환", "상준", "문창", "용선", "연수", "한규", "주필", "승엽", "형석", "수민",
//   "정민", "웅기", "민석", "유준", "찬우", "진엽", "영진", "반영준", "형렬", "상준",
//   "동현", "재복", "한훈"
// ];

// // DOM 요소
// const peopleGrid = document.getElementById("peopleGrid");
// const selectedGroups = document.getElementById("selectedGroups");
// const teamButton = document.createElement("button");
// teamButton.textContent = "Make Teams";
// teamButton.disabled = true; // 기본적으로 비활성화
// const teamDisplay = document.getElementById("teamDisplay");

// // 선택된 사람 리스트
// const selectedPeople = [];

// // 사람 카드 생성
// people.forEach(person => {
//   const card = document.createElement("div");
//   card.className = "card";
//   card.textContent = person;
//   card.addEventListener("click", () => selectPerson(person, card));
//   peopleGrid.appendChild(card);
// });

// // 사람 선택 이벤트
// function selectPerson(person, cardElement) {
//   // 선택된 카드가 이미 selected 상태라면, 선택 해제
//   if (selectedPeople.includes(person)) {
//     // 선택 해제
//     selectedPeople.splice(selectedPeople.indexOf(person), 1);
//     cardElement.classList.remove("selected"); // 선택 해제 시 스타일 변경
//   } else {
//     // 선택
//     selectedPeople.push(person);
//     cardElement.classList.add("selected"); // 선택 시 스타일 변경
//   }

//   // 우측 영역 업데이트
//   updateSelectedGroups();

//   // 버튼 활성화
//   if (selectedPeople.length >= 10) {
//     teamButton.disabled = false;
//   } else {
//     teamButton.disabled = true;
//   }
// }

// // 선택된 사람 그룹 업데이트
// function updateSelectedGroups() {
//   selectedGroups.innerHTML = '<div class="group-title">선택한 인원</div>'; // 제목 고정
//   // 선택된 사람을 카드 형태로 우측 영역에 추가
//   selectedPeople.forEach(person => {
//     const card = document.createElement("div");
//     card.className = "card selected"; // 선택된 카드 스타일
//     card.textContent = person;
//     selectedGroups.appendChild(card);
//   });

//   // "Make Teams" 버튼을 우측 영역에 추가
//   selectedGroups.appendChild(teamButton);
// }

// // 팀 나누기 버튼 이벤트
// teamButton.addEventListener("click", () => {
//   if (selectedPeople.length < 10) return;

//   // 랜덤으로 팀 나누기
//   const shuffled = [...selectedPeople].sort(() => Math.random() - 0.5);
//   const teamA = shuffled.slice(0, 5);
//   const teamB = shuffled.slice(5, 10);

//   // 팀 결과 출력
//   teamDisplay.innerHTML = `
//     <div class="team-a team-members">
//       <div class="team-name">팀 A</div>
//       <div>${teamA.join(", ")}</div>
//     </div>
//     <div class="vs">VS</div>
//     <div class="team-b team-members">
//       <div class="team-name">팀 B</div>
//       <div>${teamB.join(", ")}</div>
//     </div>
//   `;
// });

// 백엔드 API URL
const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL

// DOM 요소
const peopleGrid = document.getElementById("peopleGrid");
const selectedGroups = document.getElementById("selectedGroups");
const teamButton = document.createElement("button");
teamButton.textContent = "Make Teams";
teamButton.disabled = true; // 기본적으로 비활성화
const teamDisplay = document.getElementById("teamDisplay");

// 선택된 사람 리스트
const selectedPeople = [];

// 유저 데이터를 백엔드에서 가져오기
// async function fetchUsers() {
//   try {
//     const response = await fetch(API_URL, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }); // 백엔드에서 유저 데이터를 가져옴
//     if (!response.ok) {
//       throw new Error(`Failed to fetch users: ${response.statusText}`);
//     }
//     const users = await response.json();
//     populateUsers(users); // 유저 데이터를 페이지에 표시
//   } catch (error) {
//     console.error("Error fetching users:", error);
//   }
// }

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
    console.log("Fetched users:", data); // 응답 데이터 구조 확인

    // 데이터를 배열로 변환
    const users = Array.isArray(data) ? data : [data]; // 배열이 아니라면 배열로 변환
    console.log("Processed users:", users);

    populateUsers(users); // 유저 데이터를 페이지에 표시
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// 사람 카드 생성
function populateUsers(users) {
  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = user.name; // 백엔드에서 가져온 유저 이름 사용
    card.addEventListener("click", () => selectPerson(user.name, card));
    peopleGrid.appendChild(card);
  });
}

// 사람 선택 이벤트
function selectPerson(person, cardElement) {
  // 선택된 카드가 이미 selected 상태라면, 선택 해제
  if (selectedPeople.includes(person)) {
    // 선택 해제
    selectedPeople.splice(selectedPeople.indexOf(person), 1);
    cardElement.classList.remove("selected"); // 선택 해제 시 스타일 변경
  } else {
    // 선택
    selectedPeople.push(person);
    cardElement.classList.add("selected"); // 선택 시 스타일 변경
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
    const card = document.createElement("div");
    card.className = "card selected"; // 선택된 카드 스타일
    card.textContent = person;
    selectedGroups.appendChild(card);
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
