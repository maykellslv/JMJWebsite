 // FAQ Side Window
 document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const faqPanel = document.getElementById('faq-panel');
    const faqOverlay = document.getElementById('faq-overlay');
    const faqClose = document.getElementById('faq-close');
    const faqNavLink = document.getElementById('faq-nav-link');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Open FAQ panel when FAQ nav link is clicked
    faqNavLink.addEventListener('click', function(e) {
      e.preventDefault();
      openFaqPanel();
    });
    
    // Open FAQ panel function
    function openFaqPanel() {
      faqPanel.classList.add('open');
      faqOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    
    // Close FAQ panel function
    function closeFaqPanel() {
      faqPanel.classList.remove('open');
      faqOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    
    // Close button event
    faqClose.addEventListener('click', closeFaqPanel);
    
    // Overlay click event
    faqOverlay.addEventListener('click', closeFaqPanel);
    
    // FAQ accordion functionality
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



    
    // Close panel when ESC key is pressed
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && faqPanel.classList.contains('open')) {
        closeFaqPanel();
      }
    });
  });

   // Event type selection
   document.querySelectorAll('.event-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.event-type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('eventType').value = this.dataset.event;
    });
});