function editBlog(id) {

  const blogCard = document.querySelector(`.blog-card[data-id="${id}"]`);
  if (!blogCard) return alert("Blog not found");

  const partners = JSON.parse(blogCard.dataset.partners || "[]");
  const editModal = document.getElementById('editModal');

  document.getElementById('editBlogId').value = blogCard.dataset.id || '';
  document.getElementById('editTitle').value = blogCard.dataset.title || '';
  document.getElementById('editContent').value = blogCard.dataset.content || '';
  document.getElementById('editDate').value = blogCard.dataset.date || '';

  const editPartnerSelect = document.getElementById('edit-partner-selection');
  Array.from(editPartnerSelect.querySelectorAll('input[type="checkbox"]')).forEach(checkbox => {
    checkbox.checked = partners.some(p => (p && p._id) ? p._id === checkbox.value : p === checkbox.value);
  });

  const imageElement = blogCard.querySelector('.blog-image');
  const hiddenImageInput = document.getElementById('editBlogImageData');
  if (imageElement && imageElement.src.startsWith('data:image/')) {
    hiddenImageInput.value = imageElement.src.split(',')[1] || '';
  } else {
    hiddenImageInput.value = '';
  }

  editModal.style.display = 'block';
}

// Delete blog function
function deleteBlog(id) {
  document.getElementById('deleteBlogId').value = id; 
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
  // Add new blog
  document.getElementById("addBlogButton").addEventListener("click", (event) => {
    event.preventDefault();
    const button = event.target;
    button.disabled = true; 
    
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const date = document.getElementById("date").value;
    const partners = Array.from(document.querySelectorAll('#partner-selection input:checked')).map(cb => cb.value);
    const file = document.getElementById("blogImageFile").files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(",")[1];
        const response = await fetch("/admin/blogs/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ title, content, date, imageData: base64, partners })
        });
        if (response.ok) window.location.reload();
        else alert("Failed to add blog.");
      };
      reader.readAsDataURL(file);
    }
    else {
      fetch("/admin/blogs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content, date, partners })
      }).then(response => {
        if (response.ok) window.location.reload();
        else alert("Failed to add blog.");
      });
    }
  });
  // Save edited blog
  document.getElementById("saveBlogButton").addEventListener("click", (event) => {
    event.preventDefault();
    const button = event.target;
    button.disabled = true;
    const id = document.getElementById("editBlogId").value;
    const file = document.getElementById("editBlogImageFile").files[0];
    const oldImageId = document.getElementById("editBlogImageData").value ? "existing" : null;
    const title = document.getElementById("editTitle").value;
    const content = document.getElementById("editContent").value;
    const date = document.getElementById("editDate").value;
    const partners = Array.from(document.querySelectorAll('#edit-partner-selection input:checked')).map(cb => cb.value);
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(",")[1];
        const response = await fetch(`/admin/blogs/edit/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ title, content, date, imageData: base64, partners })
        });
        if (response.ok) window.location.reload();
        else alert("Failed to update blog.");
        button.disabled = false;
      };
      reader.readAsDataURL(file);
    } else {
      fetch(`/admin/blogs/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content, date, oldImageId, partners })
      }).then(response => {
        if (response.ok) window.location.reload();
        else alert("Failed to update blog.");
        button.disabled = false;
      }).catch(() => {
        alert("Failed to update blog.");
        button.disabled = false;
      });
    }
  });
  // Confirm delete blog
  document.getElementById("confirmDeleteButton").addEventListener("click", (event) => {
    event.preventDefault();
    const button = event.target;
    button.disabled = true; 
    const id = document.getElementById("deleteBlogId").value;
    fetch(`/admin/blogs/delete/${id}`, {
      method: "DELETE"
    }).then(response => {
      if (response.ok) window.location.reload();
      else alert("Failed to delete blog.");
      button.disabled = false;
    });
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