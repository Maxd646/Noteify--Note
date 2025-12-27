const members = [
  {
    id: 1,
    image: "../Static/image/profile.png",
    name: "Daniel Gashaw",
    github: "https://github.com/Maxd646",
  },
  {
    id: 2,
    image: "../Static/image/profile.png",
    name: "Liyuneh Rstey",
    github: "https://github.com/liyuneh",
  },
  {
    id: 3,
    image: "../Static/image/profile.png",
    name: "Addis Shiferaw",
    github: "https://github.com/adda-19",
  },
  {
    id: 4,
    image: "../Static/image/profile.png",
    name: "Amir Yimam",
    github: "https://github.com/miro129",
  },
  {
    id: 5,
    image: "../Static/image/profile.png",
    name: "Abrham Teramed",
    github: "https://github.com/Abrom-code",
  },
];

document.getElementById("year").textContent = `© ${new Date().getFullYear()}`;

const teamGrid = document.getElementById("teamGrid");

members.forEach((member) => {
  const card = document.createElement("div");
  card.className = "team-card";

  card.innerHTML = `
    <img src="${member.image}" alt="Team" />
    <div class="team-info">
      <h3>${member.name}</h3>
      <p>
        <a href="${member.github}" target="_blank">GitHub 🡽</a>
      </p>
    </div>
  `;

  teamGrid.appendChild(card);
});
