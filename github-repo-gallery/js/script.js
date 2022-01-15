//global variable to select the div with a class of overview. this div is where your profile information will appear.
const profileElement = document.querySelector(".overview");
const username = "amirestes";
const repoList = document.querySelector(".repo-list");
const allInfo = document.querySelector(".repos");
const allData = document.querySelector(".repo-data");
const backToRepo = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");


const githubProfile = async function () {
    const response = await fetch(
        `https://api.github.com/users/${username}`
    );
    const data = await response.json();
    userInfo(data);
    
};

githubProfile();

//function to display fetched user information

const userInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = 
    `<figure>
        <img alt="user avatar" src=${data.avatar_url}/>
    </figure>
    <div>
        <p><strong>Name:</strong> ${data.name} </p>
        <p><strong>Bio:</strong> ${data.bio} </p>
        <p><strong>Number of public repos:</strong> ${data.public_repos} </p>
    </div>`;

    profileElement.append(div);
    getRepos();
};



const getRepos = async function () {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await res.json();
    repoInfoList(repoData);
};

//display info about your repos

const repoInfoList = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(li);
    };
};

repoList.addEventListener("click", function (e) {
    if ( e.target.matches("h3") ) {
        const repoName = e.target.innerText;
        specificRepoInfo(repoName);
    }
});

//create a function to get specific repo info

const specificRepoInfo = async function (repoName) {
    const resp = await fetch(`https://api.github.com/repos/${username}/${repoName}
    `);
    const repoInfo = await resp.json();
    //console.log(repoInfo);

    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    //console.log(languageData);
    const languages = [];
    for(const language in languageData) {
        languages.push(language);
        //console.log(language);
    }
    displayRepoInfo(repoInfo, languages);
};

//displays individual repo info when clicked
const displayRepoInfo = function (repoInfo, languages) {
    allData.innerHTML = "";
    allData.classList.remove("hide");
    allInfo.classList.add("hide");
    const displayDiv = document.createElement("div");
    displayDiv.innerHTML =
    `<h3>Name: ${repoInfo.name} </h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(",")}</p>
        <a class ="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
    allData.append(displayDiv);
    backToRepo.classList.remove("hide");
};

//back button on individual repos
backToRepo.addEventListener("click", function()
{
    allInfo.classList.remove("hide");
    allData.classList.add("hide");
    backToRepo.classList.add("hide");
});

//add an input event to the search box
filterInput.addEventListener("input", function(e) {
    const inputData = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const lower = inputData.toLowerCase();

    for (const repo of repos) {
        const repoLowerText = repo.innerText.toLowerCase();
        if(repoLowerText.includes(lower)){
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});