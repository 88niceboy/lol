const MATCH_HISTORY_URL = "https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/votes/match-history"; // 백엔드 API

document.addEventListener("DOMContentLoaded", () => {
  const historyContainer = document.getElementById("matchHistoryContainer");
  const searchButton = document.getElementById("searchButton");

  // ✅ 페이지 로드 시 최근 30일 경기 자동 로드
  loadMatchHistory();

  // ✅ 검색 버튼 클릭 시 필터링
  searchButton.addEventListener("click", () => {
    const date = document.getElementById("searchDate").value;
    const round = document.getElementById("searchRound").value;
    const match = document.getElementById("searchMatch").value;

    loadMatchHistory({ date, round_name: round, match_number: match });
  });

  async function loadMatchHistory(filters = {}) {
    try {
      historyContainer.innerHTML = "<p>불러오는 중...</p>";

      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${MATCH_HISTORY_URL}?${query}`);

      if (!response.ok) throw new Error("Failed to fetch match history");

      const data = await response.json();
      console.log("Match History Data:", data);

      if (!data || data.length === 0) {
        historyContainer.innerHTML = `<p>최근 30일 동안의 경기 기록이 없습니다.</p>`;
        return;
      }

      renderMatchHistory(data);
    } catch (error) {
      console.error("Error fetching match history:", error);
      historyContainer.innerHTML = `<p>⚠️ 데이터를 불러오지 못했습니다: ${error.message}</p>`;
    }
  }

  function renderMatchHistory(matches) {
  historyContainer.innerHTML = ""; // 초기화

  matches.forEach((matchGroup) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "match-group";

    groupDiv.innerHTML = `
      <div class="match-header">
        날짜: ${matchGroup.game_date} |
        차전: ${matchGroup.round_name} |
        경기: ${matchGroup.match_number}경기
      </div>
      <div class="team-container">
        <div class="team win">
          <h4>승리팀</h4>
          <table>
            <thead>
              <tr>
                <th>유저</th>
                <th>챔피언</th>
                <th>포지션</th>
                <th>K / D / A</th>
              </tr>
            </thead>
            <tbody>
              ${matchGroup.winTeam
                .map(
                  (player) => `
                <tr>
                  <td>${player.user_name}</td>
                  <td>${player.champion}</td>
                  <td>${player.position}</td>
                  <td>${player.kills} / ${player.deaths} / ${player.assists}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <div class="team lose">
          <h4>패배팀</h4>
          <table>
            <thead>
              <tr>
                <th>유저</th>
                <th>챔피언</th>
                <th>포지션</th>
                <th>K / D / A</th>
              </tr>
            </thead>
            <tbody>
              ${matchGroup.loseTeam
                .map(
                  (player) => `
                <tr>
                  <td>${player.user_name}</td>
                  <td>${player.champion}</td>
                  <td>${player.position}</td>
                  <td>${player.kills} / ${player.deaths} / ${player.assists}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    historyContainer.appendChild(groupDiv);
  });
}
});

