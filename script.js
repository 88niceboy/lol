// 사람 이름 배열
const people = [
  "도연", "근영", "현석", "날영준", "현준", "주형", "병욱", "재호", "현기", "희수",
  "기환", "상준", "문창", "용선", "연수", "한규", "주필", "승엽", "형석", "수민",
  "정민", "웅기", "민석", "유준", "찬우", "진엽", "영진", "반영준", "형렬", "상준",
  "동현", "재복", "한훈"
];

// DOM 요소
const peopleGrid = document.getElementById("peopleGrid");
const selectedGroups = document.getElementById("selectedGroups");
const teamButton = document.createElement("button");
teamButton.textContent = "Make Teams";
teamButton.disabled = true; // 기본적으로 비활성화
const teamDisplay = document.getElementById("teamDisplay");

// 선택된 사람 리스트
const selectedPeople = [];

// 사람 카드 생성
people.forEach(person => {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = person;
  card.addEventListener("click", () => selectPerson(person, card));
  peopleGrid.appendChild(card);
});

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
  selectedPeople.forEach(person => {
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
