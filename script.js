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
// loginForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   // 입력된 ID와 Password 가져오기
//   const id = document.getElementById("loginId").value.trim();
//   const password = document.getElementById("loginPassword").value.trim();

//   try {
//     // 백엔드로 로그인 요청
//     const response = await fetch(LOGIN_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ id, password }),
//     });

//     const data = await response.json();
//     console.log("Data : ", data.data.LolId)
//     if (response.ok && data.success) {
//       // 로그인 성공 처리
//       localStorage.setItem("loggedIn", true);
//       localStorage.setItem("userName", data.data.Name); // 백엔드에서 Name 제공
//       localStorage.setItem("userLolId", data.data.LolId); // LolId 저장
//       alert(`${data.data.Name}님, 로그인 성공!`);
//       loginButton.textContent = "로그아웃";
//       loginModal.style.display = "none";
//     } else {
//       // 로그인 실패 처리
//       alert(data.error || "로그인 실패. 다시 시도해주세요.");
//     }
//   } catch (error) {
//     console.error("로그인 요청 실패:", error);
//     alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
//   }
// });


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


// async function initializeVotePage() {
//   const voteTitle = document.getElementById("vote-title");
//   const voteOptions = document.getElementById("vote-options");
//   const submitVoteButton = document.getElementById("submit-vote");
//   const resetVoteButton = document.getElementById("reset-vote");

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
//     const formattedDate = today.toISOString().split("T")[0];

//     // Fetch vote options
//     const response = await fetch(`${VOTE_URL}/options?date=${formattedDate}`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch vote options: ${response.statusText}`);
//     }
//     const options = await response.json();
//     if (!options || options.length === 0) {
//       throw new Error("No vote options available for today.");
//     }

//     // Fetch user's previous votes
//     const userVotesResponse = await fetch(`${VOTE_URL}/user-votes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userName: user.Name,
//         userLolId: user.LolId,
//       }),
//     });

//     const { userVotes = [], allVotes = [] } = userVotesResponse.ok
//       ? await userVotesResponse.json()
//       : { userVotes: [], allVotes: [] };

//     // Clear previous options
//     voteOptions.innerHTML = "";

//     // Populate vote options
//     options.forEach((option) => {
//       const optionElement = document.createElement("div");
//       optionElement.classList.add("vote-option");
//       optionElement.dataset.id = option.option_id;

//       // Option name
//       const optionName = document.createElement("div");
//       optionName.className = "option-name";
//       optionName.textContent = option.option_name;

//       // Current vote status
//       const currentVote = allVotes.find((vote) => vote.game_option_id === option.option_id);
//       const totalVotes = currentVote ? currentVote.total_votes : 0;

//       // Voting order
//       const votingOrder = document.createElement("div");
//       votingOrder.className = "voting-order";
//       votingOrder.innerHTML = currentVote?.voting_order
//         ? `<strong>투표 순서:</strong> ${currentVote.voting_order
//             .split(",")
//             .map((entry, index) => `<div>${index + 1}. ${entry}</div>`)
//             .join("")}`
//         : "아직 투표한 유저가 없습니다.";

//       // Append to optionElement
//       optionElement.appendChild(optionName);
//       optionElement.innerHTML += `<div>(총 투표 수: ${totalVotes})</div>`;
//       optionElement.appendChild(votingOrder);

//       // Add event listener for selecting options
//       optionElement.addEventListener("click", () =>
//         toggleVoteOption(optionElement, submitVoteButton, resetVoteButton)
//       );

//       // Highlight user's previous votes
//       if (userVotes.some((vote) => vote.game_option_id === option.option_id)) {
//         optionElement.classList.add("selected", "disabled");
//         const userVoteInfo = document.createElement("div");
//         userVoteInfo.className = "user-vote-info";
//         userVoteInfo.textContent = `당신의 순번: ${
//           userVotes.find((vote) => vote.game_option_id === option.option_id)?.vote_rank || "N/A"
//         }`;
//         optionElement.appendChild(userVoteInfo);
//       }

//       voteOptions.appendChild(optionElement);
//     });

