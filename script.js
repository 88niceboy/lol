// 사람 이름 배열
const people = [
    "도연", "근영", "현석", "영준", "현준", "주형", "민지", "수연", "지훈", "예린",
    "동현", "성민", "하윤", "서연", "지수", "민준", "지호", "채원", "다은", "유진",
    "은우", "유리", "현우", "서준", "지원", "예준", "시윤", "지안", "태민", "수현",
    "진우", "지민", "서율", "하린", "윤서", "주원", "아린", "세영", "승현", "은지",
    "해린", "우진", "현서", "지후", "예림", "다인", "서현", "윤호", "정우", "연우"
  ];
  
  // DOM 요소
  const peopleGrid = document.getElementById("peopleGrid");
  const selectedGroups = document.getElementById("selectedGroups");
  const teamButton = document.getElementById("teamButton");
  
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
    // 중복 선택 방지
    if (selectedPeople.includes(person)) return;
  
    // 선택된 사람 리스트에 추가
    selectedPeople.push(person);
  
    // 좌측에서 선택된 카드 스타일 변경
    cardElement.classList.add("selected");
  
    // 5명씩 그룹으로 나누어 우측에 추가
    updateSelectedGroups();
  
    // 버튼 활성화
    if (selectedPeople.length >= 10) {
      teamButton.disabled = false;
    }
  }
  
  // 선택된 사람 그룹 업데이트
  function updateSelectedGroups() {
    selectedGroups.innerHTML = ''; // 기존 그룹을 비웁니다
  
    // 5명씩 그룹으로 나누기
    const groups = [];
    for (let i = 0; i < selectedPeople.length; i += 5) {
      groups.push(selectedPeople.slice(i, i + 5));
    }
  
    // 그룹을 우측에 표시
    groups.forEach(group => {
      const groupContainer = document.createElement("div");
      groupContainer.className = "group";
  
      const groupList = document.createElement("ul");
      group.forEach(person => {
        const li = document.createElement("li");
        li.textContent = person;
        groupList.appendChild(li);
      });
  
      groupContainer.appendChild(groupList);
      selectedGroups.appendChild(groupContainer);
    });
  }
  
  // 팀 나누기 버튼 이벤트
  teamButton.addEventListener("click", () => {
    if (selectedPeople.length < 10) return;
  
    // 랜덤으로 팀 나누기
    const shuffled = [...selectedPeople].sort(() => Math.random() - 0.5);
    const teamA = shuffled.slice(0, shuffled.length / 2);
    const teamB = shuffled.slice(shuffled.length / 2);
  
    // 팀 결과 출력
    alert(`팀 나누기 결과:\n\n팀 A: ${teamA.join(", ")}\n팀 B: ${teamB.join(", ")}`);
  });
  