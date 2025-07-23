const API_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users"; // 백엔드 URL
const LOGIN_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users/login"; // 로그인 URL
const VOTE_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/votes"; // 기본 URL로 수정
// const API_URL = "https://localhost:3000/users"; // 백엔드 URL
// const LOGIN_URL = "https://localhost:3000/users/login"; // 로그인 URL
// const VOTE_URL = "https://localhost:3000/votes"; // 기본 URL로 수정
const SAVE_URL = `${VOTE_URL}/save-game-records`;


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
let championList = [];



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




function populateNumberSelect(select) {
  for (let i = 0; i <= 30; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
}

async function loadChampions() {
  try {
    const response = await fetch(`${VOTE_URL}/champions`);
    console.log("Response status:", response.status);

    if (!response.ok) {
      // ❗ 에러일 때만 body 읽기
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      throw new Error("Failed to load champions");
    }

    // ✅ 여기서는 한 번만 body를 읽는다
    championList = await response.json();
    console.log("Champion List Loaded:", championList);
  } catch (error) {
    console.error("Error loading champions:", error);
    championList = ["아리", "가렌", "리신"];
  }
}



function createGameRecordForm() {
  const recordDiv = document.createElement("div");
  recordDiv.className = "game-record";

  const uniqueId = "id" + Date.now() + Math.floor(Math.random() * 1000);

  recordDiv.innerHTML = `
    <div class="record-row">
      <label for="date-${uniqueId}">날짜:</label>
      <input type="date" id="date-${uniqueId}" required />
    </div>
    <div class="record-row">
      <label for="match-${uniqueId}">그룹:</label>
      <select id="match-${uniqueId}">
        <option value="">선택</option>
        <option value="일반경기">일반</option>
        <option value="1그룹(상위)">1그룹</option>
        <option value="2그룹(하위)">2그룹</option>
      </select>
    </div>
    <div class="record-row">
      <label for="round-${uniqueId}">차전:</label>
      <select id="round-${uniqueId}">
        <option value="">선택</option>
        <option value="1차전">1차전</option>
        <option value="2차전">2차전</option>
        <option value="3차전">3차전</option>
        <option value="4차전">4차전</option>
        <option value="5차전">5차전</option>
      </select>
    </div>
    <div class="record-row">
      <label for="match-${uniqueId}">경기:</label>
      <select id="match-${uniqueId}">
        <option value="">선택</option>
        <option value="1경기">1경기</option>
        <option value="2경기">2경기</option>
        <option value="3경기">3경기</option>
      </select>
    </div>
    <div class="record-row">
      <label for="result-${uniqueId}">결과:</label>
      <select id="result-${uniqueId}">
        <option value="">선택</option>
        <option value="승리">승리</option>
        <option value="패배">패배</option>
      </select>
    </div>
    <div class="record-row">
      <label for="champion-${uniqueId}">챔피언:</label>
      <select id="champion-${uniqueId}">
        <option value="">선택</option>
      </select>
    </div>
    <div class="record-row">
      <label for="position-${uniqueId}">포지션:</label>
      <select id="position-${uniqueId}">
        <option value="">선택</option>
        <option value="Top">탑</option>
        <option value="Jungle">정글</option>
        <option value="Mid">미드</option>
        <option value="ADC">원딜</option>
        <option value="Support">서포터</option>
      </select>
    </div>
    <div class="record-row">
      <label>킬:</label>
      <select id="kills-${uniqueId}" class="number-select"></select>
      <label>데스:</label>
      <select id="deaths-${uniqueId}" class="number-select"></select>
      <label>어시:</label>
      <select id="assists-${uniqueId}" class="number-select"></select>
    </div>
    <button type="button" class="add-more-button" title="전적 추가">+</button>
  `;

   const championSelect = recordDiv.querySelector(`#champion-${uniqueId}`);
  championList.forEach((champ) => {
    const option = document.createElement("option");
    option.value = champ;
    option.textContent = champ;
    championSelect.appendChild(option);
  });

  populateNumberSelect(recordDiv.querySelector(`#kills-${uniqueId}`));
  populateNumberSelect(recordDiv.querySelector(`#deaths-${uniqueId}`));
  populateNumberSelect(recordDiv.querySelector(`#assists-${uniqueId}`));

  return recordDiv;
}

function populateNumberSelect(selectElement) {
  if (!selectElement) return;
  for (let i = 0; i <= 20; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectElement.appendChild(option);
  }
}

async function loadGameRecords() {
  try {
    const user = {
      Name: localStorage.getItem("userName"),
      LolId: localStorage.getItem("userLolId"),
    };

    if (!user.Name || !user.LolId) {
      alert("로그인이 필요합니다.");
      window.location.href = "index.html";
      return;
    }

    const response = await fetch(`${VOTE_URL}/user-unrecorded-games?user_name=${user.Name}&lolId=${user.LolId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch unrecorded games for user.");
    }

    const games = await response.json();
    console.log("Fetched games:", games);

    const container = document.getElementById("gameRecordsContainer");
    if (!container) {
      console.error("gameRecordsContainer not found");
      return;
    }

     try {
        const form = createGameRecordForm();
        container.appendChild(form);
      } catch (formError) {
        console.error(`Error creating form for game at index ${index}:`, formError);
      }
  } catch (error) {
    console.error("Error loading game records:", error);

    const container = document.getElementById("gameRecordsContainer");
    if (container) {
      container.innerHTML = "<p>데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</p>";
    }
  }
}

async function addNewRecord(container) {
  const form = createGameRecordForm();
  container.appendChild(form);
}

// 전적 입력 페이지 초기화 함수
async function initializeRecordPage() {
  console.log("Initializing Record Page...");
  await loadChampions();
  await loadGameRecords();

  const container = document.getElementById("gameRecordsContainer");

  // ✅ 초기 1개 폼 추가
  addNewRecord(container);

  // ✅ + 버튼 클릭 이벤트 등록
  const addMoreBtn = document.getElementById("addmorebutton");
  if (addMoreBtn) {
    addMoreBtn.addEventListener("click", () => {
      console.log("########################");
      addNewRecord(container);
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
       addMoreBtn.scrollIntoView({ behavior: "smooth", block: "end" });
       saveButton.scrollIntoView({ behavior: "smooth", block: "center" });

    });
  }


  const saveRecordsButton = document.getElementById("saveRecordsButton");
  if (saveRecordsButton) {
    saveRecordsButton.addEventListener("click", saveGameRecords);
  }
}

async function initializeVotePage() {
  const voteTitle = document.getElementById("vote-title");
  const voteOptions = document.getElementById("vote-options");

  const user = {
    Name: localStorage.getItem("userName"),
    LolId: localStorage.getItem("userLolId"),
  };

  if (!user.Name || !user.LolId) {
    alert("로그인이 필요합니다.");
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(`${VOTE_URL}/options`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vote options: ${response.statusText}`);
    }
    const options = await response.json();

    if (!options || options.length === 0) {
      throw new Error("No vote options available.");
    }

    voteTitle.innerText = `오늘의 투표`;

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

    voteOptions.innerHTML = "";

    const groupedOptions = options.reduce((acc, option) => {
      acc[option.game_name] = acc[option.game_name] || [];
      acc[option.game_name].push(option);
      return acc;
    }, {});

    Object.entries(groupedOptions).forEach(([gameName, gameOptions]) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.classList.add("vote-section");
      sectionDiv.dataset.section = gameName;

      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = gameName;
      sectionDiv.appendChild(sectionTitle);

      const sectionOptionsDiv = document.createElement("div");
      sectionOptionsDiv.classList.add("section-options");

      gameOptions.forEach((option) => {
        const isVoted = userVotes.some((vote) => vote.game_option_id === option.option_id);
        const optionElement = createVoteOption(option, allVotes, isVoted, gameName);
        sectionOptionsDiv.appendChild(optionElement);
      });

      sectionDiv.appendChild(sectionOptionsDiv);

      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "10px";
      buttonContainer.style.marginTop = "10px";

      const submitButton = document.createElement("button");
      submitButton.textContent = `${gameName} 제출하기`;
      submitButton.classList.add("submit-button");
      submitButton.disabled = false;

      const resetButton = document.createElement("button");
      resetButton.textContent = `${gameName} 다시 투표하기`;
      resetButton.classList.add("reset-button");
      resetButton.disabled = false;

      submitButton.addEventListener("click", () =>
        submitSectionVotes(user, gameOptions, sectionOptionsDiv, submitButton, resetButton)
      );

      resetButton.addEventListener("click", () =>
        enableVoteOptionsForSection(sectionOptionsDiv, submitButton, resetButton)
      );

      buttonContainer.appendChild(submitButton);
      buttonContainer.appendChild(resetButton);
      sectionDiv.appendChild(buttonContainer);

      voteOptions.appendChild(sectionDiv);
    });
  } catch (error) {
    console.error("Error initializing vote page:", error);
    alert("투표 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
  }

  function createVoteOption(option, allVotes, isVoted, sectionName) {
    const optionElement = document.createElement("div");
    optionElement.classList.add("vote-option-container");
    optionElement.style.display = "flex";
    optionElement.style.alignItems = "center";

    const optionContent = document.createElement("div");
    optionContent.classList.add("vote-option");
    optionContent.dataset.id = option.option_id;
    optionContent.dataset.section = sectionName;

    const currentVote = allVotes.find((vote) => vote.game_option_id === option.option_id);
    const totalVotes = currentVote ? currentVote.total_votes : 0;

    if (totalVotes >= 10) {
      optionContent.classList.add("highlight");
    }

    if (isVoted) {
      optionContent.classList.add("selected");
      optionContent.classList.add("disabled");
    }

    const optionName = document.createElement("div");
    optionName.textContent = option.option_name;

    const voteCount = document.createElement("span");
    voteCount.textContent = `(${totalVotes}명 투표)`;
    voteCount.classList.add("dynamic-vote-count");
    voteCount.style.marginLeft = "10px";
    voteCount.style.color = "#54e967";

    optionName.appendChild(voteCount);
    optionContent.appendChild(optionName);
    optionElement.appendChild(optionContent);

    // "현황보기" 버튼 추가
    const viewStatusButton = document.createElement("button");
    viewStatusButton.textContent = "현황보기";
    viewStatusButton.classList.add("view-status-button");
    viewStatusButton.style.marginLeft = "10px";

    viewStatusButton.addEventListener("click", () => {
      const voteDetailsContainer = document.getElementById("vote-details");
      voteDetailsContainer.innerHTML = "";

      const optionName = document.createElement("h3");
      optionName.textContent = option.option_name;

      const totalVotesText = document.createElement("p");
      totalVotesText.textContent = `총 투표 수: ${totalVotes}`;

      const votingOrder = document.createElement("div");
      votingOrder.innerHTML = currentVote?.voting_order
        ? `<strong>투표 순서:</strong> ${currentVote.voting_order
            .split(",")
            .map((entry, index) => `<div>${index + 1}. ${entry}</div>`)
            .join("")}`
        : "아직 투표한 유저가 없습니다.";

      voteDetailsContainer.appendChild(optionName);
      voteDetailsContainer.appendChild(totalVotesText);
      voteDetailsContainer.appendChild(votingOrder);
    });

    optionElement.appendChild(viewStatusButton);

    // 섹션별로 선택 상태를 관리
    optionContent.addEventListener("click", () => {
      toggleExclusiveVoteOption(optionContent, sectionName);
    });

    return optionElement;
  }

  function enableVoteOptionsForSection(sectionOptionsDiv, submitButton, resetButton) {
    alert("다시 선택할 수 있습니다. 기존 선택 항목이 유지됩니다.");
  
    const options = sectionOptionsDiv.querySelectorAll(".vote-option");
    options.forEach((option) => {
      // 비활성화 상태를 해제하지만 선택 상태는 유지
      option.classList.remove("disabled");
  
      // 선택 상태에 따라 스타일 복원
      if (option.classList.contains("selected")) {
        option.style.backgroundColor = ""; // 선택 상태 유지
      } else if (option.classList.contains("highlight")) {
        option.style.backgroundColor = ""; // 10명 이상 투표된 상태 유지
      } else {
        option.style.backgroundColor = ""; // 기본 상태 복원
      }
    });
  
    submitButton.disabled = false; // 제출 버튼 활성화
    resetButton.disabled = true; // 다시 투표하기 버튼 비활성화
  }
  

  async function submitSectionVotes(user, sectionOptions, sectionOptionsDiv, submitButton, resetButton) {
    const selectedOptionIds = Array.from(
      sectionOptionsDiv.querySelectorAll(".vote-option.selected")
    ).map((option) => parseInt(option.dataset.id, 10));

    if (selectedOptionIds.length === 0) {
      alert("선택된 항목이 없습니다. 선택 후 다시 시도해주세요.");
      return;
    }

    try {
      const payload = {
        userName: user.Name,
        userLolId: user.LolId,
        votes: selectedOptionIds,
      };

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
        sectionOptionsDiv.querySelectorAll(".vote-option.selected").forEach((option) => {
          option.classList.add("disabled");
          option.classList.remove("selected");
        });
        submitButton.disabled = true;
        resetButton.disabled = false;
        initializeVotePage();
      } else {
        alert(result.error || "투표 제출에 실패했습니다.");
        initializeVotePage();
      }
    } catch (error) {
      console.error("Error submitting votes:", error);
      alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      initializeVotePage();
    }
  }

  function toggleExclusiveVoteOption(option, sectionName) {
    if (option.classList.contains("disabled")) return;

    const sectionDiv = option.closest(".vote-section");
    const options = sectionDiv.querySelectorAll(".vote-option");

    // 참/불 중 하나만 선택 가능 (2차, 3차, 4차, 5차 투표 섹션)
    if (["2차 투표", "3차 투표", "4차 투표", "5차 투표"].includes(sectionName)) {
      options.forEach((otherOption) => {
        if (otherOption !== option) {
          otherOption.classList.remove("selected");
        }
      });
    }

    option.classList.toggle("selected");
  }
}

