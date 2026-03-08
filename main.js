const issuesContainer = document.getElementById('issues-container');
const totalIssuesCounter = document.getElementById('total-issues');
const allIssuesBtn = document.getElementById('allIssuesBtn');
const openIssuesBtn = document.getElementById('openIssuesBtn');
const closedIssuesBtn = document.getElementById('closedIssuesBtn');
const loadingSpinner = document.getElementById('loading-spinner');
const searchInput = document.getElementById('searchInput');


let allIssues = [];

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    loadingSpinner.classList.add('flex');
    issuesContainer.innerHTML = "";
};

function hideLoading() {
    loadingSpinner.classList.remove('flex');
    loadingSpinner.classList.add('hidden');
};


async function loadIssues() {
    showLoading();
    let url = "https://phi-lab-server.vercel.app/api/v1/lab/issues"
    let res = await fetch(url);
    const data = await res.json();
    hideLoading();
    // console.log(data);
    allIssues = data.data;
    displayIssues(allIssues);
    // console.log(data.data);
    totalIssuesCounter.innerText = allIssues.length;

}

async function displayIssues(issues) {
    issuesContainer.innerHTML = '';
    if (issues.length === 0) {
        // Show empty state
        issuesContainer.innerHTML = `
            <div class="col-span-4 text-center py-10 text-gray-500">
                <i class="fa-regular fa-folder-open text-4xl mb-2"></i>
                <p>No issues found</p>
            </div>
        `;
        totalIssuesCounter.innerText = 0;
        return;
    }
    // console.log(issues);







    issues.forEach((issue) => {
        // console.log(issue.labels[1]);

        const card = document.createElement('div');

        const borderClass = issue.status === 'open'
            ? 'border-t-4 border-t-green-500'
            : 'border-t-4 border-t-purple-500';

        card.className = `card bg-base-100 shadow-sm ${borderClass}`;

        card.innerHTML = `
            <div class="card-body">
                <div class="flex justify-between">
                    <span>
                        <img src="${issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed-Status .png'}" 
                             alt="${issue.status} status">
                    </span>

                    <span class="py-1 px-4 rounded-xl font-semibold 
                          ${issue.priority === 'high'
                ? 'bg-red-100 text-red-500'
                : issue.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-500'
                    : 'bg-gray-100 text-gray-500'}">
                        ${issue.priority === 'high'
                ? 'HIGH'
                : issue.priority === 'medium'
                    ? 'MEDIUM'
                    : 'LOW'}
                    </span>
                </div>

                <h2 class="text-xl font-bold line-clamp-2">${issue.title}</h2>
                <p class="line-clamp-3 text-justify">${issue.description}</p>

                <div class="flex gap-3">
                    <span class="py-1 rounded-xl text-[10px] 
                          ${issue.labels[0] === 'enhancement'
                ? 'bg-green-100 px-2 text-green-500 border border-green-500'
                : issue.labels[0] === 'bug'
                    ? 'bg-red-100 px-4 text-red-500 border border-red-500'
                    : issue.labels[0] === 'good first issue'
                        ? 'bg-indigo-100 px-2 text-indigo-500 border border-indigo-500'
                        : 'bg-blue-100 px-2 text-blue-500 border border-blue-500'}">
                        ${issue.labels[0] === 'enhancement'
                ? '<i class="fa-solid fa-wand-magic-sparkles"></i> ENHANCEMENT'
                : issue.labels[0] === 'bug'
                    ? '<i class="fa-solid fa-bug"></i> BUG'
                    : issue.labels[0] === 'good first issue'
                        ? '<i class="fa-regular fa-star"></i> GOOD FIRST ISSUE'
                        : '<i class="fa-regular fa-file-lines"></i> DOCUMENTATION'}
                    </span>

                    <span class="py-1 rounded-xl text-[10px] 
                          ${!issue.labels[1]
                ? ''
                : issue.labels[1] === 'enhancement'
                    ? 'bg-green-100 px-2 text-green-500 border border-green-500'
                    : issue.labels[1] === 'good first issue'
                        ? 'bg-indigo-100 px-2 text-indigo-500 border border-indigo-500'
                        : issue.labels[1] === 'bug'
                            ? 'bg-purple-100 px-2 text-purple-500 border border-purple-500'
                            : issue.labels[1] === 'documentation'
                                ? 'bg-blue-100 px-2 text-blue-500 border border-blue-500'
                                : 'bg-yellow-100 px-2 text-yellow-500 border border-yellow-500'}">
                        ${!issue.labels[1]
                ? ''
                : issue.labels[1] === 'enhancement'
                    ? '<i class="fa-solid fa-wand-magic-sparkles"></i> ENHANCEMENT'
                    : issue.labels[1] === 'good first issue'
                        ? '<i class="fa-regular fa-star"></i> GOOD FIRST ISSUE'
                        : issue.labels[1] === 'bug'
                            ? '<i class="fa-solid fa-bug"></i> BUG'
                            : issue.labels[1] === 'documentation'
                                ? '<i class="fa-solid fa-book"></i> DOCUMENTATION'
                                : '<i class="fa-solid fa-life-ring"></i> HELP WANTED'}
                    </span>
                </div>

                <div class="border border-amber-50 shadow-sm py-2">
                    <p>By: ${issue.author.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p>${new Date(issue.createdAt).toLocaleString()}</p>
                </div>
            </div>
        `;

        issuesContainer.appendChild(card);
    });

    totalIssuesCounter.innerText = issues.length;
};

function filterAllIssues() {
    showLoading();
    displayIssues(allIssues);
    hideLoading();

    allIssuesBtn.className = 'btn btn-primary col-span-2 md:col-span-1 ';
    openIssuesBtn.className = 'btn btn-outline ';
    closedIssuesBtn.className = 'btn btn-outline ';
}

function filterOpenIssues() {
    showLoading();
    const openIssues = allIssues.filter(issue => issue.status === 'open');
    displayIssues(openIssues);
    hideLoading();

    allIssuesBtn.className = 'btn btn-outline col-span-2 md:col-span-1 ';
    openIssuesBtn.className = 'btn bg-green-500 text-white ';
    closedIssuesBtn.className = 'btn btn-outline ';


}
function filterClosedIssues() {
    showLoading();
    const closedIssues = allIssues.filter(issue => issue.status === 'closed');
    displayIssues(closedIssues);
    hideLoading();

    allIssuesBtn.className = 'btn btn-outline col-span-2 md:col-span-1 ';
    openIssuesBtn.className = 'btn btn-outline ';
    closedIssuesBtn.className = 'btn  bg-purple-500 text-white ';


}

allIssuesBtn.addEventListener('click', filterAllIssues);
openIssuesBtn.addEventListener('click', filterOpenIssues);
closedIssuesBtn.addEventListener('click', filterClosedIssues);


loadIssues();
searchInput.addEventListener('keydown', function () {
    url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchInput.value}`
})
