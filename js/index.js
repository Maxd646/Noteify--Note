document.addEventListener('DOMContentLoaded', function() {
    checkAuthenticationStatus();
    setupDemoFunctionality();
});

function checkAuthenticationStatus() {
    const currentUser = getCurrentUser();
    const getStartedBtn = document.querySelector('.hero-buttons .btn-primary');
    const signUpFreeBtn = document.querySelector('.cta-buttons .btn-primary');
    
    if (currentUser) {
        updateButtonsForLoggedInUser(getStartedBtn, signUpFreeBtn);
    }
}

function updateButtonsForLoggedInUser(getStartedBtn, signUpFreeBtn) {
    if (getStartedBtn) {
        getStartedBtn.textContent = 'Go to My Notes';
        getStartedBtn.href = 'main.html';
    }
    
    if (signUpFreeBtn) {
        signUpFreeBtn.textContent = 'Open My Notes';
        signUpFreeBtn.href = 'main.html';
    }
}

function setupDemoFunctionality() {
    const addDemoNoteBtn = document.getElementById('addDemoNote');
    const demoNotesGrid = document.getElementById('demoNotesGrid');
    
    if (addDemoNoteBtn && demoNotesGrid) {
        let demoNoteCount = 1;
        
        addDemoNoteBtn.addEventListener('click', function() {
            demoNoteCount++;
            
            const demoNote = document.createElement('div');
            demoNote.className = 'demo-note';
            demoNote.innerHTML = `
                <h4>Demo Note ${demoNoteCount}</h4>
                <p>This is another sample note created by clicking the Add Note button. Try it out!</p>
                <span class="demo-date">Just now</span>
            `;
            
            demoNotesGrid.appendChild(demoNote);
            
            if (demoNoteCount >= 5) {
                addDemoNoteBtn.textContent = 'Demo Complete!';
                addDemoNoteBtn.disabled = true;
            }
        });
    }
}