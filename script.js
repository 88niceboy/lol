// 이름 배열
const names = [
    "도연", "근영", "현석", "영준", "현준", "주형", "민지", "수연", "지훈", "예린",
    "동현", "성민", "하윤", "서연", "지수", "민준", "지호", "채원", "다은", "유진",
    "은우", "유리", "현우", "서준", "지원", "예준", "시윤", "지안", "태민", "수현",
    "진우", "지민", "서율", "하린", "윤서", "주원", "아린", "세영", "승현", "은지",
    "해린", "우진", "현서", "지후", "예림", "다인", "서현", "윤호", "정우", "연우"
  ];
  
  // DOM 요소
  const nameList = document.getElementById("nameList");
  const selectedList = document.getElementById("selectedList");
  const teamButton = document.getElementById("teamButton");
  
  // 선택된 사람 리스트
  const selectedNames = [];
  
  // 이름 리스트 생성
  names.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("click", () => selectName(name, li));
    nameList.appendChild(li);
  });
  
  // 이름 선택 이벤트
  function selectName(name, liElement) {
    // 중복 선택 방지
    if (selectedNames.includes(name)) return;
  
    // 선택 리스트에 추가
    selectedNames.push(name);
  
    // 선택된 이름을 우측 리스트에 추가
    const selectedLi = document.createElement("li");
    selectedLi.textContent = name;
    selectedList.appendChild(selectedLi);
  
    // 좌측 리스트에서 제거
    nameList.removeChild(liElement);
  
    // 버튼 활성화
    if (selectedNames.length === 10 || selectedNames.length === 20) {
      teamButton.disabled = false;
    }
  }
  
  // 팀 나누기 버튼 클릭 이벤트
  teamButton.addEventListener("click", () => {
    if (selectedNames.length < 10) return;
  
    // 랜덤으로 5:5 팀 나누기
    const shuffled = [...selectedNames].sort(() => Math.random() - 0.5);
    const teamA = shuffled.slice(0, 5);
    const teamB = shuffled.slice(5, 10);
  
    // 팀 결과 출력
    alert(`팀 나누기 결과:\n\n팀 A: ${teamA.join(", ")}\n팀 B: ${teamB.join(", ")}`);
  });
  