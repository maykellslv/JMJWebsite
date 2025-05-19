window.addEventListener('load', () => {
  const preloaderWrapper = document.getElementById('preloader-wrapper');

  preloaderWrapper.classList.add('fade-out');
  setTimeout(() => {
    preloaderWrapper.style.display = 'none';
  }, 500); 
  document.body.classList.add('visible');
});

document.addEventListener('DOMContentLoaded', function() {
  // Gallery item animations
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    
    item.addEventListener('click', function(e) {
      if (!e.target.classList.contains('gallery-btn')) {
        const title = this.querySelector('h3').textContent;
        const description = this.querySelector('p').textContent;
        const bgImage = this.querySelector('.gallery-image-wrapper').style.backgroundImage;
        console.log(`Opening ${title}: ${description}`);
        console.log(`Image: ${bgImage}`);
      }
    });
    
    const btn = item.querySelector('.gallery-btn');
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const category = this.closest('.gallery-item').querySelector('h3').textContent;
        console.log(`View more clicked for ${category}`);
      });
    }
  });
  
  // Service box animations
  const serviceBoxes = document.querySelectorAll('.service-box');
  serviceBoxes.forEach((box, index) => {
    box.style.transitionDelay = `${index * 0.1}s`;
  });
});

// Intersection Observer for gallery cards
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.gallery-card');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => {
    observer.observe(card);
  });
});

// ----------- Calendar Code -----------
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let availabilityData = {};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  fetchAvailabilityData();
});

// Fetch availability data from backend API
function fetchAvailabilityData() {
  fetch('http://localhost:10000/api/calendar-availability')  // Change port if needed
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        availabilityData = data.data;
        renderCalendar(currentMonth, currentYear);
      } else {
        console.error('API responded with success: false');
        renderCalendar(currentMonth, currentYear); // Still render with empty data
      }
    })
    .catch(error => {
      console.error('Error fetching availability data:', error);
      // Render calendar even if fetch fails, with empty availabilityData
      availabilityData = {};
      renderCalendar(currentMonth, currentYear);
    });
}

function renderCalendar(month, year) {
  const pad = (num) => num.toString().padStart(2, '0');
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  const calendarDates = document.getElementById('calendar-dates');
  const currentMonthYear = document.getElementById('current-month-year');

  currentMonthYear.textContent = `${monthNames[month]} ${year}`;
  calendarDates.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.classList.add('calendar-day', 'empty');
    calendarDates.appendChild(emptyDay);
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    console.log(dateStr, availabilityData[dateStr]); // check what status is here

    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.textContent = day;

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayElement.classList.add('today');
    }

    if (availabilityData[dateStr]) {
      dayElement.classList.add(availabilityData[dateStr]); // add 'booked' or 'limited'
    } else {
      dayElement.classList.add('available');
    }

    dayElement.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
      dayElement.classList.add('selected');
      selectedDate = new Date(year, month, day);
      alert(`Selected date: ${selectedDate.toDateString()}`);
    });

    calendarDates.appendChild(dayElement);
  }
}


// ----------- FAQ Side Window -----------

document.addEventListener('DOMContentLoaded', function() {
  const faqPanel = document.getElementById('faq-panel');
  const faqOverlay = document.getElementById('faq-overlay');
  const faqClose = document.getElementById('faq-close');
  const faqNavLink = document.getElementById('faq-nav-link');
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqNavLink.addEventListener('click', function(e) {
    e.preventDefault();
    openFaqPanel();
  });
  
  function openFaqPanel() {
    faqPanel.classList.add('open');
    faqOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeFaqPanel() {
    faqPanel.classList.remove('open');
    faqOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  faqClose.addEventListener('click', closeFaqPanel);
  faqOverlay.addEventListener('click', closeFaqPanel);
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      this.classList.toggle('active');
      const answer = this.nextElementSibling;
      if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && faqPanel.classList.contains('open')) {
      closeFaqPanel();
    }
  });
});

// ----------- Event Type Selection -----------

document.querySelectorAll('.event-type-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.event-type-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('eventType').value = this.dataset.event;
  });
});

// ----------- Form Submission -----------

const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

document.querySelectorAll('.event-type-btn').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.event-type-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('eventType').value = this.dataset.event;
  });
});

document.getElementById('submitEvent').addEventListener('click', async function() {
  const form = document.getElementById('eventForm');
  if (form.checkValidity()) {
    const submitBtn = this;
    const submitText = document.getElementById('submitText');
    const spinner = document.getElementById('submitSpinner');
    
    submitText.textContent = "Processing...";
    spinner.style.display = "inline-block";
    submitBtn.disabled = true;
    
    try {
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        eventType: document.getElementById('eventType').value,
        eventDate: document.getElementById('eventDate').value,
        guestCount: document.getElementById('guestCount').value,
        specialRequests: document.getElementById('specialRequests').value
      };
      
      await simulateAPICall(formData);
      
      showStatusMessage('Reservation confirmed!', 'success');
      
      setTimeout(() => {
        eventModal.hide();
        submitText.textContent = "Submit Registration";
        spinner.style.display = "none";
        submitBtn.disabled = false;
        form.reset();
        showConfirmation(formData);
      }, 1500);
      
    } catch (error) {
      showStatusMessage('Error submitting reservation', 'error');
      submitText.textContent = "Submit Registration";
      spinner.style.display = "none";
      submitBtn.disabled = false;
    }
  } else {
    form.reportValidity();
  }
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function simulateAPICall(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        console.log('API call successful:', data);
        resolve(data);
      } else {
        console.log('API call failed');
        reject(new Error('API call failed'));
      }
    }, 2000);
  });
}

function showStatusMessage(message, type) {
  const statusElement = document.getElementById('apiStatus');
  const spinner = document.getElementById('loadingSpinner');
  const statusText = document.getElementById('statusText');
  
  statusElement.style.background = type === 'success' ? '#28a745' : '#dc3545';
  spinner.style.display = 'none';
  statusText.textContent = message;
  statusElement.style.opacity = '1';
  
  setTimeout(() => {
    statusElement.style.opacity = '0';
  }, 3000);
}
