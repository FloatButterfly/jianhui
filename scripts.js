// Global variables
let allPublications = [];
let showingSelected = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load publications data
  loadPublications();
  
  // Initialize animation delays for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Add event listener for toggle button
  const toggleButton = document.getElementById('toggle-publications');
  if (toggleButton) {
    toggleButton.addEventListener('click', togglePublications);
  }
});

// Load publications from JSON file
function loadPublications() {
  fetch('publications_complete.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      allPublications = data.publications;
      renderPublications(true);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      displayFallbackPublications();
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const container = document.getElementById('publications-container');
  container.innerHTML = `Error loading publications.`;
}

// Toggle between showing all or selected publications
function togglePublications() {
  showingSelected = !showingSelected;
  renderPublications(showingSelected);
  
  // Update button text
  const toggleButton = document.getElementById('toggle-publications');
  toggleButton.textContent = showingSelected ? 'Show All' : 'Show Selected';
  const toggleHeader = document.getElementById('toggle-header');
  toggleHeader.textContent = showingSelected ? 'Selected Publications' : 'All Publications';
}

// Render publications based on selection state
function renderPublications(selectedOnly) {
  const publicationsContainer = document.getElementById('publications-container');
  publicationsContainer.innerHTML = '';

  const pubsToShow = selectedOnly ?
    allPublications.filter(pub => pub.selected === 1) :
    allPublications;

  pubsToShow.forEach((publication, idx) => {
    const div = document.createElement('div');
    div.className = 'publication-item';
    div.style.marginBottom = '1.5em';
    let html = '';
    // 第一行：编号+标题
    html += `<span style='font-weight:bold;'>[${idx+1}]</span> <b>${publication.title}</b><br>`;
    // 作者全部在一行
    let authorsArr = publication.authors.map(author => {
      if (author === 'Jianhui Chang' || author === '常建慧') {
        return `<span style="color:#1565c0;font-weight:bold;">${author}</span>`;
      } else {
        return author;
      }
    });
    html += authorsArr.join(', ') + '<br>';
    // venue + award
    html += `<i>${publication.venue}</i>`;
    if (publication.award && publication.award.length > 0) {
      html += ` <span style='color:#dd0000; font-weight:bold;'>(${publication.award})</span>`;
    }
    // links
    if (publication.links) {
      let linksArr = [];
      if (publication.links.pdf) linksArr.push(`<a href='${publication.links.pdf}' target='_blank'>[PDF]</a>`);
      if (publication.links.code) linksArr.push(`<a href='${publication.links.code}' target='_blank'>[Code]</a>`);
      if (publication.links.project) linksArr.push(`<a href='${publication.links.project}' target='_blank'>[Project Page]</a>`);
      if (linksArr.length > 0) html += '<br>' + linksArr.join(' ');
    }
    div.innerHTML = html;
    publicationsContainer.appendChild(div);
  });
}
