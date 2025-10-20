// Global variables
let startDate = new Date();
let completedGoals = new Set();
let completedBudgetItems = new Set();
let completedChecklistItems = new Set();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateProgress();
    updateDates();
});

// Initialize the application
function initializeApp() {
    // Set start date to today
    startDate = new Date();
    
    // Load saved progress from localStorage
    loadProgress();
    
    // Initialize tab functionality
    initializeTabs();
    
    // Initialize checkboxes
    initializeCheckboxes();
    
    // Update all displays
    updateProgress();
    updateBudgetSummary();
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Goal checkboxes
    const goalCheckboxes = document.querySelectorAll('.goal-checkbox');
    goalCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleGoalChange);
    });
    
    // Budget checkboxes
    const budgetCheckboxes = document.querySelectorAll('.budget-checkbox');
    budgetCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleBudgetChange);
    });
    
    // Checklist checkboxes
    const checklistCheckboxes = document.querySelectorAll('.checklist-checkbox');
    checklistCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleChecklistChange);
    });
}

// Tab functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Hide all tabs except the first one
    tabs.forEach(tab => tab.classList.remove('active'));
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show first tab
    if (tabs.length > 0) {
        tabs[0].classList.add('active');
        tabButtons[0].classList.add('active');
    }
}

function switchTab(tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected tab and button
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Checkbox initialization
function initializeCheckboxes() {
    // Restore goal checkboxes
    completedGoals.forEach(goalId => {
        const checkbox = document.getElementById(goalId);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Restore budget checkboxes
    completedBudgetItems.forEach(budgetId => {
        const checkbox = document.getElementById(budgetId);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Restore checklist checkboxes
    completedChecklistItems.forEach(checklistId => {
        const checkbox = document.getElementById(checklistId);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

// Handle goal checkbox changes
function handleGoalChange(event) {
    const checkbox = event.target;
    const goalId = checkbox.id;
    
    if (checkbox.checked) {
        completedGoals.add(goalId);
        checkbox.parentElement.classList.add('success-animation');
        setTimeout(() => {
            checkbox.parentElement.classList.remove('success-animation');
        }, 600);
    } else {
        completedGoals.delete(goalId);
    }
    
    updateProgress();
    saveProgress();
}

// Handle budget checkbox changes
function handleBudgetChange(event) {
    const checkbox = event.target;
    const budgetId = checkbox.id;
    
    if (checkbox.checked) {
        completedBudgetItems.add(budgetId);
    } else {
        completedBudgetItems.delete(budgetId);
    }
    
    updateBudgetSummary();
    updateProgress();
    saveProgress();
}

// Handle checklist checkbox changes
function handleChecklistChange(event) {
    const checkbox = event.target;
    const checklistId = checkbox.id;
    
    if (checkbox.checked) {
        completedChecklistItems.add(checklistId);
        checkbox.parentElement.classList.add('success-animation');
        setTimeout(() => {
            checkbox.parentElement.classList.remove('success-animation');
        }, 600);
    } else {
        completedChecklistItems.delete(checklistId);
    }
    
    updateProgress();
    saveProgress();
}

// Update overall progress
function updateProgress() {
    const totalGoals = document.querySelectorAll('.goal-checkbox').length;
    const totalBudgetItems = document.querySelectorAll('.budget-checkbox').length;
    const totalChecklistItems = document.querySelectorAll('.checklist-checkbox').length;
    
    const totalItems = totalGoals + totalBudgetItems + totalChecklistItems;
    const completedItems = completedGoals.size + completedBudgetItems.size + completedChecklistItems.size;
    
    const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    // Update progress bar
    const progressFill = document.getElementById('overallProgress');
    const progressText = document.getElementById('progressPercent');
    
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    
    if (progressText) {
        progressText.textContent = progressPercent + '%';
    }
    
    // Update progress bar color based on completion
    if (progressFill) {
        if (progressPercent < 25) {
            progressFill.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        } else if (progressPercent < 50) {
            progressFill.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
        } else if (progressPercent < 75) {
            progressFill.style.background = 'linear-gradient(90deg, #f1c40f, #f39c12)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
        }
    }
}

// Update budget summary
function updateBudgetSummary() {
    const budgetItems = document.querySelectorAll('.budget-checkbox');
    let totalCost = 0;
    let completedCost = 0;
    
    budgetItems.forEach(checkbox => {
        const amount = parseFloat(checkbox.dataset.amount) || 0;
        totalCost += amount;
        
        if (checkbox.checked) {
            completedCost += amount;
        }
    });
    
    const remainingCost = totalCost - completedCost;
    
    // Update display
    const totalCostElement = document.getElementById('totalCost');
    const completedCostElement = document.getElementById('completedCost');
    const remainingCostElement = document.getElementById('remainingCost');
    const budgetProgressElement = document.getElementById('budgetProgress');
    
    if (totalCostElement) {
        totalCostElement.textContent = '$' + totalCost.toLocaleString();
    }
    
    if (completedCostElement) {
        completedCostElement.textContent = '$' + completedCost.toLocaleString();
    }
    
    if (remainingCostElement) {
        remainingCostElement.textContent = '$' + remainingCost.toLocaleString();
    }
    
    if (budgetProgressElement) {
        const progressPercent = totalCost > 0 ? (completedCost / totalCost) * 100 : 0;
        budgetProgressElement.style.width = progressPercent + '%';
    }
}

// Update dates based on start date
function updateDates() {
    const dateElements = document.querySelectorAll('.date[data-days]');
    
    dateElements.forEach(element => {
        const days = parseInt(element.dataset.days);
        const targetDate = new Date(startDate);
        targetDate.setDate(targetDate.getDate() + days);
        
        const formattedDate = targetDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        element.textContent = formattedDate;
    });
}

// Open external links
function openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

// Launch celebration
function celebrateLaunch() {
    // Check if all major goals are completed
    const majorGoals = ['goal1-3', 'goal2-3', 'goal4-1', 'goal5-1', 'goal7-2'];
    const completedMajorGoals = majorGoals.filter(goal => completedGoals.has(goal));
    
    if (completedMajorGoals.length >= 3) {
        showCelebration();
    } else {
        alert('Complete more goals before launching your agency! You need to finish at least 3 major milestones.');
    }
}

// Show celebration modal
function showCelebration() {
    const celebrationHTML = `
        <div class="celebration" id="celebrationModal">
            <div class="celebration-content">
                <h2>🎉 Congratulations! 🎉</h2>
                <p>You're ready to launch your insurance agency in Austin, Texas!</p>
                <p>Your hard work and dedication have paid off. Time to make your dreams a reality!</p>
                <button class="celebration-btn" onclick="closeCelebration()">Let's Launch!</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', celebrationHTML);
    
    // Add confetti effect
    createConfetti();
}

// Close celebration modal
function closeCelebration() {
    const modal = document.getElementById('celebrationModal');
    if (modal) {
        modal.remove();
    }
}

// Create confetti effect
function createConfetti() {
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#27ae60', '#9b59b6'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
    
    // Add CSS for confetti animation
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Save progress to localStorage
function saveProgress() {
    const progress = {
        completedGoals: Array.from(completedGoals),
        completedBudgetItems: Array.from(completedBudgetItems),
        completedChecklistItems: Array.from(completedChecklistItems),
        startDate: startDate.toISOString()
    };
    
    localStorage.setItem('insuranceAgencyProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('insuranceAgencyProgress');
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            completedGoals = new Set(progress.completedGoals || []);
            completedBudgetItems = new Set(progress.completedBudgetItems || []);
            completedChecklistItems = new Set(progress.completedChecklistItems || []);
            
            if (progress.startDate) {
                startDate = new Date(progress.startDate);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
}

// Reset all progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        completedGoals.clear();
        completedBudgetItems.clear();
        completedChecklistItems.clear();
        
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset start date
        startDate = new Date();
        
        // Update displays
        updateProgress();
        updateBudgetSummary();
        updateDates();
        
        // Clear localStorage
        localStorage.removeItem('insuranceAgencyProgress');
        
        alert('Progress has been reset!');
    }
}

// Export progress data
function exportProgress() {
    const progress = {
        completedGoals: Array.from(completedGoals),
        completedBudgetItems: Array.from(completedBudgetItems),
        completedChecklistItems: Array.from(completedChecklistItems),
        startDate: startDate.toISOString(),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(progress, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'insurance-agency-progress.json';
    link.click();
}

// Import progress data
function importProgress() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const progress = JSON.parse(e.target.result);
                    
                    completedGoals = new Set(progress.completedGoals || []);
                    completedBudgetItems = new Set(progress.completedBudgetItems || []);
                    completedChecklistItems = new Set(progress.completedChecklistItems || []);
                    
                    if (progress.startDate) {
                        startDate = new Date(progress.startDate);
                    }
                    
                    // Update checkboxes
                    initializeCheckboxes();
                    
                    // Update displays
                    updateProgress();
                    updateBudgetSummary();
                    updateDates();
                    
                    // Save to localStorage
                    saveProgress();
                    
                    alert('Progress imported successfully!');
                } catch (error) {
                    alert('Error importing progress. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + 1-4 for tab switching
    if ((event.ctrlKey || event.metaKey) && event.key >= '1' && event.key <= '4') {
        event.preventDefault();
        const tabIndex = parseInt(event.key) - 1;
        const tabs = ['timeline', 'budget', 'checklist', 'resources'];
        if (tabs[tabIndex]) {
            switchTab(tabs[tabIndex]);
        }
    }
    
    // Ctrl/Cmd + R for reset (with confirmation)
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        resetProgress();
    }
});

// Add tooltips for better UX
function addTooltips() {
    const tooltips = [
        { selector: '.action-btn', text: 'Click to open external resource' },
        { selector: '.goal-checkbox', text: 'Mark as completed' },
        { selector: '.budget-checkbox', text: 'Mark expense as paid' },
        { selector: '.checklist-checkbox', text: 'Mark task as completed' }
    ];
    
    tooltips.forEach(tooltip => {
        const elements = document.querySelectorAll(tooltip.selector);
        elements.forEach(element => {
            element.title = tooltip.text;
        });
    });
}

// Initialize tooltips when DOM is loaded
document.addEventListener('DOMContentLoaded', addTooltips);

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add progress notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Enhanced goal completion with notifications
function handleGoalChange(event) {
    const checkbox = event.target;
    const goalId = checkbox.id;
    
    if (checkbox.checked) {
        completedGoals.add(goalId);
        checkbox.parentElement.classList.add('success-animation');
        showNotification('Goal completed! Great job!', 'success');
        setTimeout(() => {
            checkbox.parentElement.classList.remove('success-animation');
        }, 600);
    } else {
        completedGoals.delete(goalId);
    }
    
    updateProgress();
    saveProgress();
}

// Auto-save progress every 30 seconds
setInterval(saveProgress, 30000);

// Add print functionality
function printProgress() {
    window.print();
}

// Add help modal
function showHelp() {
    const helpHTML = `
        <div class="celebration" id="helpModal">
            <div class="celebration-content" style="max-width: 600px;">
                <h2>📚 Help & Tips</h2>
                <div style="text-align: left; margin: 20px 0;">
                    <h3>Getting Started:</h3>
                    <ul>
                        <li>Start with the Timeline tab to see your 7-month roadmap</li>
                        <li>Check off goals as you complete them</li>
                        <li>Track your budget in the Budget tab</li>
                        <li>Use the Checklist for detailed tasks</li>
                        <li>Access all resources in the Resources tab</li>
                    </ul>
                    
                    <h3>Keyboard Shortcuts:</h3>
                    <ul>
                        <li>Ctrl/Cmd + 1-4: Switch between tabs</li>
                        <li>Ctrl/Cmd + R: Reset progress</li>
                    </ul>
                    
                    <h3>Tips:</h3>
                    <ul>
                        <li>Your progress is automatically saved</li>
                        <li>All external links open in new tabs</li>
                        <li>Complete major goals to unlock the launch celebration</li>
                    </ul>
                </div>
                <button class="celebration-btn" onclick="closeHelp()">Got it!</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', helpHTML);
}

function closeHelp() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.remove();
    }
}

// Add help button to header
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    if (header) {
        const helpButton = document.createElement('button');
        helpButton.innerHTML = '<i class="fas fa-question-circle"></i> Help';
        helpButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        helpButton.onmouseover = () => {
            helpButton.style.background = 'rgba(255,255,255,0.3)';
        };
        helpButton.onmouseout = () => {
            helpButton.style.background = 'rgba(255,255,255,0.2)';
        };
        helpButton.onclick = showHelp;
        
        header.style.position = 'relative';
        header.appendChild(helpButton);
    }
});