//     // Disable submit button if user has already voted
//     submitVoteButton.disabled = userVotes.length > 0;

//     // Add event listeners for buttons
//     submitVoteButton.addEventListener("click", () => submitVotes(user, submitVoteButton));
//     resetVoteButton.addEventListener("click", () => {
//       enableVoteOptions(resetVoteButton, submitVoteButton);
//     });

//     // Ensure resetVoteButton is always enabled
//     resetVoteButton.disabled = false;
//   } catch (error) {
//     console.error("Error initializing vote page:", error);
//     alert("투표 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
//   }
// }

async function initializeVotePage() {
  const voteTitle = document.getElementById("vote-title");
  const voteOptions = document.getElementById("vote-options");
  const submitVoteButton = document.getElementById("submit-vote");
  const resetVoteButton = document.getElementById("reset-vote");

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
    const formattedDate = today.toISOString().split("T")[0];

    // Fetch vote options
    const response = await fetch(`${VOTE_URL}/options?date=${formattedDate}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vote options: ${response.statusText}`);
    }
    const options = await response.json();
    if (!options || options.length === 0) {
      throw new Error("No vote options available for today.");
    }

    // Fetch user's previous votes
    const userVotesResponse = await fetch(`${VOTE_URL}/user-votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: user.Name,
        userLolId: user.LolId,
      }),
    });

    const { userVotes = [], allVotes = [] } = userVotesResponse.ok
      ? await userVotesResponse.json()
      : { userVotes: [], allVotes: [] };

    // Clear previous options
    voteOptions.innerHTML = "";

    // Populate vote options
    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("vote-option");
      optionElement.dataset.id = option.option_id;

      // Option name
      const optionName = document.createElement("div");
      optionName.className = "option-name";
      optionName.textContent = option.option_name;

      // Current vote status
      const currentVote = allVotes.find((vote) => vote.game_option_id === option.option_id);
      const totalVotes = currentVote ? currentVote.total_votes : 0;

      // Highlight if totalVotes >= 10
      if (totalVotes >= 10) {
        optionElement.classList.add("highlight"); // 10명 이상인 경우 강조 표시
      }

      // Voting order
      const votingOrder = document.createElement("div");
      votingOrder.className = "voting-order";
      votingOrder.innerHTML = currentVote?.voting_order
        ? `<strong>투표 순서:</strong> ${currentVote.voting_order
            .split(",")
            .map((entry, index) => `<div>${index + 1}. ${entry}</div>`)
            .join("")}`
        : "아직 투표한 유저가 없습니다.";

      // Append to optionElement
      optionElement.appendChild(optionName);
      optionElement.innerHTML += `<div>(총 투표 수: ${totalVotes})</div>`;
      optionElement.appendChild(votingOrder);

      // Add event listener for selecting options
      optionElement.addEventListener("click", () =>
        toggleVoteOption(optionElement, submitVoteButton, resetVoteButton)
      );

      // Highlight user's previous votes
      if (userVotes.some((vote) => vote.game_option_id === option.option_id)) {
        optionElement.classList.add("selected", "disabled");
        const userVoteInfo = document.createElement("div");
        userVoteInfo.className = "user-vote-info";
        userVoteInfo.textContent = `당신의 순번: ${
          userVotes.find((vote) => vote.game_option_id === option.option_id)?.vote_rank || "N/A"
        }`;
        optionElement.appendChild(userVoteInfo);
      }

      voteOptions.appendChild(optionElement);
    });

    // Determine the first option to reach 10 votes
    const rankedOptions = allVotes
      .filter((vote) => vote.total_votes >= 10) // 10명 이상 만족한 항목 필터링
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // 시간 순으로 정렬

    if (rankedOptions.length > 0) {
      // 첫 번째로 10명을 만족한 항목 찾기
      const firstRankedOptionId = rankedOptions[0].game_option_id;

      // 1순위로 추가 하이라이트 표시
      const firstRankedElement = document.querySelector(
        `.vote-option[data-id="${firstRankedOptionId}"]`
      );
      if (firstRankedElement) {
        firstRankedElement.classList.add("first-ranked");
      }
    }

    // Disable submit button if user has already voted
    submitVoteButton.disabled = userVotes.length > 0;

    // Add event listeners for buttons
    submitVoteButton.addEventListener("click", () => submitVotes(user, submitVoteButton));
    resetVoteButton.addEventListener("click", () => {
      enableVoteOptions(resetVoteButton, submitVoteButton);
    });

    // Ensure resetVoteButton is always enabled
    resetVoteButton.disabled = false;
  } catch (error) {
    console.error("Error initializing vote page:", error);
    alert("투표 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
  }
}


async function initializeVotePage() {
  const voteTitle = document.getElementById("vote-title");
  const voteOptions = document.getElementById("vote-options");
  const submitVoteButton = document.getElementById("submit-vote");
  const resetVoteButton = document.getElementById("reset-vote");
  const voteDetailsContainer = document.getElementById("vote-details");

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
    const formattedDate = today.toISOString().split("T")[0];

    // Fetch vote options
    const response = await fetch(`${VOTE_URL}/options?date=${formattedDate}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vote options: ${response.statusText}`);
    }
    const options = await response.json();
    if (!options || options.length === 0) {
      throw new Error("No vote options available for today.");
    }

    // Fetch user's previous votes
    const userVotesResponse = await fetch(`${VOTE_URL}/user-votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: user.Name,
        userLolId: user.LolId,
      }),
    });

    const { userVotes = [], allVotes = [] } = userVotesResponse.ok
      ? await userVotesResponse.json()
      : { userVotes: [], allVotes: [] };

    // Clear previous options
    voteOptions.innerHTML = "";

    // Populate vote options
    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("vote-option-container", "dynamic-option-container");
      optionElement.style.display = "flex";
      optionElement.style.alignItems = "center";

      // Option content
      const optionContent = document.createElement("div");
      optionContent.classList.add("vote-option", "dynamic-option");
      optionContent.dataset.id = option.option_id;
      optionContent.style.flex = "1";

      const optionName = document.createElement("div");
      optionName.className = "option-name";
      optionName.textContent = option.option_name;

      // Add current vote count next to the option name
      const currentVote = allVotes.find((vote) => vote.game_option_id === option.option_id);
      const totalVotes = currentVote ? currentVote.total_votes : 0;

      const voteCount = document.createElement("span");
      voteCount.className = "vote-count dynamic-vote-count";
      voteCount.style.marginLeft = "10px";
      voteCount.textContent = `(${totalVotes}명 투표)`; // Add vote count text

      optionName.appendChild(voteCount);
      optionContent.appendChild(optionName);

      // Add event listener for selecting options
      optionContent.addEventListener("click", () =>
        toggleVoteOption(optionContent, submitVoteButton, resetVoteButton)
      );

      // Highlight user's previous votes
      if (userVotes.some((vote) => vote.game_option_id === option.option_id)) {
        optionContent.classList.add("selected", "disabled");
      }

      // Add "현황보기" button
      const viewStatusButton = document.createElement("button");
      viewStatusButton.textContent = "현황보기";
      viewStatusButton.className = "view-status-button dynamic-view-status-button";
      viewStatusButton.style.marginLeft = "10px";
      viewStatusButton.addEventListener("click", () =>
        showVoteDetails(option, userVotes, allVotes)
      );

      // Append option content and button
      optionElement.appendChild(optionContent);
      optionElement.appendChild(viewStatusButton);
      voteOptions.appendChild(optionElement);
    });

    // Disable submit button if user has already voted
    submitVoteButton.disabled = userVotes.length > 0;

    // Add event listeners for buttons
    submitVoteButton.addEventListener("click", () => submitVotes(user, submitVoteButton));
    resetVoteButton.addEventListener("click", () => {
      enableVoteOptions(resetVoteButton, submitVoteButton);
    });

    // Ensure resetVoteButton is always enabled
    resetVoteButton.disabled = false;
  } catch (error) {
    console.error("Error initializing vote page:", error);
    alert("투표 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
  }

  // Function to display details in the right container
  function showVoteDetails(option, userVotes, allVotes) {
    // Clear existing details
    voteDetailsContainer.innerHTML = "";

    // Option details
    const optionName = document.createElement("h3");
    optionName.textContent = option.option_name;

    // Current vote status
    const currentVote = allVotes.find((vote) => vote.game_option_id === option.option_id);
    const totalVotes = currentVote ? currentVote.total_votes : 0;

    const totalVotesText = document.createElement("p");
    totalVotesText.textContent = `총 투표 수: ${totalVotes}`;

    // Voting order
    const votingOrder = document.createElement("div");
    votingOrder.innerHTML = currentVote?.voting_order
      ? `<strong>투표 순서:</strong> ${currentVote.voting_order
          .split(",")
          .map((entry, index) => `<div>${index + 1}. ${entry}</div>`)
          .join("")}`
      : "아직 투표한 유저가 없습니다.";

    // User's vote info
    const userVote = userVotes.find((vote) => vote.game_option_id === option.option_id);
    const userVoteInfo = document.createElement("p");
    userVoteInfo.textContent = userVote
      ? `당신의 순번: ${userVote.vote_rank}`
      : "당신은 아직 투표하지 않았습니다.";

    // Append details to the container
    voteDetailsContainer.appendChild(optionName);
    voteDetailsContainer.appendChild(totalVotesText);
    voteDetailsContainer.appendChild(votingOrder);
    voteDetailsContainer.appendChild(userVoteInfo);
  }
}





