const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL
const LOGIN_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users/login"; // 로그인 URL
const VOTE_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/vote"; // 투표 관련 API URL

// DOM 요소
const loginButton = document.getElementById("loginButton");
const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("loginForm");
const closeLoginModal = document.getElementById("closeLoginModal");

// 로그인 상태 확인 및 버튼 텍스트 변경
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (isLoggedIn) {
    loginButton.textContent = "로그아웃";
  }

  // 페이지별 초기화
  if (window.location.pathname.includes("index.html")) {
    fetchUsers();
  } else if (window.location.pathname.includes("vote.html")) {
    initializeVotePage();
  }
});

// 로그인 버튼 클릭 이벤트
loginButton.addEventListener("click", () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (isLoggedIn) {
    // 로그아웃 처리
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userLolId");
    alert("로그아웃되었습니다.");
    loginButton.textContent = "로그인";
  } else {
    // 로그인 모달 열기
    loginModal.style.display = "flex";
  }
});

// 로그인 폼 제출 이벤트
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // 입력된 ID와 Password 가져오기
  const id = document.getElementById("loginId").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    // 백엔드로 로그인 요청
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // 로그인 성공 처리
      localStorage.setItem("loggedIn", true);
      localStorage.setItem("userName", id);
      localStorage.setItem("userLolId", data.lolId); // 백엔드에서 lolId 제공
      alert(`${id}님, 로그인 성공!`);
      loginButton.textContent = "로그아웃";
      loginModal.style.display = "none";
    } else {
      // 로그인 실패 처리
      alert(data.message || "로그인 실패. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }
});

// 모달 닫기 이벤트
closeLoginModal.addEventListener("click", () => {
  loginModal.style.display = "none";
});

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
    populateUsers(data); // 사용자 데이터를 화면에 표시
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// 사람 카드 생성
function populateUsers(users) {
  const peopleGrid = document.getElementById("peopleGrid");
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.className = "user-card";

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
  const selectedGroups = document.getElementById("selectedGroups");
  const selectedPeople = selectedGroups.dataset.selectedPeople ? JSON.parse(selectedGroups.dataset.selectedPeople) : [];

  if (selectedPeople.includes(person)) {
    // 선택 취소
    selectedGroups.dataset.selectedPeople = JSON.stringify(selectedPeople.filter((p) => p !== person));
    buttonElement.classList.remove("selected");
  } else {
    // 선택 추가
    selectedPeople.push(person);
    selectedGroups.dataset.selectedPeople = JSON.stringify(selectedPeople);
    buttonElement.classList.add("selected");
  }

  updateSelectedGroups();
}

// 선택된 사람 그룹 업데이트
function updateSelectedGroups() {
  const selectedGroups = document.getElementById("selectedGroups");
  const selectedPeople = JSON.parse(selectedGroups.dataset.selectedPeople || "[]");

  selectedGroups.innerHTML = '<div class="group-title">선택한 인원</div>';
  selectedPeople.forEach((person) => {
    const button = document.createElement("button");
    button.className = "custom-button selected";
    button.textContent = person;
    selectedGroups.appendChild(button);
  });
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

  return tierImages[tier] || "https://raw.githubusercontent.com/88niceboy/lol/main/image/iron.png"; // 기본값은 아이언
}

// 투표 초기화
function initializeVotePage() {
  const voteContainer = document.getElementById("vote-container");
  const voteTitle = document.getElementById("vote-title");
  const voteOptions = document.getElementById("vote-options");
  const submitVoteButton = document.getElementById("submit-vote");
  const voteStatusList = document.getElementById("vote-status-list");

  const user = {
    Name: localStorage.getItem("userName"),
    LolId: localStorage.getItem("userLolId"),
  };

  if (!user.Name || !user.LolId) {
    alert("로그인이 필요합니다.");
    window.location.href = "index.html";
    return;
  }

  const today = new Date();
  const date = today.toLocaleDateString();
  voteTitle.innerText = `오늘의 투표 (${date})`;

  const times = [];
  for (let hour = 12; hour <= 23; hour++) {
    times.push(`${hour}:00`);
    times.push(`${hour}:30`);
  }
  times.push("24:00");

  times.forEach((time) => {
    const option = document.createElement("div");
    option.classList.add("vote-option");
    option.innerText = time;

    if (time === "21:30") {
      option.classList.add("peak-time");
    }

    option.addEventListener("click", () => {
      document.querySelectorAll(".vote-option").forEach((el) => el.classList.remove("selected"));
      option.classList.add("selected");
      submitVoteButton.disabled = false;
    });

    voteOptions.appendChild(option);
  });

  submitVoteButton.addEventListener("click", async () => {
    const selectedOption = document.querySelector(".vote-option.selected");
    if (!selectedOption) return;

    const voteData = {
      userName: user.Name,
      userLolId: user.LolId,
      selectedTime: selectedOption.innerText,
    };

    try {
      const response = await fetch(VOTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voteData),
      });

      if (response.ok) {
        alert("투표가 성공적으로 제출되었습니다!");
        fetchVoteStatus(voteStatusList);
        submitVoteButton.disabled = true;
      } else {
        alert("투표 제출 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
  });

  fetchVoteStatus(voteStatusList);
}

// 투표 상태 조회
async function fetchVoteStatus(voteStatusList) {
  try {
    const response = await fetch(`${VOTE_URL}/status`, { method: "GET" });
    if (!response.ok) throw new Error("Failed to fetch vote status");

    const votes = await response.json();
    voteStatusList.innerHTML = "";

    if (votes.length === 0) {
      voteStatusList.innerHTML = "<li>아직 투표된 항목이 없습니다.</li>";
      return;
    }

    votes.forEach((vote) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${vote.SelectedTime} - ${vote.UserName}`;
      voteStatusList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching vote status:", error);
    voteStatusList.innerHTML = "<li>투표 상태를 불러오는 중 문제가 발생했습니다.</li>";
  }
}
