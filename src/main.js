/**
 * Brayn Bytez — Official Platform Script
 * Полная сборка: Меню, Hero-анимация, Bento-интерактив, Форма, Cookies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ПРОВЕРКА ЗАГРУЗКИ БИБЛИОТЕК
  if (typeof gsap === 'undefined') {
      console.error("GSAP не найден. Убедитесь, что скрипты подключены в правильном порядке.");
      return;
  }

  // Регистрация плагина ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Инициализация иконок Lucide
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // --- МОБИЛЬНОЕ МЕНЮ ---
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  const toggleMenu = () => {
      if (!burger || !mobileMenu) return;
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
  };

  if (burger) burger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (mobileMenu.classList.contains('active')) toggleMenu();
      });
  });

  // --- ЭФФЕКТ ХЕДЕРА ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.classList.add('header--scrolled');
      } else {
          header.classList.remove('header--scrolled');
      }
  });

  // --- HERO АНИМАЦИЯ (SplitType) ---
  const titleElement = document.querySelector('.js-split');
  if (titleElement && typeof SplitType !== 'undefined') {
      const text = new SplitType(titleElement, { types: 'chars' });

      gsap.from(text.chars, {
          opacity: 0,
          y: 50,
          stagger: 0.02,
          duration: 1,
          ease: "power4.out",
          delay: 0.5
      });

      gsap.from('.hero__text, .hero__actions', {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          delay: 1
      });
  }

  // --- BENTO GRID: АНИМАЦИЯ ПОЯВЛЕНИЯ ---
  // Исправляем проблему видимости: анимируем все элементы по очереди
  const bentoItems = document.querySelectorAll('.bento-item');
  if (bentoItems.length > 0) {
      gsap.from(bentoItems, {
          scrollTrigger: {
              trigger: ".bento-grid",
              start: "top 85%",
              toggleActions: "play none none none"
          },
          opacity: 0,
          y: 40,
          scale: 0.95,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "all" // Очищает стили после анимации, чтобы CSS Grid не ломался
      });
  }

  // --- BENTO GRID: TILT (НАКЛОН) ---
  bentoItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
          const rect = item.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;

          gsap.to(item, {
              rotateX: rotateX,
              rotateY: rotateY,
              duration: 0.5,
              ease: "power2.out",
              transformPerspective: 1000
          });
      });

      item.addEventListener('mouseleave', () => {
          gsap.to(item, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.7,
              ease: "elastic.out(1, 0.5)"
          });
      });
  });

  // --- ВАЛИДАЦИЯ ФОРМЫ И КАПЧА ---
  const contactForm = document.getElementById('contactForm');
  const phoneInput = document.getElementById('phoneInput');
  const captchaLabel = document.getElementById('captchaQuestion');
  const formMessage = document.getElementById('formMessage');

  // Ограничение: только цифры в поле телефона
  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });
  }

  // Генерация примера
  const n1 = Math.floor(Math.random() * 10) + 1;
  const n2 = Math.floor(Math.random() * 10) + 1;
  const solution = n1 + n2;
  if (captchaLabel) captchaLabel.textContent = `${n1} + ${n2} = ?`;

  if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const userSolution = parseInt(document.getElementById('captchaAnswer').value);

          if (userSolution !== solution) {
              showMessage("Неверный ответ капчи!", "error");
              return;
          }

          const btn = contactForm.querySelector('.form__submit');
          btn.disabled = true;
          btn.textContent = "Отправка...";

          // Имитация AJAX
          setTimeout(() => {
              showMessage("Заявка успешно отправлена!", "success");
              contactForm.reset();
              btn.disabled = false;
              btn.textContent = "Запросить доступ";
          }, 1500);
      });
  }

  function showMessage(text, type) {
      if (!formMessage) return;
      formMessage.textContent = text;
      formMessage.className = `form__message ${type}`;
      formMessage.style.display = "block";
      setTimeout(() => { formMessage.style.display = "none"; }, 5000);
  }

  // --- COOKIE POPUP ---
  const cookieBox = document.getElementById('cookiePopup');
  const cookieBtn = document.getElementById('cookieAccept');

  if (cookieBox && !localStorage.getItem('bb_cookies')) {
      setTimeout(() => { cookieBox.classList.add('active'); }, 3000);
  }

  if (cookieBtn) {
      cookieBtn.addEventListener('click', () => {
          localStorage.setItem('bb_cookies', 'true');
          cookieBox.classList.remove('active');
      });
  }

  // --- ПЛАВНЫЙ СКРОЛЛ ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
              const offset = 80;
              const bodyRect = document.body.getBoundingClientRect().top;
              const elementRect = target.getBoundingClientRect().top;
              const elementPosition = elementRect - bodyRect;
              const offsetPosition = elementPosition - offset;

              window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });
});