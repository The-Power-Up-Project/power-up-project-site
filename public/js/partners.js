// Edit member function
function editPartner(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;

  // Populate edit modal with data from row
  document.getElementById('editPartnerId').value = id;
  document.getElementById('editName').value = row.dataset.name;
  document.getElementById('editUrl').value = row.dataset.url;
  document.getElementById('editDonator').checked = row.dataset.donator === 'true';

  // Show edit modal
  editModal.style.display = 'block';
}

// Delete member function
function deletePartner(id) {
  document.getElementById('deletePartnerId').value = id; 
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

  // Add new partner
  document.getElementById("addPartnerButton").addEventListener("click", (event) => {
    event.preventDefault(); 
    const button = event.target;
    button.disabled = true; 
    const file = document.getElementById("partnerImageFile").files[0]; 
    if (!file) {
      alert("Please provide an image file.");
      return;
    }
    const name = document.getElementById("name").value;
    const url = document.getElementById("url").value;
    const donator = document.getElementById("donator").checked;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result.split(",")[1];
      const response = await fetch("/admin/partners/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, donator, imageData: base64 })
      });
      if (response.ok) window.location.reload();
      else alert("Failed to add partner.");
      button.disabled = false;
    };
    reader.readAsDataURL(file);
  });
  

  // Handle edit form submission
  document.getElementById('editPartnerButton').addEventListener('click', async (event) => {
    event.preventDefault();
    const id = document.getElementById('editPartnerId').value;
    const name = document.getElementById('editName').value;
    const url = document.getElementById('editUrl').value;
    const donator = document.getElementById('editDonator').checked;
    const file = document.getElementById('editPartnerImageFile').files[0];

    let imageData = null;
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1];
        const response = await fetch(`/admin/partners/edit/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, url, donator, imageData: base64 })
        });
        if (response.ok) window.location.reload();
        else alert('Failed to update partner.');
      };
      reader.readAsDataURL(file);
    } else {
      // No new image, send without imageData
      const response = await fetch(`/admin/partners/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, donator })
      });
      if (response.ok) window.location.reload();
      else alert('Failed to update partner.');
    }
  });

  // Handle delete confirmation
  document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    const id = document.getElementById('deletePartnerId').value;
    const response = await fetch(`/admin/partners/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) window.location.reload();
    else alert('Failed to delete partner.');
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