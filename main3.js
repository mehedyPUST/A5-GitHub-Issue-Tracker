const issuesContainer = document.getElementById('issues-container');
const totalIssuesCounter = document.getElementById('total-issues');
const allIssuesBtn = document.getElementById('allIssuesBtn');
const openIssuesBtn = document.getElementById('openIssuesBtn');
const closedIssuesBtn = document.getElementById('closedIssuesBtn');
const loadingSpinner = document.getElementById('loading-spinner');

// Search input
const searchInput = document.querySelector('input[placeholder="Search issues..."]');

// Modal elements
const issueModal = document.getElementById('issueModal');
const closeModalBtns = document.querySelectorAll('#closeModalBtn, #closeModalBtn2');

let allIssues = [];
let currentFilter = 'all'; // Track current filter: 'all', 'open', 'closed'
let currentSearchTerm = ''; // Track current search term

// ========== HELPER FUNCTIONS ==========

// Label helpers - with HELP WANTED
function getLabelStyle(label) {
    if (label === 'enhancement') return 'bg-green-100 px-2 text-green-500 border border-green-500';
    if (label === 'bug') return 'bg-red-100 px-4 text-red-500 border border-red-500';
    if (label === 'good first issue') return 'bg-indigo-100 px-2 text-indigo-500 border border-indigo-500';
    if (label === 'documentation') return 'bg-blue-100 px-2 text-blue-500 border border-blue-500';
    if (label === 'help wanted') return 'bg-yellow-100 px-2 text-yellow-500 border border-yellow-500';
    return '';
}

function getLabelIcon(label) {
    if (label === 'enhancement') return '<i class="fa-solid fa-wand-magic-sparkles"></i> ENHANCEMENT';
    if (label === 'bug') return '<i class="fa-solid fa-bug"></i> BUG';
    if (label === 'good first issue') return '<i class="fa-regular fa-star"></i> GOOD FIRST ISSUE';
    if (label === 'documentation') return '<i class="fa-solid fa-book"></i> DOCUMENTATION';
    if (label === 'help wanted') return '<i class="fa-solid fa-life-ring"></i> HELP WANTED';
    return '';
}

// Priority helpers - with LOW (case insensitive)
function getPriorityStyle(priority) {
    if (!priority) return '';

    const p = priority.toLowerCase();

    if (p === 'high') return 'bg-red-100 text-red-500';
    if (p === 'medium') return 'bg-yellow-100 text-yellow-500';
    if (p === 'low') return 'bg-gray-100 text-gray-500';

    return '';
}

function getPriorityText(priority) {
    if (!priority) return '';

    const p = priority.toLowerCase();

    if (p === 'high') return 'HIGH';
    if (p === 'medium') return 'MEDIUM';
    if (p === 'low') return 'LOW';

    return '';
}

