let jobsData = [];
let selectedFilters = [];

async function fetchJobs() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        jobsData = await response.json();
        renderJobs();
    } catch (error) {
        console.error('Error fetching job data:', error);
        document.getElementById('jobListings').innerHTML = 
            '<p>Sorry, there was an error loading the job listings.</p>';
    }
}

function renderFilters() {
    const filterBar = document.getElementById('filterBar');
    const filterTags = document.getElementById('filterTags');
    
    filterTags.innerHTML = selectedFilters.map(filter => `
        <span class="filter-tag" data-filter="${filter}">
            <span class="filter-tag-text">${filter}</span>
            <span class="filter-tag-close">×</span>
        </span>
    `).join('');
    
    if (selectedFilters.length > 0) {
        filterBar.classList.add('active');
    } else {
        filterBar.classList.remove('active');
    }

    document.querySelectorAll('.filter-tag-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const filterTag = e.target.parentElement;
            const filter = filterTag.dataset.filter;
            selectedFilters = selectedFilters.filter(f => f !== filter);
            renderFilters();
            renderJobs();
        });
    });
}

function renderJobs() {
    const jobListings = document.getElementById('jobListings');
    let filteredJobs = jobsData;

    if (selectedFilters.length > 0) {
        filteredJobs = filteredJobs.filter(job => {
            const allTags = [job.role, job.level, ...job.languages, ...job.tools];
            return selectedFilters.every(filter => allTags.includes(filter));
        });
    }

    jobListings.innerHTML = filteredJobs.map(job => `
        <div class="job-card ${job.featured ? 'featured' : ''}">
            <div class="job-logo">
                <img src="${job.logo}" alt="${job.company} logo">
            </div>
            <div class="job-info">
                <div>
                    <span class="company">${job.company}</span>
                    ${job.new ? '<span class="new">NEW!</span>' : ''}
                    ${job.featured ? '<span class="featured-tag">FEATURED</span>' : ''}
                </div>
                <div class="position">${job.position}</div>
                <div class="details">
                    ${job.postedAt} • ${job.contract} • ${job.location}
                </div>
            </div>
            <div class="tags">
                <span class="tag">${job.role}</span>
                <span class="tag">${job.level}</span>
                ${job.languages.map(lang => `<span class="tag">${lang}</span>`).join('')}
                ${job.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.textContent;
            if (!selectedFilters.includes(filter)) {
                selectedFilters.push(filter);
                renderFilters();
                renderJobs();
            }
        });
    });
}

document.getElementById('clearFilters').addEventListener('click', () => {
    selectedFilters = [];
    renderFilters();
    renderJobs();
});

fetchJobs();