function enableVoteOptions(resetVoteButton) {
  alert("다시 선택할 수 있습니다. 기존 투표 항목은 유지됩니다.");
  document.querySelectorAll(".vote-option.disabled").forEach((el) => el.classList.remove("disabled"));
  resetVoteButton.disabled = true; // 다시 초기화
}


function toggleVoteOption(option, submitVoteButton, resetVoteButton) {
  if (option.classList.contains("disabled")) return; // 비활성화된 항목은 클릭 무시

  option.classList.toggle("selected"); // 선택 상태 토글

  // 제출하기 버튼은 선택 항목이 있을 때만 활성화
  submitVoteButton.disabled = document.querySelectorAll(".vote-option.selected").length === 0;

  // 다시 투표하기 버튼은 항상 활성화
  resetVoteButton.disabled = false;
}


async function submitVotes(user, submitVoteButton) {
  // 선택된 항목의 ID 가져오기
  const selectedOptions = Array.from(document.querySelectorAll(".vote-option.selected")).map((el) => el.dataset.id);

  if (selectedOptions.length === 0) {
    alert("투표할 항목을 선택해주세요.");
    return;
  }

  try {
    console.log("Submit payload:", { userName: user.Name, userLolId: user.LolId, votes: selectedOptions });

    // 서버에 보낼 데이터 생성
    const payload = {
      userName: user.Name,
      userLolId: user.LolId,
      votes: selectedOptions,
    };

    // POST 요청으로 데이터 전송
    const response = await fetch(`${VOTE_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("투표가 성공적으로 제출되었습니다!");

      // 선택된 옵션 비활성화
      document.querySelectorAll(".vote-option.selected").forEach((el) => {
        el.classList.add("disabled");
        el.classList.remove("selected");
      });

      // 제출하기 버튼 비활성화
      submitVoteButton.disabled = true;

      initializeVotePage()
    } else {
      console.error("Error submitting votes:", result.error || "Unknown error");
      alert(result.error || "투표 제출에 실패했습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("Error submitting votes:", error);
    alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }
}

function enableVoteOptions(resetVoteButton, submitVoteButton) {
  alert("다시 선택할 수 있습니다.");

  // 비활성화된 항목 다시 활성화
  document.querySelectorAll(".vote-option.disabled").forEach((el) => el.classList.remove("disabled"));

  // 제출하기 버튼 활성화
  submitVoteButton.disabled = false;

  // 다시 투표하기 버튼은 항상 활성화
  resetVoteButton.disabled = false;
}

// 버튼 상태 업데이트
function updateButtonStates(submitVoteButton, resetVoteButton) {
  const hasSelection = document.querySelectorAll(".vote-option.selected").length > 0;
  submitVoteButton.disabled = !hasSelection;
  resetVoteButton.disabled = !hasSelection;
}