// async function saveGameRecords() {
//   try {
//     const records = [];
//     const container = document.getElementById("gameRecordsContainer");
//     const forms = container.querySelectorAll(".game-record");

//     let allFieldsValid = true; // 모든 필드가 올바르게 입력되었는지 확인

//     forms.forEach((form, index) => {
//       const gameOptionId = form.dataset.optionId;
//       const userName = localStorage.getItem("userName"); // 로그인한 사용자 이름
//       const lolId = localStorage.getItem("userLolId"); // 로그인한 사용자 게임 ID

//       if (!userName || !lolId) {
//         alert("로그인 정보가 누락되었습니다. 다시 로그인해주세요.");
//         allFieldsValid = false;
//         return;
//       }

//       let wins = 0; // 현재까지의 승리 횟수
//       let losses = 0; // 현재까지의 패배 횟수
//       let matchEnded = false; // 2승 또는 2패 발생 여부

//       [1, 2, 3].forEach((match) => {
//         if (matchEnded) return; // 2승 또는 2패가 발생하면 이후 경기를 무시

//         const result = form.querySelector(`#result${index}-${match}`).value;
//         const champion = form.querySelector(`#champion${index}-${match}`).value;
//         const position = form.querySelector(`#position${index}-${match}`).value; // 포지션 추가
//         const kills = form.querySelector(`#kills${index}-${match}`).value;
//         const deaths = form.querySelector(`#deaths${index}-${match}`).value;
//         const assists = form.querySelector(`#assists${index}-${match}`).value;

