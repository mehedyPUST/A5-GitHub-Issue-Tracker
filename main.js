const issuesContainer = document.getElementById('issues-container');
const totalIssuesCounter = document.getElementById('total-issues');
const allIssuesBtn = document.getElementById('allIssuesBtn');
const openIssuesBtn = document.getElementById('openIssuesBtn');
const closedIssuesBtn = document.getElementById('closedIssuesBtn');
const loadingSpinner = document.getElementById('loading-spinner');
const searchInput = document.getElementById('searchInput');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const issueModal = document.getElementById('issue-modal');

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
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues"
    const res = await fetch(url);
    const data = await res.json();
    hideLoading();
    allIssues = data.data;
    displayIssues(allIssues);
    totalIssuesCounter.innerText = allIssues.length;
}

async function displayIssues(issues) {
    issuesContainer.innerHTML = '';

    if (issues.length === 0) {
        issuesContainer.innerHTML = `
            <div class="col-span-4 text-center py-10 text-gray-500">
                <i class="fa-regular fa-folder-open text-4xl mb-2"></i>
                <p>No issues found</p>
            </div>
        `;
        totalIssuesCounter.innerText = 0;
        return;
    }

    issues.forEach((issue) => {
        const card = document.createElement('div');

        const borderClass = issue.status === 'open'
            ? 'border-t-4 border-t-green-500'
            : 'border-t-4 border-t-purple-500';

        card.className = `card bg-base-100 shadow-sm ${borderClass} cursor-pointer hover:shadow-lg transition-shadow`;

        card.addEventListener('click', () => openIssueModal(issue));

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
<span class="text-gray-300 mt-2 mb-1 -mx-6 ">
        <hr>
    </span>
                <div >
                    <p>#${issue.id} By: ${issue.author.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p>${new Date(issue.createdAt).toLocaleString()}</p>
                </div>
            </div>
        `;

        issuesContainer.appendChild(card);
    });

    totalIssuesCounter.innerText = issues.length;
};

function openIssueModal(issue) {
    const assignee = issue.assignee || "Unassigned";
    const capitalizedAssignee = assignee.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const borderClass = issue.status === 'open'
        ? 'border-t-4 border-t-green-500'
        : 'border-t-4 border-t-purple-500';

    modalContent.innerHTML = `
        <section class="w-[95vw] md:w-[60vw] mx-auto ${borderClass} bg-white shadow-xl p-5 md:p-10 rounded-xl">
        
            <div class=" mb-3">
                <h2 class="text-2xl font-bold ">${issue.title}</h2>
                
            </div>

            <div class="flex gap-3 mb-4 items-center ">
                <span class="badge ${issue.status === 'open' ? 'bg-green-500 ' : ' bg-purple-500'} text-white p-3 rounded-xl">
                    ${issue.status === 'open' ? 'Opened' : 'Closed'}
                </span>
                <span>Opened by: ${issue.author.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <span>${new Date(issue.createdAt).toLocaleString()}</span>
            </div>

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

            <p class="mt-5 text-justify">${issue.description}</p>

            <div class="bg-gray-100 flex gap-20 md:gap-50 mt-5 p-4">
                <div class="space-y-2">
                    <p>Assignee:</p>
                    <p>${capitalizedAssignee}</p>
                </div>
                <div class="space-y-2">
                    <p>Priority:</p>
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
            </div>

            <div class="flex justify-between mt-5">
           
              <span class="btn">ID: ${issue.id}</span>

              <button onclick="closeModal()" class="btn btn-primary">Close</button>
            </div>

        </section>
    `;

    issueModal.checked = true;
}

function closeModal() {
    issueModal.checked = false;
}

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
    closedIssuesBtn.className = 'btn bg-purple-500 text-white ';
}

allIssuesBtn.addEventListener('click', filterAllIssues);
openIssuesBtn.addEventListener('click', filterOpenIssues);
closedIssuesBtn.addEventListener('click', filterClosedIssues);
searchInput.addEventListener('keyup', search);

async function search(event) {
    showLoading();
    const searchTerm = event.target.value;

    if (searchTerm === '') {
        await loadIssues();
    } else {
        const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchTerm}`;

        const res = await fetch(url);
        const data = await res.json();
        const searchResults = data.data;
        await displayIssues(searchResults);
    }
    hideLoading();
}


loadIssues();