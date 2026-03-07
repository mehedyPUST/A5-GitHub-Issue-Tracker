
const issuesContainer = document.getElementById('issues-container');

async function loadIssues() {
    // showLoading();

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();
    // hideLoading();
    console.log(data);
    displayIssues(data.data);
}


async function displayIssues(issues) {
    console.log(issues);
    issues.forEach((issue) => {
        console.log(issue);
        const card = document.createElement('div');
        card.className = "card  bg-base-100 shadow-sm";
        card.innerHTML = `<div class="card-body">
                    <div class="flex justify-between">
                        <span><img src="${issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed-Status .png'}" alt="${issue.status} status"></span>


                        <span class="py-1 px-4 rounded-xl font-semibold ${issue.priority === 'high' ? 'bg-red-100 text-red-500' :
                issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-500' :
                    'bg-gray-100 text-gray-500'}">
        ${issue.priority === 'high'
                ? 'HIGH'
                : issue.priority === 'medium'
                    ? 'MEDIUM'
                    : 'LOW'}
    </span>
                    </div >

                    <h2 class="text-xl font-bold line-clamp-2">${issue.title}</h2>
                    <p class="line-clamp-3 text-justify">${issue.description}</p>

                    <div class="flex justify-between">
                        <span class="badge badge-outline badge-error"><span><i
                                    class="fa-solid fa-bug"></i></span>BUG</span>
                        <span class="badge badge-outline badge-warning"><span><i
                                    class="fa-solid fa-life-ring"></i></span>HELP WANTED</span>


                    </div>


                    <div class=" border border-amber-50 shadow-sm py-2 ">
                        <p>#1 by john_doe</p>
                        <p>1/15/2024</p>

                    </div>
                </div >

            `;
        issuesContainer.appendChild(card);

    });
}



loadIssues();