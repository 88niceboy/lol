// common.js
// document.addEventListener("DOMContentLoaded", () => {
//     const isLoggedIn = localStorage.getItem("loggedIn");
//     const userName = localStorage.getItem("userName");
//     const loginButton = document.getElementById("loginButton");
  
//     // 로그인 상태 확인 및 버튼 텍스트 변경
//     if (isLoggedIn && userName) {
//       loginButton.textContent = "로그아웃";
//       displayUserStatus(userName);
//     } else {
//       loginButton.textContent = "로그인";
//       displayUserStatus(null);
//     }
  
//     // 로그인 버튼 클릭 이벤트
//     loginButton.addEventListener("click", () => {
//       if (isLoggedIn) {
//         // 로그아웃 처리
//         localStorage.removeItem("loggedIn");
//         localStorage.removeItem("userName");
//         localStorage.removeItem("userLolId");
//         alert("로그아웃되었습니다.");
//         window.location.reload(); // 페이지 새로고침
//       } else {
//         // 로그인 페이지로 이동
//         openLoginModal();
//       }
//     });
//   });

document.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;
  const isLoggedIn = localStorage.getItem("loggedIn");
  const userName = localStorage.getItem("userName");
  const loginButton = document.getElementById("loginButton");

  // 로그인 상태 확인 및 버튼 텍스트 변경
  if (isLoggedIn && userName) {
    loginButton.textContent = "로그아웃";
    displayUserStatus(userName);
  } else {
    loginButton.textContent = "로그인";
    displayUserStatus(null);
  }

  // 로그인 버튼 클릭 이벤트
  loginButton.addEventListener("click", () => {
    if (isLoggedIn) {
      // 로그아웃 처리
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("userName");
      localStorage.removeItem("userLolId");
      alert("로그아웃되었습니다.");
      window.location.reload(); // 페이지 새로고침
    } else {
      // 로그인 페이지로 이동
      openLoginModal();
    }
  });

  // 페이지별 초기화
  console.log("Current Pathname:", pathname);

  if (pathname === "/" || pathname.includes("index.html")) {
    fetchUsers();
  } else if (pathname.includes("vote") || pathname.includes("vote.html")) {
    initializeVotePage();
  } else if (pathname.includes("record") || pathname.includes("record.html")) {
    initializeRecordPage();
  } else if (pathname.includes("user-info") || pathname.includes("user-info.html")) {
    fetchAndDisplayUsers();
  } else {
    console.log("No specific initialization for this page.");
  }
});
  
  function displayUserStatus(userName) {
    const statusIndicator = document.getElementById("indicator");
    if (userName) {
      statusIndicator.textContent = `로그인: ${userName}`;
    } else {
      statusIndicator.textContent = "로그인 필요";
    }
  }
  
  function openLoginModal() {
    const loginModal = document.getElementById("login-modal");
    loginModal.style.display = "flex";
  
    const closeLoginModal = document.getElementById("closeLoginModal");
    closeLoginModal.addEventListener("click", () => {
      loginModal.style.display = "none";
    });
  
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const id = document.getElementById("loginId").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
  
      try {
        const response = await fetch("https://port-0-backend-m43n9mp6f1a95885.sel4.cloudtype.app/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, password }),
        });
  
        const data = await response.json();
        console.log("$$data : ", data)
        console.log("$$data : ", data.data.LolId)
        if (response.ok && data.success) {
          // 로그인 성공 처리
          localStorage.setItem("loggedIn", true);
          localStorage.setItem("userName", data.data.Name); // 백엔드에서 Name 제공
          localStorage.setItem("userLolId", data.data.LolId); // LolId 저장
          alert(`${id}님, 로그인 성공!`);
          loginModal.style.display = "none";
          window.location.reload();
        } else {
          alert(data.message || "로그인 실패. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("로그인 요청 실패:", error);
        alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      }
    });
  }
  