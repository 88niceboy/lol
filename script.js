const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL
const LOGIN_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users/login"; // 로그인 URL
const VOTE_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/votes"; // 기본 URL로 수정


// DOM 요소
const peopleGrid = document.getElementById("peopleGrid");
const selectedGroups = document.getElementById("selectedGroups");
const teamButton = document.createElement("button");
teamButton.textContent = "팀 뽑기";
teamButton.className = "make-team-button";
teamButton.disabled = true;
const teamDisplay = document.getElementById("teamDisplay");
const loginButton = document.getElementById("loginButton");
const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("loginForm");
const closeLoginModal = document.getElementById("closeLoginModal");


// DOM 요소
const voteTitle = document.getElementById("vote-title");
const voteOptions = document.getElementById("vote-options");
const submitVoteButton = document.getElementById("submit-vote");
const voteStatusList = document.getElementById("vote-status-list");
const resetVoteButton = document.createElement("button");

resetVoteButton.id = "reset-vote";
resetVoteButton.textContent = "다시 투표하기";
//document.getElementById("vote-container").appendChild(resetVoteButton);

// 선택된 사람 리스트
const selectedPeople = [];
let users = [];

// 로그인 상태 확인 및 버튼 텍스트 변경
document.addEventListener("DOMContentLoaded", () => {
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
    console.log("Fetched users:", data)
    users = data; // 유저 데이터를 전역 변수에 저장
    populateUsers(data); // 사용자 데이터를 화면에 표시
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// 사람 카드 생성
function populateUsers(users) {
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
  if (selectedPeople.includes(person)) {
    selectedPeople.splice(selectedPeople.indexOf(person), 1);
    buttonElement.classList.remove("selected");
  } else {
    selectedPeople.push(person);
    buttonElement.classList.add("selected");
  }

  updateSelectedGroups();
  teamButton.disabled = selectedPeople.length !== 10; // 팀뽑기 버튼 활성화 조건
}

// 선택된 사람 그룹 업데이트
function updateSelectedGroups() {
  selectedGroups.innerHTML = '<div class="group-title">선택한 인원</div>';

  selectedPeople.forEach((person) => {
    const user = users.find((u) => u.Name === person);
    if (!user) return;

    const button = document.createElement("button");
    button.className = "custom-button selected";

    const tierImage = getTierImage(user.Tier);
    button.innerHTML = `
      <img src="${tierImage}" alt="${user.Tier} Icon">
      <span>${user.Name}</span>
    `;

    selectedGroups.appendChild(button);
  });

  if (!document.querySelector(".make-team-button")) {
    selectedGroups.appendChild(teamButton);
  }
}

// 팀 나누기 버튼 이벤트
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
// function initializeVotePage() {
//   const voteContainer = document.getElementById("vote-container");
//   const voteTitle = document.getElementById("vote-title");
//   const voteOptions = document.getElementById("vote-options");
//   const submitVoteButton = document.getElementById("submit-vote");
//   const voteStatusList = document.getElementById("vote-status-list");

//   const user = {
//     Name: localStorage.getItem("userName"),
//     LolId: localStorage.getItem("userLolId"),
//   };

//   if (!user.Name || !user.LolId) {
//     alert("로그인이 필요합니다.");
//     window.location.href = "index.html";
//     return;
//   }

//   const today = new Date();
//   const date = today.toLocaleDateString();
//   voteTitle.innerText = `오늘의 투표 (${date})`;

//   const times = [];
//   for (let hour = 12; hour <= 23; hour++) {
//     times.push(`${hour}:00`);
//     times.push(`${hour}:30`);
//   }
//   times.push("24:00");

//   times.forEach((time) => {
//     const option = document.createElement("div");
//     option.classList.add("vote-option");
//     option.innerText = time;

//     if (time === "21:30") {
//       option.classList.add("peak-time");
//     }

//     option.addEventListener("click", () => {
//       // 중복 투표 가능하도록 선택 상태 토글
//       if (option.classList.contains("selected")) {
//         option.classList.remove("selected");
//       } else {
//         option.classList.add("selected");
//       }
//       submitVoteButton.disabled = document.querySelectorAll(".vote-option.selected").length === 0;
//     });

//     voteOptions.appendChild(option);
//   });

//   submitVoteButton.addEventListener("click", async () => {
//     const selectedOptions = Array.from(document.querySelectorAll(".vote-option.selected")).map(
//       (el) => el.innerText
//     );

//     if (selectedOptions.length === 0) return;

//     const voteData = {
//       userName: user.Name,
//       userLolId: user.LolId,
//       selectedTimes: selectedOptions, // 여러 항목 전송
//     };

//     try {
//       const response = await fetch(VOTE_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(voteData),
//       });

//       if (response.ok) {
//         alert("투표가 성공적으로 제출되었습니다!");
//         fetchVoteStatus(voteStatusList);
//         document.querySelectorAll(".vote-option.selected").forEach((el) => el.classList.remove("selected"));
//         submitVoteButton.disabled = true;
//       } else {
//         alert("투표 제출 중 문제가 발생했습니다.");
//       }
//     } catch (error) {
//       console.error("Error submitting vote:", error);
//       alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
//     }
//   });

//   fetchVoteStatus(voteStatusList);
// }

// 투표 초기화
// 투표 초기화
// async function initializeVotePage() {
//   const voteTitle = document.getElementById("vote-title");
//   const voteOptions = document.getElementById("vote-options");
//   const submitVoteButton = document.getElementById("submit-vote");
//   const voteStatusList = document.getElementById("vote-status-list");
//   const resetVoteButton = document.createElement("button");

//   const voteContainer = document.getElementById("vote-container");
//   if (voteContainer) {
//     resetVoteButton.id = "reset-vote";
//     resetVoteButton.textContent = "다시 투표하기";
//     voteContainer.appendChild(resetVoteButton);
//   }

//   const user = {
//     Name: localStorage.getItem("userName"),
//     LolId: localStorage.getItem("userLolId"),
//   };

//   if (!user.Name || !user.LolId) {
//     alert("로그인이 필요합니다.");
//     window.location.href = "index.html";
//     return;
//   }

//   const today = new Date();
//   const date = today.toLocaleDateString();
//   voteTitle.innerText = `오늘의 투표 (${date})`;

//   try {
//     const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
//     const response = await fetch(`${VOTE_URL}/options?date=${formattedDate}`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch vote options: ${response.statusText}`);
//     }

//     const options = await response.json();

//     if (!options || options.length === 0) {
//       throw new Error("No vote options available for today.");
//     }

//     voteOptions.innerHTML = ""; // 기존 내용을 초기화
//     options.forEach((option) => {
//       const optionElement = document.createElement("div");
//       optionElement.classList.add("vote-option");
//       optionElement.innerText = option.option_name;

//       // 선택 이벤트 추가
//       optionElement.addEventListener("click", () => toggleVoteOption(optionElement, submitVoteButton));
//       voteOptions.appendChild(optionElement);
//     });

//     // 버튼 이벤트 추가
//     submitVoteButton.addEventListener("click", () => submitVotes(user, submitVoteButton));
//     resetVoteButton.addEventListener("click", () => enableVoteOptions());

//     // 투표 상태 조회
//     fetchVoteStatus(voteStatusList);
//   } catch (error) {
//     console.error("Error initializing vote page:", error);
//     alert("투표 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
//   }
// }

// async function initializeVotePage() {
//   const voteTitle = document.getElementById("vote-title");
//   const voteOptions = document.getElementById("vote-options");
//   const submitVoteButton = document.getElementById("submit-vote");
//   const voteStatusList = document.getElementById("vote-status-list");
//   const resetVoteButton = document.createElement("button");

//   const voteContainer = document.getElementById("vote-container");
//   if (voteContainer) {
//     resetVoteButton.id = "reset-vote";
//     resetVoteButton.textContent = "다시 투표하기";
//     voteContainer.appendChild(resetVoteButton);
//   }

//   const user = {
//     Name: localStorage.getItem("userName"),
//     LolId: localStorage.getItem("userLolId"),
//   };

//   if (!user.Name || !user.LolId) {
//     alert("로그인이 필요합니다.");
//     window.location.href = "index.html";
//     return;
//   }

//   const today = new Date();
//   const date = today.toLocaleDateString();
//   voteTitle.innerText = `오늘의 투표 (${date})`;

//   try {
//     const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
//     const response = await fetch(`${VOTE_URL}/options?date=${formattedDate}`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch vote options: ${response.statusText}`);
//     }

//     const options = await response.json();

//     if (!options || options.length === 0) {
//       throw new Error("No vote options available for today.");
//     }

//     // 기존 내용을 초기화
//     voteOptions.innerHTML = ""; 

//     // 여기에 새로운 코드 삽입
//     options.forEach((option) => {
//       const optionElement = document.createElement("div");
//       optionElement.classList.add("vote-option");
//       optionElement.innerText = option.option_name;
//       optionElement.dataset.id = option.option_id; // id 저장

//       // 선택 이벤트 추가
//       optionElement.addEventListener("click", () => toggleVoteOption(optionElement, submitVoteButton));
//       voteOptions.appendChild(optionElement);
//     });

//     // 버튼 이벤트 추가
//     submitVoteButton.addEventListener("click", () => submitVotes(user, submitVoteButton));
//     resetVoteButton.addEventListener("click", () => enableVoteOptions());

//     // 투표 상태 조회
//     fetchVoteStatus(voteStatusList);
//   } catch (error) {
//     console.error("Error initializing vote page:", error);
//     alert("투표 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
//   }
// }

async function initializeVotePage() {
  const voteTitle = document.getElementById("vote-title");
  const voteOptions = document.getElementById("vote-options");
  const submitVoteButton = document.getElementById("submit-vote");
  const voteStatusList = document.getElementById("vote-status-list");
  const resetVoteButton = document.createElement("button");

  const voteContainer = document.getElementById("vote-container");
  if (voteContainer) {
    resetVoteButton.id = "reset-vote";
    resetVoteButton.textContent = "다시 투표하기";
    voteContainer.appendChild(resetVoteButton);
  }

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

  try {
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

    // 투표 옵션 가져오기
    const response = await fetch(`${VOTE_URL}/options?date=${formattedDate}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vote options: ${response.statusText}`);
    }
    const options = await response.json();
    if (!options || options.length === 0) {
      throw new Error("No vote options available for today.");
    }

    // 기존 내용을 초기화
    voteOptions.innerHTML = "";

    // 투표 항목 생성
    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("vote-option");
      optionElement.innerText = option.option_name;
      optionElement.dataset.id = option.option_id; // id 저장

      // 선택 이벤트 추가
      optionElement.addEventListener("click", () => toggleVoteOption(optionElement, submitVoteButton));
      voteOptions.appendChild(optionElement);
    });

    // 사용자가 투표했던 항목 가져오기
    const userVotesResponse = await fetch(`${VOTE_URL}/user-votes?userName=${user.Name}&userLolId=${user.LolId}`);
    if (userVotesResponse.ok) {
      const userVotes = await userVotesResponse.json();
      userVotes.forEach((vote) => {
        const optionElement = document.querySelector(`[data-id="${vote.game_option_id}"]`);
        if (optionElement) {
          optionElement.classList.add("selected", "disabled"); // 선택된 상태로 표시
        }
      });
    }

    // 버튼 이벤트 추가
    submitVoteButton.addEventListener("click", () => submitVotes(user, submitVoteButton));
    resetVoteButton.addEventListener("click", () => enableVoteOptions());

    // 투표 상태 조회
    fetchVoteStatus(voteStatusList);
  } catch (error) {
    console.error("Error initializing vote page:", error);
    alert("투표 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
  }
}



