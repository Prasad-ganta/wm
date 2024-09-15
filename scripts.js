function showForm(formId) {
    document.getElementById('home').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('reportForm').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'none';
    document.getElementById('reportList').style.display = 'none';
    document.getElementById(formId).style.display = 'block';
    document.getElementById(formId).classList.add('fade-in');
}

function showReportForm() {
    showForm('reportForm');
}

function showReportList() {
    showForm('reportList');
    displayReports();
}

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Sign up successful! Please sign in.');
    showForm('loginForm');
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showReportForm();
        updateNavButtons(true);
    } else {
        alert('Invalid credentials');
    }
});

document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const photo = document.getElementById('photo').files[0];
    const villageName = document.getElementById('villageName').value;
    const district = document.getElementById('district').value;
    const area = document.getElementById('area').value;
    const pincode = document.getElementById('pincode').value;
    const description = document.getElementById('description').value;

    const reader = new FileReader();
    reader.onloadend = function() {
        const report = { photo: reader.result, villageName, district, area, pincode, description, timestamp: new Date().toISOString() };
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));
        alert('Report submitted successfully!');
        document.getElementById('reportForm').reset();
    }
    reader.readAsDataURL(photo);
});

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    if (password === 'admin123') { // In a real application, use a more secure method
        showReportList();
    } else {
        alert('Invalid admin password');
    }
});

function displayReports() {
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    const reportsContainer = document.getElementById('reports');
    reportsContainer.innerHTML = '';
    reports.forEach((report, index) => {
        const reportElement = document.createElement('div');
        reportElement.className = 'report fade-in';
        reportElement.innerHTML = `
            <img src="${report.photo}" alt="Waste Report">
            <h3>${report.villageName}</h3>
            <p><strong>District:</strong> ${report.district}</p>
            <p><strong>Area:</strong> ${report.area}</p>
            <p><strong>Pincode:</strong> ${report.pincode}</p>
            <p><strong>Description:</strong> ${report.description}</p>
            <p><strong>Reported on:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        `;
        reportsContainer.appendChild(reportElement);
    });
}

function updateNavButtons(loggedIn) {
    document.getElementById('logoutButton').style.display = loggedIn ? 'block' : 'none';
    document.getElementById('newReportButton').style.display = loggedIn ? 'block' : 'none';
}

function logout() {
    localStorage.removeItem('currentUser');
    updateNavButtons(false);
    showForm('home');
}

// Check if user is logged in on page load
if (localStorage.getItem('currentUser')) {
    updateNavButtons(true);
    showReportForm();
}