//         // 필드가 입력되지 않은 경우
//         if (!result || !champion || !position || kills === "" || deaths === "" || assists === "") {
//           allFieldsValid = false;
//         } else {
//           // 필드가 모두 입력된 경우 기록 추가
//           records.push({
//             game_option_id: parseInt(gameOptionId, 10),
//             user_name: userName,
//             lolId: lolId,
//             result,
//             champion,
//             position, // 포지션 추가
//             kills: parseInt(kills, 10),
//             deaths: parseInt(deaths, 10),
//             assists: parseInt(assists, 10),
//             match_number: match,
//           });

//           // 승리 또는 패배 횟수 갱신
//           if (result === "win") wins += 1;
//           if (result === "loss") losses += 1;

//           // 2승 또는 2패 발생 시 경기 종료
//           if (wins >= 2 || losses >= 2) {
//             matchEnded = true;
//           }
//         }
//       });
//     });

//     if (!allFieldsValid) {
//       alert("모든 필드를 올바르게 입력해주세요!");
//       return;
//     }

//     if (records.length === 0) {
//       alert("저장할 데이터가 없습니다.");
//       return;
//     }

//     // 서버에 데이터 전송
//     const response = await fetch(SAVE_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ records }),
//     });

//     if (response.ok) {
//       alert("전적이 성공적으로 저장되었습니다!");
//       loadGameRecords(); // 전적 데이터 새로 로드
//     } else {
//       const errorData = await response.json();
//       console.error("Error response:", errorData);
//       alert("전적 저장에 실패했습니다.");
//     }
//   } catch (error) {
//     console.error("Error saving game records:", error);
//     alert("서버와 통신 중 오류가 발생했습니다.");
//   }
// }

