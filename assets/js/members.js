// Edit member function
function editMember(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;

  // Populate edit modal with data from row
  document.getElementById('editMemberId').value = id;
  document.getElementById('editName').value = row.dataset.name;
  document.getElementById('editPosition').value = row.dataset.position;
  document.getElementById('editSchool').value = row.dataset.school;
  document.getElementById('editGraduationYear').value = row.dataset.graduationYear;
  document.getElementById('editAdvisoryBoard').checked = row.dataset.advisoryBoard === 'true';

  // Show edit modal
  editModal.style.display = 'block';
}

// Delete member function
function deleteMember(id) {
  document.getElementById('deleteMemberId').value = id; 
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
  const cancelDelete = document.getElementById('cancelDelete');

  // Open add modal
  openAddModal.addEventListener('click', () => {
    addModal.style.display = 'block';
  });

  // Add new member
  document.getElementById("addMemberButton").addEventListener("click", (event) => {
    event.preventDefault(); 
    const button = event.target;
    button.disabled = true; 
    const file = document.getElementById("memberImageFile").files[0]; 
    if (!file) {
      alert("Please provide an image file.");
      return;
    }
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const school = document.getElementById("school").value;
    const graduationYear = document.getElementById("graduationYear").value;
    const advisoryBoard = document.getElementById("advisoryBoard").checked;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result.split(",")[1];
      const response = await fetch("/admin/members/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, position, school, graduationYear, advisoryBoard, imageData: base64 })
      });
      if (response.ok) window.location.reload();
      else alert("Failed to add member.");
      button.disabled = false;
    };
    reader.readAsDataURL(file);
  });
  

  // Handle edit form submission
  document.getElementById('editMemberButton').addEventListener('click', async (event) => {
    event.preventDefault();
    const id = document.getElementById('editMemberId').value;
    const name = document.getElementById('editName').value;
    const position = document.getElementById('editPosition').value;
    const school = document.getElementById('editSchool').value;
    const graduationYear = document.getElementById('editGraduationYear').value;
    const advisoryBoard = document.getElementById('editAdvisoryBoard').checked;
    const file = document.getElementById('editMemberImageFile').files[0];

    let imageData = null;
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1];
        const response = await fetch(`/admin/members/edit/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, position, school, graduationYear, advisoryBoard, imageData: base64 })
        });
        if (response.ok) window.location.reload();
        else alert('Failed to update member.');
      };
      reader.readAsDataURL(file);
    } else {
      // No new image, send without imageData
      const response = await fetch(`/admin/members/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, position, school, graduationYear, advisoryBoard })
      });
      if (response.ok) window.location.reload();
      else alert('Failed to update member.');
    }
  });

  // Handle delete confirmation
  document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    const id = document.getElementById('deleteMemberId').value;
    const response = await fetch(`/admin/members/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) window.location.reload();
    else alert('Failed to delete member.');
  });
  // Close modals
  [closeAddModal, closeEditModal, closeDeleteModal, cancelDelete].forEach(btn => {
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