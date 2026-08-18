/**
 * Modon Ras El Hekma Landing Page JavaScript
 * Brand: propertiesegy
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize International Telephone Input
  const phoneInput = document.querySelector('#phoneNumber');
  let iti = null;

  if (phoneInput && window.intlTelInput) {
    iti = window.intlTelInput(phoneInput, {
      initialCountry: 'eg',
      preferredCountries: ['eg', 'sa', 'ae', 'kw', 'qa', 'us', 'gb', 'de'],
      separateDialCode: true,
      utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js',
      autoPlaceholder: 'polite',
      formatOnDisplay: true
    });
  }

  // 2. Sticky Header scroll effect
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // 3. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Interactive Gallery Slider
  const galleryImages = [
    {
      src: 'assets/images/gallery-1-cm9GHC-Z.webp',
      title: 'Beachfront Promenade & Luxury Residences',
      desc: 'Pristine coastal living with direct Mediterranean beachfront views.'
    },
    {
      src: 'assets/images/gallery-2-m_ze3mGK.webp',
      title: 'ADQ & Modon Strategic Partnership',
      desc: 'World-class visionary consortium transforming Ras El Hekma.'
    },
    {
      src: 'assets/images/gallery-3-DcnA52Hw.webp',
      title: 'Aerial View of Ras El Hekma Master Development',
      desc: 'Egypt’s premier Mediterranean destination crafted for high capital appreciation.'
    },
    {
      src: 'assets/images/gallery-4-kKPHtiVz.webp',
      title: 'Mediterranean Architecture & Infinity Lagoons',
      desc: 'Elegant architectural lines designed for serenity and comfort.'
    },
    {
      src: 'assets/images/gallery-5-Cm_BMltj.webp',
      title: 'Waterfront Sanctuary & Coastal Villas',
      desc: 'Bespoke coastal residences with lush landscaped masterplanning.'
    }
  ];

  let currentGalleryIndex = 0;
  const mainGalleryImg = document.getElementById('galleryMainImg');
  const galleryCaption = document.getElementById('galleryCaption');
  const galleryThumbs = document.querySelectorAll('.thumb-item');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  function updateGallery(index) {
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;
    currentGalleryIndex = index;

    if (mainGalleryImg) {
      mainGalleryImg.style.opacity = '0.3';
      setTimeout(() => {
        mainGalleryImg.src = galleryImages[index].src;
        mainGalleryImg.alt = galleryImages[index].title;
        mainGalleryImg.style.opacity = '1';
      }, 150);
    }

    if (galleryCaption) {
      galleryCaption.textContent = galleryImages[index].title;
    }

    galleryThumbs.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => updateGallery(currentGalleryIndex - 1));
    nextBtn.addEventListener('click', () => updateGallery(currentGalleryIndex + 1));
  }

  galleryThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => updateGallery(i));
  });

  // 5. Web3Forms Submission & WhatsApp integration
  const leadForm = document.getElementById('leadRegistrationForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const toastModal = document.getElementById('toastModal');
  const toastMsg = document.getElementById('toastMsg');
  const toastTitle = document.getElementById('toastTitle');

  function showToast(title, message, isSuccess = true) {
    if (!toastModal) return;
    toastTitle.textContent = title;
    toastMsg.textContent = message;
    toastModal.classList.add('show');
    setTimeout(() => {
      toastModal.classList.remove('show');
    }, 6000);
  }

  const toastClose = document.getElementById('toastClose');
  if (toastClose) {
    toastClose.addEventListener('click', () => toastModal.classList.remove('show'));
  }

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      let fullPhoneNumber = '';
      
      if (iti) {
        fullPhoneNumber = iti.getNumber();
        if (!iti.isValidNumber() && phoneInput.value.trim().length < 7) {
          showToast('Invalid Phone', 'Please enter a valid phone number with country code.', false);
          return;
        }
      } else {
        fullPhoneNumber = phoneInput.value.trim();
      }

      const unitType = document.getElementById('unitType') ? document.getElementById('unitType').value : 'Chalet';
      const userEmail = document.getElementById('email') ? document.getElementById('email').value.trim() : '';

      // Prepare form data
      const formData = new FormData(leadForm);
      formData.set('phone_full', fullPhoneNumber);
      formData.set('project', 'Modon Ras El Hekma');
      formData.set('source_agent', 'propertiesegy');
      formData.set('page_url', window.location.href);

      // Loading state
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'SUBMITTING...';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.status === 200 || result.success) {
          showToast('Registration Successful!', 'Thank you. Our luxury property consultant will contact you shortly with full project details.');
          leadForm.reset();

          // Trigger Google Analytics / GTM conversion if present
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'lead_form_submitted', {
              event_category: 'Leads',
              event_label: 'Modon Ras El Hekma Lead'
            });
          }

          // Optional redirect or offer to open WhatsApp
          setTimeout(() => {
            const waText = encodeURIComponent(`Hello, I just registered my interest in Modon Ras El Hekma on propertiesegy.\nName: ${fullName}\nPhone: ${fullPhoneNumber}`);
            const waUrl = `https://wa.me/201020958859?text=${waText}`;
            window.open(waUrl, '_blank');
          }, 2000);

        } else {
          // If web3forms returned error, fallback gracefully
          console.warn('Web3Forms returned:', result);
          showToast('Request Received', 'Thank you! We have received your inquiry and our advisor will reach out to you immediately.');
          
          // Open WhatsApp directly as instant fallback
          setTimeout(() => {
            const waText = encodeURIComponent(`Hello, I am interested in Modon Ras El Hekma.\nName: ${fullName}\nPhone: ${fullPhoneNumber}`);
            window.open(`https://wa.me/201020958859?text=${waText}`, '_blank');
          }, 1500);
        }
      } catch (error) {
        console.error('Submission error:', error);
        showToast('Request Received', 'Thank you! Redirecting you to our official WhatsApp advisor for immediate assistance.');
        
        setTimeout(() => {
          const waText = encodeURIComponent(`Hello, I am interested in Modon Ras El Hekma.\nName: ${fullName}\nPhone: ${fullPhoneNumber}`);
          window.open(`https://wa.me/201020958859?text=${waText}`, '_blank');
        }, 1500);
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        if (btnText) btnText.textContent = 'SUBMIT REGISTRATION';
      }
    });
  }

  // 6. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }
});
