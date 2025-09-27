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

  document.getElementById("addImageButton").addEventListener("click", () => {
    const file = document.getElementById("imageFile").files[0];
    if (!file) {
      alert("Please provide an image file.");
      return;
    }
    const name = file.name;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result.split(",")[1];
      const response = await fetch("/admin/images/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageData: base64 })
      });
      if (response.ok) window.location.reload();
      else alert("Failed to add image.");
    };
    reader.readAsDataURL(file);
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

  // Add hover buttons to each image item
  document.querySelectorAll('.image-item').forEach(item => {
    const img = item.querySelector('img');
    const imageId = item.dataset.id;
    const name = item.dataset.name;

    // Create buttons
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'hover-btn edit-btn';
    editBtn.addEventListener('click', () => {
      // Populate edit modal 
      editModal.style.display = 'block';
      document.getElementById('editImageId').value = imageId;
      document.getElementById('editName').value = name;
      document.getElementById('editImageButton').onclick = () => {
        const newName = document.getElementById('editName').value;
        fetch (`/admin/images/edit/${imageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        }).then(response => {
          if (response.ok) window.location.reload();
          else alert('Failed to update image.');
        });
      };

    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'hover-btn delete-btn';
    deleteBtn.addEventListener('click', () => {
      document.getElementById('deleteImageId').value = imageId;
      deleteModal.style.display = 'block';
      document.getElementById('confirmDeleteButton').onclick = () => {
        fetch(`/admin/images/delete/${imageId}`, {
          method: 'DELETE'
        }).then(response => {
          if (response.ok) window.location.reload();
          else alert('Failed to delete image.');
        });
      };
    });

    // Append buttons to item
    item.appendChild(editBtn);
    item.appendChild(deleteBtn);

    // Show/hide on hover
    item.addEventListener('mouseenter', () => {
      editBtn.style.display = 'block';
      deleteBtn.style.display = 'block';
    });
    item.addEventListener('mouseleave', () => {
      editBtn.style.display = 'none';
      deleteBtn.style.display = 'none';
    });
  });
});