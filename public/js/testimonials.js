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

});