// Format author name
function formatAuthorName(author) {
    return author.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ========== SEARCH FUNCTIONALITY ==========

// Debounce function to limit API calls
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Search issues function
async function searchIssues(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        // If search is empty, load all issues based on current filter
        if (currentFilter === 'all') {
            displayIssues(allIssues);
        } else if (currentFilter === 'open') {
            const openIssues = allIssues.filter(issue => issue.status === 'open');
            displayIssues(openIssues);
        } else if (currentFilter === 'closed') {
            const closedIssues = allIssues.filter(issue => issue.status === 'closed');
            displayIssues(closedIssues);
        }
        totalIssuesCounter.innerText = issuesContainer.children.length;
        return;
    }

    showLoading();
    currentSearchTerm = searchTerm;

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        console.log('Search results:', data);

        let searchResults = data.data || [];

        // Apply current filter to search results
        if (currentFilter === 'open') {
            searchResults = searchResults.filter(issue => issue.status === 'open');
        } else if (currentFilter === 'closed') {
            searchResults = searchResults.filter(issue => issue.status === 'closed');
        }

        displayIssues(searchResults);
        totalIssuesCounter.innerText = searchResults.length;
    } catch (error) {
        console.error('Error searching issues:', error);
        issuesContainer.innerHTML = `
            <div class="col-span-4 text-center py-10 text-red-500">
                <i class="fa-solid fa-circle-exclamation text-4xl mb-2"></i>
                <p>Failed to search issues. Please try again.</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

// Debounced search function
const debouncedSearch = debounce((searchTerm) => {
    searchIssues(searchTerm);
}, 500);

// ========== MODAL FUNCTIONS ==========

function openModal(issue) {
    // Update modal content with issue data
    document.querySelector('#issueModal h3').textContent = issue.title;

    // Status with icon and color
    const statusIcon = document.querySelector('#issueModal .flex.items-center.gap-2 span:first-child i');
    const statusText = document.querySelector('#issueModal .flex.items-center.gap-2 span:nth-child(2)');
    const statusColor = document.querySelector('#issueModal .flex.items-center.gap-2 span:first-child');

    if (statusIcon && statusText && statusColor) {
        if (issue.status === 'open') {
            statusColor.className = 'text-green-600';
            statusIcon.className = 'fa-solid fa-circle';
            statusText.textContent = 'Opened';
        } else {
            statusColor.className = 'text-purple-600';
            statusIcon.className = 'fa-solid fa-circle-check';
            statusText.textContent = 'Closed';
        }
    }

    // Update meta info
    const openedBy = document.querySelector('#issueModal .flex.items-center.gap-2 span:nth-child(4)');
    if (openedBy) openedBy.textContent = `Opened by ${formatAuthorName(issue.author)}`;

    const dateSpan = document.querySelector('#issueModal .flex.items-center.gap-2 span:nth-child(6)');
    if (dateSpan) dateSpan.textContent = new Date(issue.createdAt).toLocaleDateString();

    // Update labels/badges
    const labelsContainer = document.querySelector('#issueModal .flex.gap-2.mb-6');
    if (labelsContainer) {
        labelsContainer.innerHTML = '';

        const labels = [issue.labels[0], issue.labels[1]].filter(label => label);
        labels.forEach(label => {
            if (label) {
                const labelSpan = document.createElement('span');
                labelSpan.className = `px-3 py-1 rounded-full text-sm font-medium ${getLabelStyle(label)}`;
                labelSpan.innerHTML = getLabelIcon(label);
                labelsContainer.appendChild(labelSpan);
            }
        });
    }

    // Update description
    const descElement = document.querySelector('#issueModal p.text-gray-700');
    if (descElement) descElement.textContent = issue.description;

    // Update assignee
    const assigneeSpan = document.querySelector('#issueModal .flex.justify-between.items-center .flex.items-center.gap-2:first-child span:last-child');
    if (assigneeSpan) assigneeSpan.textContent = issue.assignee ? formatAuthorName(issue.assignee) : 'Unassigned';

    // Update priority
    const priorityContainer = document.querySelector('#issueModal .flex.justify-between.items-center .flex.items-center.gap-2:last-child span:last-child');
    if (priorityContainer && issue.priority) {
        priorityContainer.textContent = issue.priority.toUpperCase();
        priorityContainer.className = `px-3 py-1 rounded-full text-sm font-medium ${getPriorityStyle(issue.priority)}`;
    }

    // Show modal
    issueModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    issueModal.classList.add('hidden');
    document.body.style.overflow = '';
}

// ========== LOADING SPINNER ==========

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    loadingSpinner.classList.add('flex');
    issuesContainer.innerHTML = "";
}

function hideLoading() {
    loadingSpinner.classList.remove('flex');
    loadingSpinner.classList.add('hidden');
}

// ========== DISPLAY ISSUES ==========

function displayIssues(issues) {
    issuesContainer.innerHTML = '';

    // Empty state
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

    // Display each issue
    issues.forEach((issue) => {
        const card = document.createElement('div');

        // Add border-top based on status
        const borderClass = issue.status === 'open'
            ? 'border-t-4 border-t-green-500'
            : 'border-t-4 border-t-purple-500';

        card.className = `card bg-base-100 shadow-sm cursor-pointer hover:shadow-lg transition-shadow ${borderClass}`;

        // Add click event to open modal
        card.addEventListener('click', () => openModal(issue));

        // Status icon
        const statusIcon = issue.status === 'open'
            ? './assets/Open-Status.png'
            : './assets/Closed-Status .png';

        // Priority - case insensitive
        const priorityStyle = getPriorityStyle(issue.priority);
        const priorityText = getPriorityText(issue.priority);

        // Labels
        const label1 = issue.labels && issue.labels[0] ? issue.labels[0] : null;
        const label2 = issue.labels && issue.labels[1] ? issue.labels[1] : null;

        // Author and date
        const authorName = formatAuthorName(issue.author);
        const createdDate = new Date(issue.createdAt).toLocaleString();

        // Build priority HTML (only if exists)
        let priorityHtml = '';
        if (priorityStyle && priorityText) {
            priorityHtml = `<span class="py-1 px-4 rounded-xl font-semibold ${priorityStyle}">${priorityText}</span>`;
        }

        // Build labels HTML (only if exists)
        let labelsHtml = '';
        const label1Style = label1 ? getLabelStyle(label1) : '';
        const label1Icon = label1 ? getLabelIcon(label1) : '';
        const label2Style = label2 ? getLabelStyle(label2) : '';
        const label2Icon = label2 ? getLabelIcon(label2) : '';

        if ((label1 && label1Style && label1Icon) || (label2 && label2Style && label2Icon)) {
            labelsHtml = '<div class="flex gap-3">';

            if (label1 && label1Style && label1Icon) {
                labelsHtml += `<span class="py-1 rounded-xl text-[10px] ${label1Style}">${label1Icon}</span>`;
            }

            if (label2 && label2Style && label2Icon) {
                labelsHtml += `<span class="py-1 rounded-xl text-[10px] ${label2Style}">${label2Icon}</span>`;
            }

            labelsHtml += '</div>';
        }

        // Final card HTML
        card.innerHTML = `
            <div class="card-body">
                <div class="flex justify-between">
                    <span><img src="${statusIcon}" alt="${issue.status} status"></span>
                    ${priorityHtml}
                </div>

                <h2 class="text-xl font-bold line-clamp-2">${issue.title}</h2>
                <p class="line-clamp-3 text-justify">${issue.description}</p>

                ${labelsHtml}

                <div class="border border-amber-50 shadow-sm py-2">
                    <p>By: ${authorName}</p>
                    <p>${createdDate}</p>
                </div>
            </div>
        `;

        issuesContainer.appendChild(card);
    });

    totalIssuesCounter.innerText = issues.length;
}

// ========== FILTER FUNCTIONS ==========

function filterAllIssues() {
    currentFilter = 'all';
    showLoading();

    if (currentSearchTerm) {
        // If there's an active search, search within all issues
        searchIssues(currentSearchTerm);
    } else {
        displayIssues(allIssues);
        hideLoading();
    }

    allIssuesBtn.className = 'btn btn-primary w-40';
    openIssuesBtn.className = 'btn btn-outline w-40';
    closedIssuesBtn.className = 'btn btn-outline w-40';
}

function filterOpenIssues() {
    currentFilter = 'open';
    showLoading();

    if (currentSearchTerm) {
        // If there's an active search, search within open issues
        searchIssues(currentSearchTerm);
    } else {
        const openIssues = allIssues.filter(issue => issue.status === 'open');
        displayIssues(openIssues);
        hideLoading();
    }

    allIssuesBtn.className = 'btn btn-outline w-40';
    openIssuesBtn.className = 'btn btn-primary w-40';
    closedIssuesBtn.className = 'btn btn-outline w-40';
}

function filterClosedIssues() {
    currentFilter = 'closed';
    showLoading();

    if (currentSearchTerm) {
        // If there's an active search, search within closed issues
        searchIssues(currentSearchTerm);
    } else {
        const closedIssues = allIssues.filter(issue => issue.status === 'closed');
        displayIssues(closedIssues);
        hideLoading();
    }

    allIssuesBtn.className = 'btn btn-outline w-40';
    openIssuesBtn.className = 'btn btn-outline w-40';
    closedIssuesBtn.className = 'btn btn-primary w-40';
}

// ========== LOAD ISSUES ==========

async function loadIssues() {
    showLoading();

    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();
        console.log('API Data:', data);

        allIssues = data.data;
        displayIssues(allIssues);
        totalIssuesCounter.innerText = allIssues.length;
    } catch (error) {
        console.error('Error loading issues:', error);
        issuesContainer.innerHTML = `
            <div class="col-span-4 text-center py-10 text-red-500">
                <i class="fa-solid fa-circle-exclamation text-4xl mb-2"></i>
                <p>Failed to load issues. Please try again.</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

// ========== EVENT LISTENERS ==========

// Search input event listener
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        debouncedSearch(searchTerm);
    });
}

// Modal close buttons
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// Close modal when clicking backdrop
if (issueModal) {
    issueModal.addEventListener('click', (e) => {
        if (e.target === issueModal || e.target.classList.contains('fixed')) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && issueModal && !issueModal.classList.contains('hidden')) {
        closeModal();
    }
});

// Filter buttons
allIssuesBtn.addEventListener('click', filterAllIssues);
openIssuesBtn.addEventListener('click', filterOpenIssues);
closedIssuesBtn.addEventListener('click', filterClosedIssues);

// ========== INITIAL LOAD ==========

loadIssues();