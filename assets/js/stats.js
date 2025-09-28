document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('updateStats').addEventListener('click', async () => {
    const button = event.target;
    button.disabled = true;
    const computersDonated = document.getElementById('computersDonated').querySelector('input').value;
    const phonesDonated = document.getElementById('phonesDonated').querySelector('input').value;
    const monitorsDonated = document.getElementById('monitorsDonated').querySelector('input').value;
    const devicesCollected = document.getElementById('devicesCollected').querySelector('input').value;
    const totalDonationValue = document.getElementById('totalDonationValue').querySelector('input').value;
    const response = await fetch('/admin/stats/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ computersDonated, phonesDonated, monitorsDonated, devicesCollected, totalDonationValue })
    });
    if (response.ok) {
      alert('Stats updated successfully.');
      window.location.reload();
    } else {
      alert('Failed to update stats.');
      button.disabled = false;
    }
  });
});