// 투표 선택 상태 토글
function toggleVoteOption(option, submitVoteButton) {
  if (option.classList.contains("disabled")) return; // 비활성화된 항목은 클릭 무시

  option.classList.toggle("selected");
  if (option.classList.contains("peak-time")) {
    option.classList.toggle("selected-peak");
  }
  submitVoteButton.disabled = document.querySelectorAll(".vote-option.selected").length === 0;
}

// 투표 제출
// async function submitVotes(user, submitVoteButton) {
//   const selectedOptions = Array.from(document.querySelectorAll(".vote-option.selected")).map((el) => el.innerText);

//   if (selectedOptions.length === 0) {
//     alert("투표할 항목을 선택해주세요.");
//     return;
//   }

//   try {
//     const payload = {
//       userName: user.Name,
//       lolId: user.LolId, // LolId 추가
//       selectedOptions,
//     };

//     const response = await fetch(`${VOTE_URL}/submit`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload), // JSON으로 데이터를 직렬화
//     });

//     if (response.ok) {
//       alert("투표가 성공적으로 제출되었습니다!");

//       // 선택한 항목 비활성화
//       document.querySelectorAll(".vote-option.selected").forEach((el) => el.classList.add("disabled"));
//       fetchVoteStatus(document.getElementById("vote-status-list"));
//       submitVoteButton.disabled = true;
//     } else {
//       alert("투표 제출 중 문제가 발생했습니다.");
//     }
//   } catch (error) {
//     console.error("Error submitting vote:", error);
//     alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
//   }
// }
async function submitVotes(user, submitVoteButton) {
  // 선택한 항목의 ID 가져오기
  const selectedOptions = Array.from(document.querySelectorAll(".vote-option.selected")).map((el) => ({
    id: el.dataset.id, // 데이터셋에서 ID 가져오기
    name: el.innerText, // 필요 시 이름도 가져오기
  }));

  if (selectedOptions.length === 0) {
    alert("투표할 항목을 선택해주세요.");
    return;
  }

  try {
    const payload = {
      userName: user.Name,
      userLolId: user.LolId, // LolId 전달
      selectedOptions: selectedOptions.map((option) => option.id), // 옵션 ID만 전송
    };

    const response = await fetch(`${VOTE_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // JSON으로 데이터를 직렬화
    });

    if (response.ok) {
      alert("투표가 성공적으로 제출되었습니다!");

      // 선택한 항목 비활성화
      document.querySelectorAll(".vote-option.selected").forEach((el) => el.classList.add("disabled"));
      fetchVoteStatus(document.getElementById("vote-status-list"));
      submitVoteButton.disabled = true;
    } else {
      alert("투표 제출 중 문제가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error submitting vote:", error);
    alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }
}



// 투표 상태 조회
async function fetchVoteStatus(voteStatusList) {
  try {
    const response = await fetch(`${VOTE_URL}/status`);
    if (!response.ok) throw new Error("Failed to fetch vote status");

    const votes = await response.json();
    voteStatusList.innerHTML = votes.length
      ? votes.map((vote) => `<li>${vote.SelectedTime} - ${vote.UserName}</li>`).join("")
      : "<li>아직 투표된 항목이 없습니다.</li>";
  } catch (error) {
    console.error("Error fetching vote status:", error);
    voteStatusList.innerHTML = "<li>투표 상태를 불러오는 중 문제가 발생했습니다.</li>";
  }
}

// 다시 투표하기
function enableVoteOptions() {
  alert("다시 선택할 수 있습니다. 기존 투표 항목은 유지됩니다.");
  document.querySelectorAll(".vote-option.disabled").forEach((el) => el.classList.remove("disabled"));
}




// 버튼 상태 업데이트
function updateButtonStates(submitVoteButton, resetVoteButton) {
  const hasSelection = document.querySelectorAll(".vote-option.selected").length > 0;
  submitVoteButton.disabled = !hasSelection;
  resetVoteButton.disabled = !hasSelection;
}

