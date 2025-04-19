
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const icon = themeToggle.querySelector('i');
      if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        if(this.getAttribute('href') === '#') return;
        
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if(mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
          }
        }
      });
    });

    // Scroll spy: highlight nav based on scroll
    window.addEventListener("scroll", () => {
      const sections = document.querySelectorAll("section");
      const navLinks = document.querySelectorAll("nav a");
      let current = "";

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });

      // Show/hide back to top button
      const backToTop = document.getElementById('backToTop');
      if(window.pageYOffset > 300) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    });

    // Back to top button
    document.getElementById('backToTop').addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Calculator functions
    const calculators = ['sipCalculator', 'lumpsumCalculator', 'swpCalculator', 'retirementCalculator'];
    let sipChart, lumpChart, swpChart, retirementChart;

    function showCalculator(id) {
      // Hide all calculators first
      calculators.forEach(cal => {
        document.getElementById(cal).style.display = "none";
      });
      
      // Hide calculator cards
      document.getElementById('calculatorCards').style.display = "none";
      
      // Show the selected calculator
      document.getElementById(id).style.display = "block";
      
      // Scroll to the calculator
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
      
      // Calculate immediately
      if (id === "sipCalculator") calculateSIP();
      else if (id === "lumpsumCalculator") calculateLumpsum();
      else if (id === "swpCalculator") calculateSWP();
      else if (id === "retirementCalculator") calculateRetirement();
    }

    function showCalculatorCards() {
      // Hide all calculators
      calculators.forEach(cal => {
        document.getElementById(cal).style.display = "none";
      });
      
      // Show calculator cards
      document.getElementById('calculatorCards').style.display = "grid";
      
      // Scroll to calculators section
      document.getElementById('calculators').scrollIntoView({ behavior: 'smooth' });
    }

    function syncInput(slider, inputId) {
      document.getElementById(inputId).value = slider.value;
      updateSliderGradient(slider);
      if (inputId.includes('sip')) calculateSIP();
      else if (inputId.includes('lump')) calculateLumpsum();
      else if (inputId.includes('swp')) calculateSWP();
      else if (inputId.includes('retirement') || inputId.includes('Age') || inputId.includes('Expenses') || inputId.includes('Return')) calculateRetirement();
    }

    function syncSlider(input, sliderId) {
      const slider = document.getElementById(sliderId);
      slider.value = input.value;
      updateSliderGradient(slider);
      if (sliderId.includes('sip')) calculateSIP();
      else if (sliderId.includes('lump')) calculateLumpsum();
      else if (sliderId.includes('swp')) calculateSWP();
      else if (sliderId.includes('retirement') || sliderId.includes('Age') || sliderId.includes('Expenses') || sliderId.includes('Return')) calculateRetirement();
    }

    function updateSliderGradient(slider) {
      const percent = 100 * (slider.value - slider.min) / (slider.max - slider.min);
      slider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percent}%, #d3d3d3 ${percent}%, #d3d3d3 100%)`;
    }

    // Initialize all sliders
    document.querySelectorAll('input[type=range]').forEach(slider => updateSliderGradient(slider));

    function calculateSIP() {
      const P = parseFloat(document.getElementById("sipAmount").value);
      const n = parseInt(document.getElementById("sipYears").value);
      const r = parseFloat(document.getElementById("sipReturn").value) / 100 / 12;
      const months = n * 12;

      const futureValue = P * ((Math.pow(1 + r, months) - 1) * (1 + r)) / r;
      const invested = P * months;
      const gains = futureValue - invested;

      document.getElementById("sipResult").innerHTML = `
        <strong>Future Value:</strong> ₹${Math.round(futureValue).toLocaleString()}
      `;

      document.getElementById("sipDetails").innerHTML = `
        <p><strong>Total Invested:</strong> ₹${Math.round(invested).toLocaleString()}</p>
        <p><strong>Estimated Gains:</strong> ₹${Math.round(gains).toLocaleString()}</p>
        <p><strong>Return on Investment:</strong> ${Math.round((gains/invested)*100)}%</p>
      `;

      if (sipChart) sipChart.destroy();
      sipChart = new Chart(document.getElementById("sipChart"), {
        type: 'doughnut',
        data: {
          labels: ['Invested Amount', 'Gains'],
          datasets: [{
            data: [invested, gains],
            backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--chart-color-1').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--chart-color-2').trim()],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    function calculateLumpsum() {
      const P = parseFloat(document.getElementById("lumpAmount").value);
      const n = parseInt(document.getElementById("lumpYears").value);
      const r = parseFloat(document.getElementById("lumpReturn").value) / 100;

      const futureValue = P * Math.pow(1 + r, n);
      const gains = futureValue - P;

      document.getElementById("lumpResult").innerHTML = `
        <strong>Future Value:</strong> ₹${Math.round(futureValue).toLocaleString()}
      `;

      document.getElementById("lumpDetails").innerHTML = `
        <p><strong>Principal Amount:</strong> ₹${Math.round(P).toLocaleString()}</p>
        <p><strong>Estimated Gains:</strong> ₹${Math.round(gains).toLocaleString()}</p>
        <p><strong>CAGR:</strong> ${Math.round(r*100)}%</p>
      `;

      if (lumpChart) lumpChart.destroy();
      lumpChart = new Chart(document.getElementById("lumpChart"), {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Gains'],
          datasets: [{
            data: [P, gains],
            backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--chart-color-1').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--chart-color-2').trim()],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    function calculateSWP() {
      const P = parseFloat(document.getElementById("swpAmount").value);
      const withdrawal = parseFloat(document.getElementById("swpWithdrawal").value);
      const n = parseInt(document.getElementById("swpYears").value);
      const r = parseFloat(document.getElementById("swpReturn").value) / 100 / 12;
      const months = n * 12;
      
      // Calculate total withdrawals and final balance
      let balance = P;
      let totalWithdrawn = 0;
      
      for (let i = 0; i < months; i++) {
        if (balance <= 0) break;
        
        // Apply monthly return
        balance = balance * (1 + r);
        
        // Withdraw amount
        const withdrawnThisMonth = Math.min(withdrawal, balance);
        balance -= withdrawnThisMonth;
        totalWithdrawn += withdrawnThisMonth;
      }
      
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      document.getElementById("swpResult").innerHTML = `
        <strong>Final Balance:</strong> ₹${Math.round(balance).toLocaleString()}
      `;
      
      document.getElementById("swpDetails").innerHTML = `
        <p><strong>Total Withdrawn:</strong> ₹${Math.round(totalWithdrawn).toLocaleString()}</p>
        <p><strong>Initial Investment:</strong> ₹${Math.round(P).toLocaleString()}</p>
        <p><strong>Monthly Withdrawal:</strong> ₹${withdrawal.toLocaleString()}</p>
        <p><strong>Withdrawal Period:</strong> ${years} years ${remainingMonths} months</p>
      `;
      
      if (swpChart) swpChart.destroy();
      
      swpChart = new Chart(document.getElementById("swpChart"), {
        type: 'doughnut',
        data: {
          labels: ['Total Withdrawn', 'Remaining Balance'],
          datasets: [{
            data: [totalWithdrawn, Math.max(0, balance)],
            backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--chart-color-1').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--chart-color-2').trim()],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    function calculateRetirement() {
      const currentAge = parseInt(document.getElementById("currentAge").value);
      const retirementAge = parseInt(document.getElementById("retirementAge").value);
      const lifeExpectancy = parseInt(document.getElementById("lifeExpectancy").value);
      const currentExpenses = parseFloat(document.getElementById("currentExpenses").value);
      const inflationRate = parseFloat(document.getElementById("inflationRate").value) / 100;
      const preRetirementReturn = parseFloat(document.getElementById("preRetirementReturn").value) / 100;
      const postRetirementReturn = parseFloat(document.getElementById("postRetirementReturn").value) / 100;
      
      const yearsToRetirement = retirementAge - currentAge;
      const retirementYears = lifeExpectancy - retirementAge;
      
      // Calculate future expenses at retirement
      const futureMonthlyExpenses = currentExpenses * Math.pow(1 + inflationRate, yearsToRetirement);
      const annualExpenses = futureMonthlyExpenses * 12;
      
      // Calculate retirement corpus needed (using present value of annuity formula)
      const monthlyReturn = postRetirementReturn / 12;
      const monthsInRetirement = retirementYears * 12;
      
      let corpusNeeded = 0;
      if (monthlyReturn > 0) {
        corpusNeeded = futureMonthlyExpenses * 
                      ((1 - Math.pow(1 + monthlyReturn, -monthsInRetirement)) / monthlyReturn);
      } else {
        corpusNeeded = futureMonthlyExpenses * monthsInRetirement;
      }
      
      // Calculate monthly savings needed
      const monthlySavingsReturn = preRetirementReturn / 12;
      const monthsToRetirement = yearsToRetirement * 12;
      
      let monthlySavings = 0;
      if (monthlySavingsReturn > 0) {
        monthlySavings = corpusNeeded * monthlySavingsReturn / 
                        (Math.pow(1 + monthlySavingsReturn, monthsToRetirement) - 1);
      } else {
        monthlySavings = corpusNeeded / monthsToRetirement;
      }
      
      document.getElementById("retirementResult").innerHTML = `
        <strong>Retirement Corpus Needed:</strong> ₹${Math.round(corpusNeeded).toLocaleString()}
      `;
      
      document.getElementById("retirementDetails").innerHTML = `
        <p><strong>Monthly Savings Needed:</strong> ₹${Math.round(monthlySavings).toLocaleString()}</p>
        <p><strong>Current Age:</strong> ${currentAge} years</p>
        <p><strong>Retirement Age:</strong> ${retirementAge} years</p>
        <p><strong>Retirement Duration:</strong> ${retirementYears} years</p>
        <p><strong>Monthly Expenses at Retirement:</strong> ₹${Math.round(futureMonthlyExpenses).toLocaleString()}</p>
      `;
      
      if (retirementChart) retirementChart.destroy();
      
      retirementChart = new Chart(document.getElementById("retirementChart"), {
        type: 'doughnut',
        data: {
          labels: ['Corpus Needed', 'Monthly Savings'],
          datasets: [{
            data: [corpusNeeded, monthlySavings * monthsToRetirement],
            backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--chart-color-1').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--chart-color-2').trim()],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // Form submissions
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      this.reset();
    });

    function showForgotPassword() {
      alert('Password reset link will be sent to your registered email.');
    }

    function showRegister() {
      alert('Registration form will be displayed here.');
    }

    // Basic login validation
    function validateLogin(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (username === "demo@rrwealth.com" && password === "wealth2025") {
        alert("Login successful! Redirecting to your dashboard...");
        return true;
      } else {
        alert("Invalid credentials. Please try again.");
        return false;
      }
    }

    // Initialize calculators on page load
    document.addEventListener('DOMContentLoaded', function() {
      // Set up event listeners for all calculator cards
      document.querySelectorAll('#calculatorCards .card').forEach(card => {
        card.addEventListener('click', function() {
          const calculatorId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
          showCalculator(calculatorId);
        });
      });
    });
