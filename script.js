document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordInput = document.getElementById('passwordInput');
    const toggleVisibility = document.getElementById('toggleVisibility');
    const copyPassword = document.getElementById('copyPassword');
    const generatePassword = document.getElementById('generatePassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const scoreText = document.getElementById('scoreText');
    const themeToggle = document.getElementById('themeToggle');
    const apiStatus = document.getElementById('apiStatus');
    const gaugeFill = document.getElementById('gaugeFill');
    const gaugeValue = document.getElementById('gaugeValue');
    
    // Checklist items
    const lengthCheck = document.getElementById('lengthCheck');
    const uppercaseCheck = document.getElementById('uppercaseCheck');
    const lowercaseCheck = document.getElementById('lowercaseCheck');
    const numberCheck = document.getElementById('numberCheck');
    const symbolCheck = document.getElementById('symbolCheck');
    const sequenceCheck = document.getElementById('sequenceCheck');
    const repeatCheck = document.getElementById('repeatCheck');
    
    // Stat values
    const lengthValue = document.getElementById('lengthValue');
    const entropyValue = document.getElementById('entropyValue');
    const charTypes = document.getElementById('charTypes');
    const pwnedCount = document.getElementById('pwnedCount');
    
    // Recommendations container
    const recommendations = document.getElementById('recommendations');
    
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
            passwordInput.select();
            document.execCommand('copy');
            
            // Visual feedback
            const originalText = copyPassword.innerHTML;
            copyPassword.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyPassword.innerHTML = originalText;
            }, 1500);
        }
    });
    
    // Generate secure password
    generatePassword.addEventListener('click', function() {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        let password = "";
        const length = 16;
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        passwordInput.value = password;
        passwordInput.type = 'text';
        isPasswordVisible = true;
        toggleVisibility.innerHTML = '<i class="fas fa-eye-slash"></i>';
        
        analyzePassword(password);
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
    
    // Password analysis function
    function analyzePassword(password) {
        const checks = performChecks(password);
        const score = calculateScore(checks, password);
        const entropy = calculateEntropy(password);
        updateUI(checks, score, entropy, password);
        
        // Check password against HaveIBeenPwned API
        if (password.length >= 4) {
            checkPwnedPassword(password);
        } else {
            pwnedCount.textContent = '-';
            apiStatus.innerHTML = '<i class="fas fa-circle"></i> <span>Enter at least 4 characters to check against breaches</span>';
            apiStatus.className = 'api-status';
        }
    }
    
    // Perform all password checks
    function performChecks(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[^A-Za-z0-9]/.test(password),
            sequence: !hasKeyboardSequence(password),
            repeat: !hasRepeatedChars(password)
        };
    }
    
    // Check for keyboard sequences
    function hasKeyboardSequence(password) {
        const sequences = [
            '123456', 'abcdef', 'qwerty', 'asdfgh', 'zxcvbn',
            'password', '12345678', '123456789', '1234567890'
        ];
        
        const lowerPassword = password.toLowerCase();
        return sequences.some(seq => lowerPassword.includes(seq));
    }
    
    // Check for repeated characters
    function hasRepeatedChars(password) {
        return /(.)\1{2,}/.test(password);
    }
    
    // Calculate password score (0-100)
    function calculateScore(checks, password) {
        let score = 0;
        
        // Base points for checks
        if (checks.length) score += 20;
        if (checks.uppercase) score += 15;
        if (checks.lowercase) score += 15;
        if (checks.number) score += 15;
        if (checks.symbol) score += 15;
        if (checks.sequence) score += 10;
        if (checks.repeat) score += 10;
        
        // Bonus points for length
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;
        
        return Math.min(score, 100);
    }
    
    // Calculate password entropy
    function calculateEntropy(password) {
        if (password.length === 0) return 0;
        
        // Character set size estimation
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32; // Common symbols
        
        // Entropy formula: log2(charsetSize^length)
        return Math.round(Math.log2(Math.pow(charsetSize, password.length)));
    }
    
    // Update UI based on analysis
    function updateUI(checks, score, entropy, password) {
        // Update strength meter
        strengthFill.style.width = `${score}%`;
        
        // Update strength text and color
        let strengthLevel, strengthColor;
        if (score < 40) {
            strengthLevel = "Weak";
            strengthColor = "var(--danger)";
        } else if (score < 70) {
            strengthLevel = "Fair";
            strengthColor = "var(--warning)";
        } else if (score < 90) {
            strengthLevel = "Good";
            strengthColor = "#4cd964";
        } else {
            strengthLevel = "Strong";
            strengthColor = "var(--primary)";
        }
        
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
        
        // Update stats
        lengthValue.textContent = password.length;
        entropyValue.textContent = entropy;
        
        // Count character types
        let typeCount = 0;
        if (checks.lowercase) typeCount++;
        if (checks.uppercase) typeCount++;
        if (checks.number) typeCount++;
        if (checks.symbol) typeCount++;
        charTypes.textContent = typeCount;
        
        // Update entropy gauge
        const gaugeOffset = 314 - (entropy / 100 * 314);
        gaugeFill.style.strokeDashoffset = Math.min(gaugeOffset, 314);
        gaugeValue.textContent = entropy;
        
        // Update recommendations
        updateRecommendations(checks, score, entropy, password);
    }
    
    // Update individual checklist item
    function updateCheckItem(element, isValid) {
        if (isValid) {
            element.className = "check-item valid";
            element.innerHTML = '<i class="fas fa-check-circle"></i> ' + element.textContent;
        } else {
            element.className = "check-item invalid";
            element.innerHTML = '<i class="fas fa-times-circle"></i> ' + element.textContent;
        }
    }
    
    // Update recommendations
    function updateRecommendations(checks, score, entropy, password) {
        recommendations.innerHTML = '';
        
        if (password.length === 0) {
            recommendations.innerHTML = `
                <div class="recommendation">
                    <i class="fas fa-info-circle"></i>
                    <span>Enter a password to get security recommendations</span>
                </div>
            `;
            return;
        }
        
        // Positive feedback for strong passwords
        if (score >= 80) {
            recommendations.innerHTML += `
                <div class="recommendation positive">
                    <i class="fas fa-check-circle"></i>
                    <span>Great! Your password has strong security characteristics.</span>
                </div>
            `;
        }
        
        // Length recommendations
        if (password.length < 8) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Your password is too short. Use at least 8 characters.</span>
                </div>
            `;
        } else if (password.length < 12) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-lightbulb"></i>
                    <span>Consider using 12 or more characters for better security.</span>
                </div>
            `;
        }
        
        // Character diversity recommendations
        if (!checks.uppercase) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-lightbulb"></i>
                    <span>Add uppercase letters to increase password strength.</span>
                </div>
            `;
        }
        
        if (!checks.lowercase) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-lightbulb"></i>
                    <span>Add lowercase letters to increase password strength.</span>
                </div>
            `;
        }
        
        if (!checks.number) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-lightbulb"></i>
                    <span>Include numbers to make your password harder to guess.</span>
                </div>
            `;
        }
        
        if (!checks.symbol) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-lightbulb"></i>
                    <span>Add symbols (like !, @, #) to improve security.</span>
                </div>
            `;
        }
        
        // Pattern recommendations
        if (!checks.sequence) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Avoid common keyboard sequences like "qwerty" or "123456".</span>
                </div>
            `;
        }
        
        if (!checks.repeat) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Avoid repeated characters (like "aaa" or "111").</span>
                </div>
            `;
        }
        
        // Entropy recommendations
        if (entropy < 40) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Your password has low entropy. Consider making it more random.</span>
                </div>
            `;
        } else if (entropy < 60) {
            recommendations.innerHTML += `
                <div class="recommendation">
                    <i class="fas fa-lightbulb"></i>
                    <span>Your password has moderate entropy. More randomness would help.</span>
                </div>
            `;
        }
    }
    
    // Check password against HaveIBeenPwned API
    async function checkPwnedPassword(password) {
        try {
            apiStatus.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Checking against known breaches...</span>';
            apiStatus.className = 'api-status';
            
            // Create SHA-1 hash of the password
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
            
            // Use k-anonymity model (send only first 5 chars of hash)
            const prefix = hashHex.substring(0, 5);
            const suffix = hashHex.substring(5);
            
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
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
            
            pwnedCount.textContent = count;
            
            if (count > 0) {
                apiStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>This password has been seen in ${count.toLocaleString()} data breaches!</span>`;
                apiStatus.className = 'api-status error';
                
                // Add pwned warning to recommendations
                recommendations.innerHTML += `
                    <div class="recommendation">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>This password has been exposed in data breaches. Do not use it!</span>
                    </div>
                `;
            } else {
                apiStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span>Password not found in known breaches</span>';
                apiStatus.className = 'api-status connected';
            }
        } catch (error) {
            console.error('Error checking pwned passwords:', error);
            apiStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Unable to check breaches (API error)</span>';
            apiStatus.className = 'api-status error';
            pwnedCount.textContent = '?';
        }
    }
    
    // Initialize with example password
    setTimeout(() => {
        passwordInput.value = 'ExamplePass123!';
        analyzePassword('ExamplePass123!');
    }, 500);
});