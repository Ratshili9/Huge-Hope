document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reportForm');
    const statusEl = document.getElementById('statusMessage');

    // Auto-fill incident date
    document.getElementById('incident_date').value = new Date().toISOString();

    // Toggle 'Other' category field
    document.getElementById('category').addEventListener('change', (e) => {
        const otherField = document.getElementById('other-category-field');
        otherField.style.display = e.target.value === 'Other' ? 'block' : 'none';
    });

    // Toggle contact fields
    document.getElementById('contact_method').addEventListener('change', (e) => {
        document.getElementById('email-field').style.display = 'none';
        document.getElementById('phone-field').style.display = 'none';

        if (e.target.value === 'Email') {
            document.getElementById('email-field').style.display = 'block';
        } else if (e.target.value === 'Phone' || e.target.value === 'WhatsApp') {
            document.getElementById('phone-field').style.display = 'block';
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        statusEl.textContent = '';
        statusEl.style.color = '';

        try {
            // Validate
            if (!form.checkValidity()) {
                throw new Error('Please fill all required fields');
            }

            const formData = new URLSearchParams(new FormData(form));
            const response = await fetch('https://script.google.com/macros/s/AKfycbwM29olyuZl4Im3-PFyqxmkaYqbihw5xaNISzsNtVTS8rdN_odd2ZeGl_AvvK3BdVux/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            const result = await response.json();
            
            if (result.status !== 'success') {
                throw new Error(result.message || 'Submission failed');
            }

            statusEl.textContent = 'Report submitted successfully!';
            statusEl.style.color = 'green';
            form.reset();
            
        } catch (error) {
            statusEl.textContent = error.message;
            statusEl.style.color = 'red';
            console.error('Submission error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
        }
    });
});