async function saveGameRecords() {
  try {
    const user_name = localStorage.getItem("userName");
    const lolId = localStorage.getItem("userLolId");

    if (!user_name || !lolId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const records = [];
    document.querySelectorAll(".game-record").forEach((recordDiv) => {
      const date = recordDiv.querySelector("input[type='date']").value;
      const group = recordDiv.querySelector("select[id^='match']").value; // 그룹
      const round = recordDiv.querySelector("select[id^='round']").value; // 차전
      const match = recordDiv.querySelectorAll("select[id^='match']")[1].value; // 두 번째 match = 경기
      const result = recordDiv.querySelector("select[id^='result']").value;
      const champion = recordDiv.querySelector("select[id^='champion']").value;
      const position = recordDiv.querySelector("select[id^='position']").value;
      const kills = recordDiv.querySelector("select[id^='kills']").value;
      const deaths = recordDiv.querySelector("select[id^='deaths']").value;
      const assists = recordDiv.querySelector("select[id^='assists']").value;

      if (!date || !group || !round || !match || !result || !champion || !position) {
        alert("모든 필드를 입력해주세요.");
        return;
      }

      records.push({
        user_name,
        lolId,
        game_date: date,
        group_name: group,
        round_name: round,
        game_option_id: null, // ✅ 필요 없으니 null
        result,
        champion,
        position,
        kills: Number(kills),
        deaths: Number(deaths),
        assists: Number(assists),
        match_number: Number(match.replace("경기", "")) // "1경기" → 1
      });
    });

    console.log("전송할 기록:", records);

    const response = await fetch(`${VOTE_URL}/save-game-records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records })
    });

    const result = await response.json();
    if (result.success) {
      alert("게임 기록이 성공적으로 저장되었습니다!");
    } else {
      alert(`저장 실패: ${result.error || "알 수 없는 오류"}`);
    }
  } catch (error) {
    console.error("Error saving game records:", error);
    alert("서버 오류로 저장에 실패했습니다.");
  }
}




function enableVoteOptions(resetVoteButton, submitVoteButton) {
  alert("다시 선택할 수 있습니다.");

  // 비활성화된 항목 다시 활성화
  document.querySelectorAll(".vote-option.disabled").forEach((el) => el.classList.remove("disabled"));

  // 주황색 강조 상태 재확인
  updateHighlightOnTenVotes();

  // 제출하기 버튼 활성화
  submitVoteButton.disabled = false;
  resetVoteButton.disabled = false;
}


// function toggleVoteOption(option, submitVoteButton, resetVoteButton) {
//   if (option.classList.contains("disabled")) return; // 비활성화된 항목은 클릭 무시

//   const isSelected = option.classList.toggle("selected"); // 선택 상태 토글
//   const voteCountElement = option.querySelector(".vote-count");
//   const voteCount = parseInt(voteCountElement.textContent.match(/\d+/)[0], 10);

//   if (voteCount >= 10) {
//     if (isSelected) {
//       option.style.backgroundColor = "orange"; // 선택 시 주황색 유지
//     } else {
//       option.style.backgroundColor = ""; // 취소 시 기본색으로 변경
//     }
//   }

//   // 제출하기 버튼 활성화 조건 업데이트
//   updateButtonStates(submitVoteButton, resetVoteButton);

//   // 다시 투표하기 버튼 활성화
//   resetVoteButton.disabled = false;
// }

function toggleVoteOption(option, totalVotes, sectionName) {
  if (option.classList.contains("disabled")) return; // 비활성화된 항목은 무시

  const isSelected = option.classList.toggle("selected"); // 선택 상태 토글

  // 특정 섹션(2차, 3차, ...)에서 한 번에 하나만 선택 가능
  if (["2차 투표", "3차 투표", "4차 투표", "5차 투표"].includes(sectionName)) {
    const sectionOptions = document.querySelectorAll(`.vote-section[data-section='${sectionName}'] .vote-option`);
    sectionOptions.forEach((otherOption) => {
      if (otherOption !== option) {
        otherOption.classList.remove("selected");
      }
    });
  }

  // 선택 상태에 따라 클래스와 색상 업데이트
  if (isSelected) {
    option.classList.remove("highlight"); // 10명 상태 제거
  } else {
    option.classList.remove("selected"); // 선택 상태 해제

    // 10명 이상 투표된 경우에만 highlight 추가
    if (totalVotes >= 10) {
      option.classList.add("highlight");
    }
  }
}

// function toggleExclusiveVoteOption(option, sectionName) {
//   if (option.classList.contains("disabled")) return; // 비활성화된 항목은 무시

//   // 현재 섹션 내의 모든 옵션만 가져오기
//   const section = option.closest(".vote-section"); // 클릭된 항목의 섹션
//   const sectionOptions = section.querySelectorAll(".vote-option");

//   // 같은 섹션의 다른 항목 선택 해제
//   sectionOptions.forEach((otherOption) => {
//     if (otherOption !== option) {
//       otherOption.classList.remove("selected");
//     }
//   });

//   // 현재 클릭된 항목 선택/해제
//   option.classList.toggle("selected");
// }


function updateHighlightOnTenVotes() {
  const voteOptions = document.querySelectorAll(".vote-option");
  let firstTenVotesOptionId = null;

  voteOptions.forEach((option) => {
    const voteCountElement = option.querySelector(".vote-count");
    const voteCount = parseInt(voteCountElement.textContent.match(/\d+/)[0], 10);

    if (voteCount >= 10) {
      if (!firstTenVotesOptionId) {
        firstTenVotesOptionId = option.dataset.id; // 첫 번째로 10명이 된 항목 ID
        option.style.backgroundColor = "orange"; // 주황색 강조
      } else if (firstTenVotesOptionId === option.dataset.id) {
        option.style.backgroundColor = "orange"; // 주황색 유지
      } else {
        option.style.backgroundColor = ""; // 다른 항목은 해제
      }
    } else {
      option.style.backgroundColor = ""; // 10명 미만인 항목 해제
    }
  });
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




function updateButtonStates(submitVoteButton, resetVoteButton) {
  const hasSelection = document.querySelectorAll(".vote-option.selected").length > 0;
  submitVoteButton.disabled = !hasSelection;
  resetVoteButton.disabled = false; // 다시 투표하기 버튼은 항상 활성화
}

const fetchVoteDataForDate = async (date) => {
  try {
    const response = await fetch(`${VOTE_URL}/options?date=${date}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vote options for date ${date}: ${response.statusText}`);
    }
    const options = await response.json();
    return options;
  } catch (error) {
    console.error('Error fetching vote options:', error);
    return [];
  }
};


// 페이지 로드 시 초기화
// document.addEventListener("DOMContentLoaded", () => {
//   const pathname = window.location.pathname;
//   console.log("Pathname for debugging:", pathname);

//   if (pathname === "/" || pathname.includes("index.html")) {
//     fetchUsers();
//   } else if (pathname.includes("vote") || pathname.includes("vote.html")) {
//     initializeVotePage();
//   } else if (pathname.includes("record") || pathname.includes("record.html")) {
//     initializeRecordPage();
//   } else {
//     console.log("Unrecognized Pathname:", pathname);
//   }
// });

///////////////////////////////////////////////



// 전적 입력 폼 생성
// const createGameRecordForm = (game, index) => {
//   const recordDiv = document.createElement("div");
//   recordDiv.className = "game-record";
//   recordDiv.dataset.optionId = game.option_id;

//   recordDiv.innerHTML = `
//     <h2>${index + 1}차 투표 - ${game.option_name}</h2>
//     ${[1, 2, 3]
//       .map(
//         (match) => `
//       <div class="match-record">
//         <h3>${match}경기</h3>
//         <div class="record-row">
//           <label for="result${index}-${match}">결과:</label>
//           <select id="result${index}-${match}" required>
//             <option value="">선택</option>
//             <option value="win">승리</option>
//             <option value="loss">패배</option>
//           </select>
//         </div>
//         <div class="record-row">
//           <label for="champion${index}-${match}">챔피언:</label>
//           <select id="champion${index}-${match}" required>
//             <option value="">선택하세요</option>
//             <option value="아리">아리</option>
//             <option value="가렌">가렌</option>
//             <option value="리신">리신</option>
//           </select>
//         </div>
//         <div class="record-row">
//           <label for="kills${index}-${match}">킬:</label>
//           <select id="kills${index}-${match}" class="number-select"></select>
//           <label for="deaths${index}-${match}">데스:</label>
//           <select id="deaths${index}-${match}" class="number-select"></select>
//           <label for="assists${index}-${match}">어시:</label>
//           <select id="assists${index}-${match}" class="number-select"></select>
//         </div>
//       </div>
//     `
//       )
//       .join("")}
//   `;

//   [1, 2, 3].forEach((match) => {
//     populateNumberSelect(recordDiv.querySelector(`#kills${index}-${match}`));
//     populateNumberSelect(recordDiv.querySelector(`#deaths${index}-${match}`));
//     populateNumberSelect(recordDiv.querySelector(`#assists${index}-${match}`));
//   });

//   return recordDiv;
// };



// 전적 입력 데이터 로드

