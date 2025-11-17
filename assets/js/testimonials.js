// Edit member function
function editTestimonial(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;

  // Populate edit modal with data from row
  document.getElementById('editTestimonialId').value = id;
  document.getElementById('editPartner').value = row.dataset.partner;
  document.getElementById('editContent').value = row.dataset.content;

  // Show edit modal
  editModal.style.display = 'block';
}

// Delete member function
function deleteTestimonial(id) {
  document.getElementById('deleteTestimonialId').value = id; 
  deleteModal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  // Modal elements
  const addModal = document.getElementById('addModal');
  const editModal = document.getElementById('editModal');
  const deleteModal = document.getElementById('deleteModal');
  const openAddModal = document.getElementById('openAddModal');
  const closeAddModal = document.getElementById('closeAddModal');
  const closeEditModal = document.getElementById('closeEditModal');
  const closeDeleteModal = document.getElementById('closeDeleteModal');

  // Open add modal
  openAddModal.addEventListener('click', () => {
    addModal.style.display = 'block';
  });

  // Add new testimonial
  document.getElementById("addTestimonialButton").addEventListener("click", async (event) => {
    event.preventDefault(); 
    const button = event.target;
    button.disabled = true; 
   
    const partner = document.getElementById("partner").value;
    const content = document.getElementById("content").value;

    
    const response = await fetch("/admin/testimonials/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partner, content })
    });
    if (response.ok) window.location.reload();
    else alert("Failed to add testimonial.");
    button.disabled = false;
    
  });
  

  // Handle edit form submission
  document.getElementById('editTestimonialButton').addEventListener('click', async (event) => {
    event.preventDefault();
    const id = document.getElementById('editTestimonialId').value;
    const partner = document.getElementById('editPartner').value;
    const content = document.getElementById('editContent').value;

    const response = await fetch(`/admin/testimonials/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, partner, content })
    });
    if (response.ok) window.location.reload();
    else alert('Failed to update testimonial.');
      
    
  });

  // Handle delete confirmation
  document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    const id = document.getElementById('deleteTestimonialId').value;
    const response = await fetch(`/admin/testimonials/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) window.location.reload();
    else alert('Failed to delete testimonial.');
  });
  // Close modals
  [closeAddModal, closeEditModal, closeDeleteModal].forEach(btn => {
    btn.addEventListener('click', () => {
      addModal.style.display = 'none';
      editModal.style.display = 'none';
      deleteModal.style.display = 'none';
    });
  });

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === addModal) addModal.style.display = 'none';
    if (e.target === editModal) editModal.style.display = 'none';
    if (e.target === deleteModal) deleteModal.style.display = 'none';
  });

  // Set up testimonial ticker animation
  setupTestimonialTicker();
});

function setupTestimonialTicker() {
  const ticker = document.querySelector('.testimonial-ticker');
  if (!ticker) return;
  const track = ticker.querySelector('.testimonial-track');
  if (!track) return;

  // Respect reduced-motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) return; // do not animate

  // Keep a base copy and duplicate only if necessary (to avoid exponential duplication)
  if (!track.dataset.baseHtml) {
    track.dataset.baseHtml = track.innerHTML;
  }
  const baseHtml = track.dataset.baseHtml;
  if (baseHtml.trim() === '') return;
  // start with single copy so we can measure properly
  track.innerHTML = baseHtml;

  const speedPxPerSec = 35; // base speed, px per second (reduced for slower scroll)

  function updateTicker() {
    // Remove animation so we can compute measurements fresh
    track.classList.remove('ticker-animate');
    track.style.animationDuration = '';

    // Force reflow to ensure measurements are accurate
    const tickerHeight = ticker.clientHeight;
    const baseHeight = track.scrollHeight; // height of a single set
    // If there's nothing to scroll (all items fit the visible area), stop
    if (baseHeight <= tickerHeight) {
      // ensure no duplicate remains
      track.innerHTML = baseHtml;
      track.classList.remove('ticker-animate');
      track.style.animationDuration = '';
      track.style.transform = '';
      return;
    }
    // Duplicate for seamless scrolling if not already duplicated
    if (!track.dataset.duplicated || track.dataset.duplicated !== 'true') {
      track.innerHTML = baseHtml + baseHtml;
      track.dataset.duplicated = 'true';
      // set initial position to 0 so the track scrolls upwards (bottom-to-top)
      track.style.transform = 'translateY(0)';
    }
    const originalHeight = track.scrollHeight / 2; // height of a single duplicated set
    const durationSec = Math.max(6, Math.round(originalHeight / speedPxPerSec));

    // Apply computed duration
    track.style.animationDuration = durationSec + 's';
    track.classList.add('ticker-animate');
  }

  // Pause on hover for readability
  ticker.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
  ticker.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });

  // Set up resize observer to adjust duration when layout changes
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateTicker, 150);
  });

  // Initial setup
  updateTicker();
}