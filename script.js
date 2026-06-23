document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordInput = document.getElementById('passwordInput');
    const toggleVisibility = document.getElementById('toggleVisibility');
    const copyPassword = document.getElementById('copyPassword');
    const generatePassword = document.getElementById('generatePassword');
    const generatePassphrase = document.getElementById('generatePassphrase');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const scoreText = document.getElementById('scoreText');
    const themeToggle = document.getElementById('themeToggle');
    const apiStatus = document.getElementById('apiStatus');
    const gaugeFill = document.getElementById('gaugeFill');
    const gaugeValue = document.getElementById('gaugeValue');
    const copyReport = document.getElementById('copyReport');
    
    // New elements
    const genLength = document.getElementById('genLength');
    const lengthValueGen = document.getElementById('lengthValueGen');
    const genUpper = document.getElementById('genUpper');
    const genLower = document.getElementById('genLower');
    const genNumbers = document.getElementById('genNumbers');
    const genSymbols = document.getElementById('genSymbols');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const historyList = document.getElementById('historyList');
    
    // Checklist items
    const lengthCheck = document.getElementById('lengthCheck');
    const uppercaseCheck = document.getElementById('uppercaseCheck');
    const lowercaseCheck = document.getElementById('lowercaseCheck');
    const numberCheck = document.getElementById('numberCheck');
    const symbolCheck = document.getElementById('symbolCheck');
    const sequenceCheck = document.getElementById('sequenceCheck');
    const repeatCheck = document.getElementById('repeatCheck');
    const commonCheck = document.getElementById('commonCheck');
    
    // Stat values
    const lengthValue = document.getElementById('lengthValue');
    const entropyValue = document.getElementById('entropyValue');
    const charTypes = document.getElementById('charTypes');
    const pwnedCount = document.getElementById('pwnedCount');
    const crackTimeValue = document.getElementById('crackTimeValue');
    
    // Recommendations container
    const recommendations = document.getElementById('recommendations');
    
    // Common passwords list (top ~40 worst passwords)
    const commonPasswords = new Set([
        'password', '123456', '123456789', 'qwerty', 'abc123', 'password1', '12345678', '111111',
        '123123', 'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'sunshine',
        'princess', 'football', 'shadow', 'superman', 'michael', 'batman', 'trustno1', 'iloveyou',
        '000000', '1234', '12345', '1234567', '1234567890', 'qwerty123', 'password123', '1q2w3e4r',
        'baseball', 'starwars', 'passw0rd', 'whatever', 'whatever1', 'hello123', 'freedom', 'whatever'
    ]);

    // Small word list for passphrase generation
    const wordList = [
        'apple', 'brave', 'cloud', 'delta', 'eagle', 'flame', 'ghost', 'happy', 'ivory', 'jelly',
        'knight', 'lemon', 'magic', 'noble', 'ocean', 'pixel', 'quiet', 'river', 'spark', 'tiger',
        'unity', 'vivid', 'whale', 'xenon', 'youth', 'zebra', 'amber', 'blaze', 'coral', 'drift',
        'ember', 'frost', 'grove', 'haven', 'iris', 'jade', 'kale', 'lunar', 'moss', 'nova'
    ];

    // Password visibility toggle
    let isPasswordVisible = false;
    toggleVisibility.addEventListener('click', function() {
        isPasswordVisible = !isPasswordVisible;
        passwordInput.type = isPasswordVisible ? 'text' : 'password';
        toggleVisibility.innerHTML = isPasswordVisible ? 
            '<i class="fas fa-eye-slash"></i>' : 
            '<i class="fas fa-eye"></i>';
    });
    
    // Copy password to clipboard
    copyPassword.addEventListener('click', function() {
        if (passwordInput.value) {
            navigator.clipboard.writeText(passwordInput.value).then(() => {
                const originalText = copyPassword.innerHTML;
                copyPassword.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyPassword.innerHTML = originalText;
                }, 1500);
            });
        }
    });

    // Length slider for generator
    genLength.addEventListener('input', function() {
        lengthValueGen.textContent = this.value;
    });

    // Generate secure password (improved)
    generatePassword.addEventListener('click', function() {
        const length = parseInt(genLength.value);
        let charset = '';
        
        if (genUpper.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (genLower.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (genNumbers.checked) charset += '0123456789';
        if (genSymbols.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        if (charset === '') {
            alert('Please select at least one character type!');
            return;
        }
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        passwordInput.value = password;
        passwordInput.type = 'text';
        isPasswordVisible = true;
        toggleVisibility.innerHTML = '<i class="fas fa-eye-slash"></i>';
        
        analyzePassword(password);
    });

    // Generate memorable passphrase
    generatePassphrase.addEventListener('click', function() {
        const numWords = 4;
        let passphrase = '';
        
        for (let i = 0; i < numWords; i++) {
            const word = wordList[Math.floor(Math.random() * wordList.length)];
            passphrase += word.charAt(0).toUpperCase() + word.slice(1);
            if (i < numWords - 1) passphrase += '-';
        }
        
        // Add a number and symbol for extra strength
        passphrase += Math.floor(Math.random() * 90) + 10;
        passphrase += ['!', '@', '#', '$'][Math.floor(Math.random() * 4)];
        
        passwordInput.value = passphrase;
        passwordInput.type = 'text';
        isPasswordVisible = true;
        toggleVisibility.innerHTML = '<i class="fas fa-eye-slash"></i>';
        
        analyzePassword(passphrase);
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Real-time password analysis
    passwordInput.addEventListener('input', function() {
        analyzePassword(this.value);
    });
    
    // Copy full analysis report
    copyReport.addEventListener('click', function() {
        const password = passwordInput.value;
        if (!password) {
            alert('Analyze a password first!');
            return;
        }
        
        const report = generateAnalysisReport(password);
        navigator.clipboard.writeText(report).then(() => {
            const originalText = copyReport.innerHTML;
            copyReport.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyReport.innerHTML = originalText;
            }, 2000);
        });
    });

    // Clear history
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('Clear all password history?')) {
            localStorage.removeItem('shieldpass_history');
            renderHistory();
        }
    });

    // Main analysis function
    function analyzePassword(password) {
        if (!password) {
            resetUI();
            return;
        }

        const checks = performChecks(password);
        const score = calculateScore(checks, password);
        const entropy = calculateEntropy(password);
        const crackTime = estimateCrackTime(entropy, password);
        
        updateUI(checks, score, entropy, password, crackTime);
        
        // Check against HaveIBeenPwned
        if (password.length >= 4) {
            checkPwnedPassword(password);
        } else {
            pwnedCount.textContent = '-';
            apiStatus.innerHTML = '<i class="fas fa-circle"></i> <span>Enter at least 4 characters to check breaches</span>';
            apiStatus.className = 'api-status';
        }

        // Save to history
        saveToHistory(password, score, entropy);
    }

    function resetUI() {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'None';
        scoreText.textContent = '0%';
        lengthValue.textContent = '0';
        entropyValue.textContent = '0';
        charTypes.textContent = '0';
        pwnedCount.textContent = '-';
        crackTimeValue.textContent = 'N/A';
        gaugeFill.style.strokeDashoffset = 314;
        gaugeValue.textContent = '0';
        recommendations.innerHTML = `<div class="recommendation"><i class="fas fa-info-circle"></i> <span>Enter a password to get security recommendations</span></div>`;
        
        // Reset checks
        [lengthCheck, uppercaseCheck, lowercaseCheck, numberCheck, symbolCheck, sequenceCheck, repeatCheck, commonCheck].forEach(el => {
            el.className = 'check-item';
            el.innerHTML = el.innerHTML.replace(/<i.*?</i>/, '<i class="fas fa-times-circle"></i>');
        });
    }

    // Perform all password checks
    function performChecks(password) {
        const lower = password.toLowerCase();
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[^A-Za-z0-9]/.test(password),
            sequence: !hasKeyboardSequence(password),
            repeat: !hasRepeatedChars(password),
            common: !commonPasswords.has(lower)
        };
    }

    function hasKeyboardSequence(password) {
        const sequences = ['123456', 'abcdef', 'qwerty', 'asdfgh', 'zxcvbn', 'password', '12345678', '123456789', '1234567890'];
        const lower = password.toLowerCase();
        return sequences.some(seq => lower.includes(seq));
    }

    function hasRepeatedChars(password) {
        return /(.)\1{2,}/.test(password);
    }

    // Calculate password score (0-100)
    function calculateScore(checks, password) {
        let score = 0;
        
        if (checks.length) score += 18;
        if (checks.uppercase) score += 14;
        if (checks.lowercase) score += 14;
        if (checks.number) score += 14;
        if (checks.symbol) score += 14;
        if (checks.sequence) score += 8;
        if (checks.repeat) score += 8;
        if (checks.common) score += 10;
        
        // Length bonuses
        if (password.length >= 12) score += 8;
        if (password.length >= 16) score += 10;
        if (password.length >= 20) score += 5;
        
        return Math.min(Math.max(score, 0), 100);
    }

    // Calculate entropy
    function calculateEntropy(password) {
        if (!password) return 0;
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;
        
        return Math.round(Math.log2(Math.pow(charsetSize || 1, password.length)));
    }

    // Estimate realistic crack time
    function estimateCrackTime(entropy, password) {
        if (!password || entropy === 0) return { text: 'N/A', color: 'var(--gray)' };
        
        // Assumptions: 10 billion guesses per second (modern GPU cluster)
        const guessesPerSecond = 10_000_000_000;
        const guesses = Math.pow(2, entropy);
        const seconds = guesses / guessesPerSecond;
        
        if (seconds < 1) return { text: 'Instant', color: 'var(--danger)' };
        if (seconds < 60) return { text: `${Math.ceil(seconds)} seconds`, color: 'var(--danger)' };
        if (seconds < 3600) return { text: `${Math.ceil(seconds / 60)} minutes`, color: 'var(--danger)' };
        if (seconds < 86400) return { text: `${Math.ceil(seconds / 3600)} hours`, color: 'var(--warning)' };
        if (seconds < 31536000) return { text: `${Math.ceil(seconds / 86400)} days`, color: 'var(--warning)' };
        if (seconds < 315360000) return { text: `${Math.ceil(seconds / 31536000)} years`, color: '#4cd964' };
        
        return { text: 'Centuries+', color: 'var(--primary)' };
    }

    // Update UI
    function updateUI(checks, score, entropy, password, crackTime) {
        // Strength meter
        strengthFill.style.width = `${score}%`;
        
        let strengthLevel, strengthColor;
        if (score < 40) { strengthLevel = 'Weak'; strengthColor = 'var(--danger)'; }
        else if (score < 65) { strengthLevel = 'Fair'; strengthColor = 'var(--warning)'; }
        else if (score < 85) { strengthLevel = 'Good'; strengthColor = '#4cd964'; }
        else { strengthLevel = 'Strong'; strengthColor = 'var(--primary)'; }
        
        strengthFill.style.background = strengthColor;
        strengthText.textContent = strengthLevel;
        strengthText.style.color = strengthColor;
        scoreText.textContent = `${score}%`;
        
        // Update checklist
        updateCheckItem(lengthCheck, checks.length);
        updateCheckItem(uppercaseCheck, checks.uppercase);
        updateCheckItem(lowercaseCheck, checks.lowercase);
        updateCheckItem(numberCheck, checks.number);
        updateCheckItem(symbolCheck, checks.symbol);
        updateCheckItem(sequenceCheck, checks.sequence);
        updateCheckItem(repeatCheck, checks.repeat);
        updateCheckItem(commonCheck, checks.common);
        
        // Stats
        lengthValue.textContent = password.length;
        entropyValue.textContent = entropy;
        
        let typeCount = 0;
        if (checks.lowercase) typeCount++;
        if (checks.uppercase) typeCount++;
        if (checks.number) typeCount++;
        if (checks.symbol) typeCount++;
        charTypes.textContent = typeCount;
        
        // Entropy gauge
        const gaugeOffset = 314 - Math.min((entropy / 120) * 314, 314);
        gaugeFill.style.strokeDashoffset = gaugeOffset;
        gaugeValue.textContent = entropy;
        
        // Crack time
        crackTimeValue.textContent = crackTime.text;
        crackTimeValue.style.color = crackTime.color;
        
        // Recommendations
        updateRecommendations(checks, score, entropy, password);
    }

    function updateCheckItem(element, isValid) {
        const icon = isValid ? 'fa-check-circle' : 'fa-times-circle';
        const className = isValid ? 'check-item valid' : 'check-item invalid';
        element.className = className;
        element.innerHTML = `<i class="fas ${icon}"></i> ${element.textContent.split('> ').pop() || element.textContent}`;
    }

    // Update recommendations
    function updateRecommendations(checks, score, entropy, password) {
        recommendations.innerHTML = '';
        
        if (score >= 85) {
            recommendations.innerHTML += `<div class="recommendation positive"><i class="fas fa-check-circle"></i> <span>Excellent! This is a strong, secure password.</span></div>`;
        }
        
        if (!checks.length) {
            recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>Use at least 12-16 characters for better security.</span></div>`;
        }
        if (!checks.uppercase || !checks.lowercase) {
            recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-lightbulb"></i> <span>Mix uppercase and lowercase letters.</span></div>`;
        }
        if (!checks.number) {
            recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-lightbulb"></i> <span>Add numbers to increase complexity.</span></div>`;
        }
        if (!checks.symbol) {
            recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-lightbulb"></i> <span>Include symbols (!@#$ etc.) for stronger security.</span></div>`;
        }
        if (!checks.sequence) {
            recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>Avoid common sequences like "qwerty" or "123456".</span></div>`;
        }
        if (!checks.repeat) {
            recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>Avoid repeated characters (aaa, 111).</span></div>`;
        }
        if (!checks.common) {
            recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>This is a very common password. Change it immediately!</span></div>`;
        }
        if (entropy < 50) {
            recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-lightbulb"></i> <span>Increase randomness — consider using a passphrase.</span></div>`;
        }
    }

    // Check HaveIBeenPwned
    async function checkPwnedPassword(password) {
        try {
            apiStatus.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Checking against known breaches...</span>';
            apiStatus.className = 'api-status';
            
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
            
            const prefix = hashHex.substring(0, 5);
            const suffix = hashHex.substring(5);
            
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            if (!response.ok) throw new Error('API failed');
            
            const dataText = await response.text();
            const hashes = dataText.split('\n');
            
            let count = 0;
            for (const line of hashes) {
                const [hashSuffix, hashCount] = line.split(':');
                if (hashSuffix === suffix) {
                    count = parseInt(hashCount);
                    break;
                }
            }
            
            pwnedCount.textContent = count > 0 ? count.toLocaleString() : '0';
            
            if (count > 0) {
                apiStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>Seen in ${count.toLocaleString()} breaches! Do not use.</span>`;
                apiStatus.className = 'api-status error';
                recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>This password has been exposed in data breaches. Change it now!</span></div>`;
            } else {
                apiStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span>Not found in known breaches</span>';
                apiStatus.className = 'api-status connected';
            }
        } catch (error) {
            console.error(error);
            apiStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Unable to check breaches</span>';
            apiStatus.className = 'api-status error';
            pwnedCount.textContent = '?';
        }
    }

    // Generate analysis report for copying
    function generateAnalysisReport(password) {
        const checks = performChecks(password);
        const score = calculateScore(checks, password);
        const entropy = calculateEntropy(password);
        const crackTime = estimateCrackTime(entropy, password);
        
        let report = `ShieldPass Analysis Report\n`;
        report += `========================\n\n`;
        report += `Password: ${password.replace(/./g, '*')}\n`;
        report += `Score: ${score}% (${strengthText.textContent})\n`;
        report += `Entropy: ${entropy} bits\n`;
        report += `Estimated Crack Time: ${crackTime.text}\n`;
        report += `Length: ${password.length} characters\n\n`;
        report += `Checks Passed:\n`;
        if (checks.length) report += `  ✓ Length >= 8\n`;
        if (checks.uppercase) report += `  ✓ Contains uppercase\n`;
        if (checks.lowercase) report += `  ✓ Contains lowercase\n`;
        if (checks.number) report += `  ✓ Contains numbers\n`;
        if (checks.symbol) report += `  ✓ Contains symbols\n`;
        if (checks.sequence) report += `  ✓ No keyboard sequences\n`;
        if (checks.repeat) report += `  ✓ No repeated characters\n`;
        if (checks.common) report += `  ✓ Not a common password\n`;
        
        report += `\nGenerated on ${new Date().toLocaleString()}\n`;
        report += `ShieldPass v2.0 - https://github.com/moadh704/ShieldPass`;
        
        return report;
    }

    // History functions
    function saveToHistory(password, score, entropy) {
        let history = JSON.parse(localStorage.getItem('shieldpass_history') || '[]');
        
        // Avoid duplicates
        history = history.filter(item => item.password !== password);
        
        history.unshift({
            password: password,
            score: score,
            entropy: entropy,
            timestamp: new Date().toISOString()
        });
        
        if (history.length > 8) history = history.slice(0, 8);
        
        localStorage.setItem('shieldpass_history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('shieldpass_history') || '[]');
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = `<div class="history-empty">No passwords analyzed yet. Your history will appear here.</div>`;
            return;
        }
        
        history.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            const date = new Date(item.timestamp).toLocaleDateString();
            
            div.innerHTML = `
                <div class="history-info">
                    <span class="history-password">${item.password.replace(/./g, '•')}</span>
                    <span class="history-meta">${item.score}% • ${item.entropy} bits • ${date}</span>
                </div>
                <div class="history-actions">
                    <button class="btn btn-small load-btn" data-index="${index}"><i class="fas fa-redo"></i></button>
                </div>
            `;
            
            div.querySelector('.load-btn').addEventListener('click', () => {
                passwordInput.value = item.password;
                passwordInput.type = 'text';
                isPasswordVisible = true;
                toggleVisibility.innerHTML = '<i class="fas fa-eye-slash"></i>';
                analyzePassword(item.password);
            });
            
            historyList.appendChild(div);
        });
    }

    // Initialize
    function initialize() {
        // Update generator length display
        lengthValueGen.textContent = genLength.value;
        
        // Load history
        renderHistory();
        
        // Demo password
        setTimeout(() => {
            if (!passwordInput.value) {
                passwordInput.value = 'ExamplePass123!';
                analyzePassword('ExamplePass123!');
            }
        }, 600);
    }

    initialize();
});