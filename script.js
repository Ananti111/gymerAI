// Wait for the DOM to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- SECTION 1: PAGE NAVIGATION ---
    const pages = {
        landing: document.getElementById('page-landing'),
        dashboard: document.getElementById('page-dashboard'),
        coach: document.getElementById('page-coach'),
        login: document.getElementById('page-login')
    };

    const navLinks = {
        home: document.getElementById('nav-home'),
        dashboard: document.getElementById('nav-dashboard'),
        coach: document.getElementById('nav-coach'),
        login: document.getElementById('nav-login'),
        signup: document.getElementById('nav-signup'),
        getStarted: document.getElementById('landing-get-started')
    };

    const navLinkElements = document.querySelectorAll('.nav-link');

    // Function to show a specific page and hide all others
    function showPage(pageToShow) {
        // Hide all pages
        Object.values(pages).forEach(page => {
            if (page) page.style.display = 'none';
        });
        
        // Deactivate all nav links
        navLinkElements.forEach(link => link.classList.remove('active'));

        // Show the requested page
        if (pageToShow) {
            pageToShow.style.display = 'block';
            
            // Activate the corresponding nav link
            if (pageToShow === pages.landing) navLinks.home.classList.add('active');
            if (pageToShow === pages.dashboard) navLinks.dashboard.classList.add('active');
            if (pageToShow === pages.coach) navLinks.coach.classList.add('active');
            if (pageToShow === pages.login) navLinks.login.classList.add('active');
        }
    }

    // Add click listeners for navigation
    navLinks.home.addEventListener('click', (e) => { e.preventDefault(); showPage(pages.landing); });
    navLinks.dashboard.addEventListener('click', (e) => { e.preventDefault(); showPage(pages.dashboard); });
    navLinks.coach.addEventListener('click', (e) => { e.preventDefault(); showPage(pages.coach); });
    
    // Login and Signup buttons go to the same page, but set different tabs
    navLinks.login.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pages.login);
        showLoginForm(); // Show the login tab
    });

    navLinks.signup.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pages.login);
        showSignupForm(); // Show the sign up tab
    });

    navLinks.getStarted.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pages.login);
        showSignupForm(); // "Get Started" goes to sign up
    });

    // --- SECTION 2: LOGIN & SIGNUP PAGE LOGIC ---
    const loginTab = document.getElementById('tab-login');
    const signupTab = document.getElementById('tab-signup');
    const authTitle = document.getElementById('auth-title');
    const confirmPassGroup = document.getElementById('confirm-password-group');
    const authButton = document.getElementById('auth-button');
    const authError = document.getElementById('auth-error-message');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const authPasswordConfirm = document.getElementById('auth-password-confirm');

    let isLoginMode = true;

    function showLoginForm() {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        authTitle.textContent = 'Log In to Your Account';
        confirmPassGroup.style.display = 'none';
        authButton.textContent = 'Log In';
        authError.style.display = 'none';
        isLoginMode = true;
    }

    function showSignupForm() {
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
        authTitle.textContent = 'Create a New Account';
        confirmPassGroup.style.display = 'block';
        authButton.textContent = 'Create Account';
        authError.style.display = 'none';
        isLoginMode = false;
    }

    loginTab.addEventListener('click', showLoginForm);
    signupTab.addEventListener('click', showSignupForm);

    authButton.addEventListener('click', () => {
        const email = authEmail.value;
        const password = authPassword.value;
        const confirmPassword = authPasswordConfirm.value;

        // Reset error
        authError.style.display = 'none';
        authError.textContent = '';

        if (isLoginMode) {
            // --- Simulated Login ---
            if (!email || !password) {
                authError.textContent = 'Please enter both email and password.';
                authError.style.display = 'block';
                return;
            }
            console.log('Simulating login for:', email);
            // On success:
            showPage(pages.dashboard);
            renderDashboardMetrics(); // Load dashboard data
        } else {
            // --- Simulated Sign Up ---
            if (!email || !password || !confirmPassword) {
                authError.textContent = 'Please fill out all fields.';
                authError.style.display = 'block';
                return;
            }
            if (password !== confirmPassword) {
                authError.textContent = 'Passwords do not match.';
                authError.style.display = 'block';
                return;
            }
            console.log('Simulating account creation for:', email);
            // On success, log them in and go to dashboard:
            showPage(pages.dashboard);
            renderDashboardMetrics(); // Load dashboard data
        }
    });

    // --- SECTION 3: DASHBOARD LOGIC (WITH GEMINI AI) ---
    const sleepDataEl = document.getElementById('sleep-data');
    const hrDataEl = document.getElementById('hr-data');
    const stressDataEl = document.getElementById('stress-data');
    const workoutFocusEl = document.getElementById('workout-focus');
    const generateBtn = document.getElementById('generate-workout-btn');
    const recommendationEl = document.getElementById('current-recommendation');

    let simulatedContextData = {
        sleep: "Poor (4.5h)",
        heartRate: "78 BPM (Elevated)",
        stress: "High"
    };

    function renderDashboardMetrics() {
        sleepDataEl.textContent = simulatedContextData.sleep;
        hrDataEl.textContent = simulatedContextData.heartRate;
        stressDataEl.textContent = simulatedContextData.stress;
    }
    
    // New function to handle the workout generation
    async function handleWorkoutGeneration() {
        recommendationEl.textContent = "Generating your context-aware plan... 🤖";
        
        // 1. Get user input
        const userFocus = workoutFocusEl.value;
        
        // 2. Get (simulated) context
        const context = `My sleep quality is ${simulatedContextData.sleep} and my stress level is ${simulatedContextData.stress}.`;

        // 3. Build the AI prompt
        const prompt = `
            Act as an elite AI fitness coach named GymER.
            A user has the following context: ${context}.
            They want a workout focusing on: ${userFocus}.

            Based on this context (especially the poor sleep and high stress), generate a short, effective workout plan.
            If the context is poor, prioritize recovery or lighter exercise.
            If the context is good, create a more challenging workout.
            
            Start with a 1-line "Coach's Note" explaining *why* you chose this plan based on their context.
            Then, list 3-5 exercises.
            
            Format the response clearly. Do not use markdown.
            Example:
            Coach's Note: Because your sleep was poor, we're focusing on light activity to promote recovery.
            1. Warm-up: 5 min light jog
            2. Exercise: ...
        `;

        // --- 4. Call the Gemini API ---
        
        // !!! IMPORTANT: You MUST get your own API key from Google AI Studio !!!
        const apiKey = ""; // <--- PASTE YOUR API KEY HERE
        
        if (apiKey === "") {
            recommendationEl.textContent = "API Key is missing. Please add your API key to script.js (around line 180) to enable this feature.";
            return;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;
            
            // 5. Display the result (replace \n with <br>)
            recommendationEl.innerHTML = aiResponse.replace(/\n/g, '<br>');

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            recommendationEl.textContent = `Error generating workout. Please check your API key or the console. ${error.message}`;
        }
    }

    generateBtn.addEventListener('click', handleWorkoutGeneration);
    // Load initial metrics when dashboard is shown (which happens on login)
    // renderDashboardMetrics(); // This is now called after login


    // --- SECTION 4: AI COACH CHAT LOGIC ---
    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');

    function addUserMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message user-message';
        msgDiv.innerHTML = `<p>${message}</p>`;
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll
    }

    function addAiMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ai-message';
        msgDiv.innerHTML = `<p>${message}</p>`;
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll
    }

    function getSimulatedAiResponse(userMessage) {
        userMessage = userMessage.toLowerCase();
        let response = "I'm not sure I understand. Can you rephrase? You can ask me about workout plans or nutrition.";

        if (userMessage.includes('hello') || userMessage.includes('hi')) {
            response = "Hi there! What's on your mind today?";
        } else if (userMessage.includes('workout') || userMessage.includes('exercise')) {
            response = "Great! For a personalized workout, please head to the 'Dashboard' page. You can generate a plan there that uses your real-time body metrics.";
        } else if (userMessage.includes('nutrition') || userMessage.includes('food') || userMessage.includes('eat')) {
            response = "Nutrition is key! My full nutrition module is coming soon. For now, try to focus on whole foods and plenty of protein.";
        } else if (userMessage.includes('sleep') || userMessage.includes('tired')) {
            response = "Sleep is crucial for recovery. Your dashboard shows your latest sleep quality. If you've slept poorly, the AI will recommend a lighter workout.";
        } else if (userMessage.includes('thank')) {
            response = "You're welcome! Happy to help.";
        }
        
        return response;
    }

    function handleChatSend() {
        const message = chatInput.value.trim();
        if (message === '') return;

        addUserMessage(message);
        chatInput.value = '';

        // Simulate AI thinking delay
        setTimeout(() => {
            const aiResponse = getSimulatedAiResponse(message);
            addAiMessage(aiResponse);
        }, 1000);
    }

    chatSendBtn.addEventListener('click', handleChatSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSend();
    });


    // --- SECTION 5: 3D MODEL LOGIC (THREE.JS) ---
    let bodyRenderer, bodyScene, bodyCamera, bodyModel;
    let skeletonRenderer, skeletonScene, skeletonCamera, skeletonModel;

    function init3DModels() {
        const bodyContainer = document.getElementById('body-canvas-container');
        const skeletonContainer = document.getElementById('skeleton-canvas-container');

        if (!bodyContainer || !skeletonContainer) return; // Don't run if not on landing page

        // --- Create Body Model ---
        bodyScene = new THREE.Scene();
        bodyCamera = new THREE.PerspectiveCamera(75, bodyContainer.clientWidth / 300, 0.1, 1000);
        bodyRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        bodyRenderer.setSize(bodyContainer.clientWidth, 300);
        bodyContainer.appendChild(bodyRenderer.domElement);
        
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x007bff, transparent: true, opacity: 0.9 });
        bodyModel = new THREE.Group();
        
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), bodyMaterial);
        head.position.y = 1.8;
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.5, 32), bodyMaterial);
        torso.position.y = 0.5;
        // ... more shapes for limbs ...
        bodyModel.add(head);
        bodyModel.add(torso);
        bodyScene.add(bodyModel);
        
        bodyCamera.position.z = 5;

        // --- Create Skeleton Model ---
        skeletonScene = new THREE.Scene();
        skeletonCamera = new THREE.PerspectiveCamera(75, skeletonContainer.clientWidth / 300, 0.1, 1000);
        skeletonRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        skeletonRenderer.setSize(skeletonContainer.clientWidth, 300);
        skeletonContainer.appendChild(skeletonRenderer.domElement);

        const skeletonMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true });
        skeletonModel = new THREE.Group();
        
        const skelHead = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), skeletonMaterial);
        skelHead.position.y = 1.8;
        const skelTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.5, 16), skeletonMaterial);
        skelTorso.position.y = 0.5;
        // ... more shapes for limbs ...
        skeletonModel.add(skelHead);
        skeletonModel.add(skelTorso);
        skeletonScene.add(skeletonModel);
        
        skeletonCamera.position.z = 5;

        // --- Lighting (for Body Model) ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        bodyScene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        bodyScene.add(pointLight);
        
        // --- Start Animation ---
        animateModels();
        
        // --- Handle Resizing ---
        window.addEventListener('resize', onWindowResize, false);
    }

    function animateModels() {
        requestAnimationFrame(animateModels);
        
        if (bodyModel) bodyModel.rotation.y += 0.01;
        if (skeletonModel) skeletonModel.rotation.y -= 0.01;
        
        if (bodyRenderer) bodyRenderer.render(bodyScene, bodyCamera);
        if (skeletonRenderer) skeletonRenderer.render(skeletonScene, skeletonCamera);
    }

    function onWindowResize() {
        const bodyContainer = document.getElementById('body-canvas-container');
        const skeletonContainer = document.getElementById('skeleton-canvas-container');

        if (bodyContainer && bodyRenderer) {
            bodyCamera.aspect = bodyContainer.clientWidth / 300;
            bodyCamera.updateProjectionMatrix();
            bodyRenderer.setSize(bodyContainer.clientWidth, 300);
        }
        if (skeletonContainer && skeletonRenderer) {
            skeletonCamera.aspect = skeletonContainer.clientWidth / 300;
            skeletonCamera.updateProjectionMatrix();
            skeletonRenderer.setSize(skeletonContainer.clientWidth, 300);
        }
    }

    // --- INITIALIZATION ---
    showPage(pages.landing); // Start on the landing page
    init3DModels(); // Initialize the 3D models

});