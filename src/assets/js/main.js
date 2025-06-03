import {
  closeRGPD,
  initCookiesListener,
  customFileInput,
  customSelect,
  listenerKeyUpForm,
  listenerRGPD,
  openRGPD,
  validateForm,
  controlScrollMenu,
  openMenuMobile,
  openCloseSubmenuMobile,
  toggleModal,
  //setCookie,
  //getCookie
} from "./functions";

const bodyElem = document.getElementsByTagName("body")[0];
const htmlElem = document.getElementsByTagName("html")[0];

// jQuery document.ready equivalent - faster
document.addEventListener("DOMContentLoaded", function () {
  // ES6 example syntax
  const some = () => {
    console.log("Developed by LOBA.cx - https://www.loba.pt/");
  };

//   const sidebar = document.getElementById("sidebar");
//   if (window.innerWidth <= 991) {
//     sidebar?.classList.add("collapsed");
//   }

  some();
  //documentLoad();

  /**
   |--------------------------------------------------
   | RGPD
   |--------------------------------------------------
   */
  listenerRGPD(".rgpd");
  openRGPD(".open-rgpd");
  closeRGPD(".reject-rgpd");

  /**
   |--------------------------------------------------
   | COOKIES
   |--------------------------------------------------
   */
  initCookiesListener(".cookies__wrapper", ".cookies__change-settings");

  /**
   |--------------------------------------------------
   | Validate form's
   |--------------------------------------------------
   */
  validateForm(".validate-form");
  listenerKeyUpForm(".validate-form");

  /**
   |--------------------------------------------------
   | Custom Elements
   |--------------------------------------------------
   */
  customSelect(".custom-select-option");
  customFileInput(".custom-file input");

  // Open menu mobile
  openMenuMobile();
  // Open and close submenu mobile
  openCloseSubmenuMobile();

  // Switch Dark / Light Mode
  const toggleSwitch = document.querySelector(
    '.theme-switch input[type="checkbox"]'
  );
  const currentTheme = localStorage.getItem("theme");

  // Default dark mode
  document.documentElement.setAttribute("data-theme", "dark");
  localStorage.setItem("theme", "dark");

  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
      toggleSwitch.checked = true;
    }
  }

  function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }

  toggleSwitch.addEventListener("change", switchTheme, false);

  // Tabs
  const tabs = document.querySelectorAll("[data-tab-target]");
  const tabContents = document.querySelectorAll("[data-tab-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.tabTarget);
      tabContents.forEach((tabContent) => {
        tabContent.classList.remove("active");
      });
      tabs.forEach((tab) => {
        tab.classList.remove("active");
        tab.classList.add("btn-disabled");
      });
      tab.classList.add("active");
      tab.classList.remove("btn-disabled");
      target.classList.add("active");
    });
  });

  //	toggle modals button
  document.querySelectorAll(".toggle-modal").forEach(function (modalButton) {
    modalButton.addEventListener("click", function (event) {
      const modalContainer = this.getAttribute("data-modalContainer");
      toggleModal(modalContainer);
      event.preventDefault();
    });
  });

  /*function documentLoad(){
      let modalDisplay = getCookie( 'modalDisplay' );
      if(modalDisplay == ''){
        setCookie("modalDisplay", false, 1);
      }
      if( !modalDisplay ){
         toggleModal("welcome-popup");
      }
    }*/
  function ajustarAlturaExperimentSlider() {
    let swiperContainer = document.querySelector(".experimentSlider"); // Seleciona apenas o Swiper específico
    if (!swiperContainer) return; // Sai se o Swiper não existir

    let slides = swiperContainer.querySelectorAll(".swiper-slide");
    let maxAltura = 0;

    // Encontra a maior altura entre os slides
    slides.forEach((slide) => {
      slide.style.height = "auto"; // Reset antes de calcular
      let altura = slide.offsetHeight;
      if (altura > maxAltura) {
        maxAltura = altura;
      }
    });

    // Aplica a altura máxima a todos os slides dentro do experimentSlider
    slides.forEach((slide) => {
      slide.style.height = maxAltura + "px";
    });
  }
  let experimentItems = document.querySelectorAll(
    ".experimentSlider .swiper-slide"
  );
  let experimentTotalSlide = experimentItems.length;
  const experimentSlider = new Swiper(".experimentSlider", {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 15,
    speed: 1000,
    draggable: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "progressbar",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1.2,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 30,
      },
      1200: {
        slidesPerView: 3.2,
        spaceBetween: 30,
      },
    },
    on: {
      init: function () {
        let fragment = document.querySelector(
          ".swiper-scrollbar .swiper-pagination__current"
        );
        let current = this.realIndex + 1;
        if (current > experimentTotalSlide) current = 1;
        let idx = current < 10 ? "0" + current : current;
        let tdx =
          experimentTotalSlide < 10
            ? "0" + experimentTotalSlide
            : experimentTotalSlide;
        fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
        ajustarAlturaExperimentSlider();
      },
      slideChange: ajustarAlturaExperimentSlider,
    },
  });
  experimentSlider.on("slideChange", function () {
    let fragment = document.querySelector(
      ".swiper-scrollbar .swiper-pagination__current"
    );
    let current = experimentSlider.realIndex + 1;
    if (current > experimentTotalSlide) current = 1;
    let idx = current < 10 ? "0" + current : current;
    let tdx =
      experimentTotalSlide < 10
        ? "0" + experimentTotalSlide
        : experimentTotalSlide;
    fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
  });

  const communitySlider = new Swiper(".communitySlider", {
    speed: 800,
    direction: "vertical",
    loop: true,
    slidesPerView: 2,
    allowTouchMove: false,
    effect: "creative",
    watchSlidesProgress: true,
    creativeEffect: {
      next: {
        translate: ["-16%", "80%", 0],
        opacity: 1,
        scale: 0.66,
      },
      prev: {
        translate: ["-50%", "-100%", 0],
        opacity: 0,
        scale: 0,
      },
    },
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      992: {
        creativeEffect: {
          next: {
            translate: ["-25%", "80%", 0],
            scale: 0.5,
          },
        },
      },
    },
  });

  const whyAiodSlider = new Swiper(".whyAiodSlider", {
    speed: 800,
    direction: "horizontal",
    loop: true,
    slidesPerView: 1,
    allowTouchMove: false,
    effect: "creative",
    watchSlidesProgress: true,
    autoHeight: true,
    creativeEffect: {
      next: {
        translate: [0, "-20%", 0],
        scale: 0.9,
      },
      prev: {
        translate: [0, "-20%", 0],
        scale: 0.9,
      },
    },
    autoplay: {
      delay: 3000,
    },
  });

  const historySlider = new Swiper(".historySlider", {
    speed: 800,
    spaceBetween: 0,
    effect: "fade",
    direction: "vertical",
    mousewheel: {
      forceToAxis: true,
      releaseOnEdges: true,
    },
    scrollbar: {
      el: ".swiper-scrollbar",
    },
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    breakpoints: {
      992: {
        mousewheel: {
          releaseOnEdges: false,
        },
      },
    },
    on: {
      reachEnd: function () {
        historySlider.el.classList.add("ended");
      },
    },
  });

  // History Scroll Stop

  window.addEventListener("scroll", function (event) {
    if (!historySlider.el.parentNode) return;

    let offset = 300;
    if (window.innerWidth < 1600) {
      offset = 150;
    }

    //console.log(window.scrollY, historySlider.el.offsetTop, historySlider.isEnd)
    if (
      window.scrollY >= historySlider.el.offsetTop - offset &&
      window.scrollY <
        historySlider.el.offsetTop + historySlider.el.clientHeight - offset
    ) {
      historySlider.el.classList.add("in-view");
      if (historySlider.el.classList.contains("ended")) return;
      window.scrollTo(0, historySlider.el.offsetTop - offset);
    } else {
      historySlider.el.classList.remove("in-view");
    }
  });

  $(".historySlider .skip-section").on("click", function () {
    historySlider.slideTo(historySlider.slidesEl.children.length, 500);
  });

  // BANNER SLIDER -> Homepage
  let bannerItems = document.querySelectorAll(".banner-swiper .swiper-slide");
  let bannerTotalSlide = bannerItems.length;

  const bannerSlider = new Swiper(".banner-swiper", {
    speed: 1000,
    spaceBetween: 0,
    direction: "horizontal",

    scrollbar: false,
    pagination: {
      el: ".swiper-pagination-banner",
      type: "progressbar",
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    loop: true,
    creativeEffect: {
      limitProgress: 1,
      next: {
        translate: [0, "-10%", 0],
        scale: 0.9,
        opacity: 0,
      },
      prev: {
        translate: [0, "-10%", 0],
        scale: 0.9,
        opacity: 0,
      },
    },
    breakpoints: {
      992: {
        mousewheel: {
          releaseOnEdges: false,
        },
      },
    },

    on: {
      init: function () {
        let fragment = document.querySelector(
          ".swiper-pagination-banner__current"
        );
        let current = this.realIndex + 1;
        if (current > bannerTotalSlide) current = 1;
        let idx = current < 10 ? "0" + current : current;
        let tdx =
          bannerTotalSlide < 10 ? "0" + bannerTotalSlide : bannerTotalSlide;
        fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
      },
    },
  });

  bannerSlider.on("slideChange", function () {
    let fragment = document.querySelector(".swiper-pagination-banner__current");
    let current = bannerSlider.realIndex + 1;
    if (current > bannerTotalSlide) current = 1;
    let idx = current < 10 ? "0" + current : current;
    let tdx = bannerTotalSlide < 10 ? "0" + bannerTotalSlide : bannerTotalSlide;
    fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
  });

  //BANNER RESPONSIVE
  let bannerItemsResponsive = document.querySelectorAll(
    ".banner-swiper-responsive .swiper-slide"
  );
  let bannerTotalSlideResponsive = bannerItemsResponsive.length;

  const bannerSliderResponsive = new Swiper(".banner-swiper-responsive", {
    speed: 800,
    spaceBetween: 0,
    direction: "horizontal",

    scrollbar: false,
    pagination: {
      el: ".swiper-pagination-banner-responsive",
      type: "progressbar",
    },
    effect: "creative",
    loop: true,
    creativeEffect: {
      limitProgress: 1,
      next: {
        translate: [0, "-10%", 0],
        scale: 0.9,
        opacity: 0,
      },
      prev: {
        translate: [0, "-10%", 0],
        scale: 0.9,
        opacity: 0,
      },
    },
    breakpoints: {
      992: {
        mousewheel: {
          releaseOnEdges: false,
        },
      },
    },

    on: {
      init: function () {
        let fragment = document.querySelector(
          ".swiper-pagination-banner__current-responsive"
        );
        let current = this.realIndex + 1;
        if (current > bannerTotalSlideResponsive) current = 1;
        let idx = current < 10 ? "0" + current : current;
        let tdx =
          bannerTotalSlideResponsive < 10
            ? "0" + bannerTotalSlideResponsive
            : bannerTotalSlideResponsive;
        fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
      },
    },
  });

  bannerSliderResponsive.on("slideChange", function () {
    let fragment = document.querySelector(
      ".swiper-pagination-banner__current-responsive"
    );
    let current = bannerSliderResponsive.realIndex + 1;
    if (current > bannerTotalSlideResponsive) current = 1;
    let idx = current < 10 ? "0" + current : current;
    let tdx =
      bannerTotalSlideResponsive < 10
        ? "0" + bannerTotalSlideResponsive
        : bannerTotalSlideResponsive;
    fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
  });

  // Featured Products -> Homepage
  let featuredItems = document.querySelectorAll(
    ".featuredSlider .swiper-slide"
  );
  let totalSlide = featuredItems.length;

  const featuredSlider = new Swiper(".featuredSlider", {
    speed: 800,
    spaceBetween: 0,
    direction: "vertical",
    mousewheel: {
      forceToAxis: true,
      releaseOnEdges: true,
    },
    scrollbar: false,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    effect: "creative",
    loop: true,
    creativeEffect: {
      limitProgress: 1,
      next: {
        translate: [0, "-10%", 0],
        scale: 0.9,
        opacity: 0,
      },
      prev: {
        translate: [0, "-10%", 0],
        scale: 0.9,
        opacity: 0,
      },
    },
    breakpoints: {
      992: {
        mousewheel: {
          releaseOnEdges: false,
        },
      },
    },

    on: {
      init: function () {
        let fragment = document.querySelector(".swiper-pagination__current");
        let current = this.realIndex + 1;
        if (current > totalSlide) current = 1;
        let idx = current < 10 ? "0" + current : current;
        let tdx = totalSlide < 10 ? "0" + totalSlide : totalSlide;
        fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
      },
      slideNextTransitionStart: function (swiper) {
        swiper.el
          .querySelector(".swiper-pseudo-slides")
          .classList.add("next-animation");
      },
      slidePrevTransitionStart: function (swiper) {
        swiper.el
          .querySelector(".swiper-pseudo-slides")
          .classList.add("next-animation");
      },
      slideChangeTransitionEnd: function (swiper) {
        swiper.el
          .querySelector(".swiper-pseudo-slides")
          .classList.remove("next-animation", "prev-animation");
      },
    },
  });

  featuredSlider.on("slideChange", function () {
    let fragment = document.querySelector(".swiper-pagination__current");
    let current = featuredSlider.realIndex + 1;
    if (current > totalSlide) current = 1;
    let idx = current < 10 ? "0" + current : current;
    let tdx = totalSlide < 10 ? "0" + totalSlide : totalSlide;
    fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
  });

  // Highlights -> Homepage
  let highlightsItems = document.querySelectorAll(
    ".highlightsSlider .swiper-slide"
  );
  const highlightsSlider = new Swiper(".highlightsSlider", {
    loop: true,
    autoplayDisableOnInteraction: false,
    slidesPerView: 1,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: "true",
      type: "bullets",
      renderBullet: function (index, className) {
        let highlightsTitle = highlightsItems[index].querySelector(
          ".highlights-item-title"
        ).innerHTML;
        return `<div class="${className}"><div class="progress-thumb"><div class="progress-thumb-line"></div><div class="progress-thumb-fill"></div></div><span>0${
          index + 1
        }.</span><p>${highlightsTitle}</p></div>`;
      },
    },
  });
  var swiperDefault = new Swiper(".swiper-default", {
    effect: "fade",
    pagination: {
      el: ".swiper-pagination",
    },
  });

  // About Hover Images
  let hoverImages = document.querySelectorAll(".hover-image");
  hoverImages.forEach((element) => {
    element
      .querySelector(".hover-image-title")
      .addEventListener("mouseover", () => {
        let hoverImagesSrc =
          element.getElementsByTagName("img")[0].attributes.src.value;
        document.querySelector(".hover-image-background").style.zIndex = "111";
        document.querySelector(".hover-image-background").style.opacity = "1";
        document.querySelector(
          ".hover-image-background"
        ).style.backgroundImage = "url('" + hoverImagesSrc + "')";
        element
          .querySelector(".hover-image-title")
          .classList.add("show-background");
      });
    element
      .querySelector(".hover-image-title")
      .addEventListener("mouseout", () => {
        document.querySelector(".hover-image-background").style.zIndex = "-1";
        document.querySelector(".hover-image-background").style.opacity = "0";
        element
          .querySelector(".hover-image-title")
          .classList.remove("show-background");
        setTimeout(() => {
          document.querySelector(
            ".hover-image-background"
          ).style.backgroundImage = "none";
        }, 300);
      });
  });
});

// header change appearance
window.addEventListener("scroll", controlScrollMenu);

// Maps lottie, Play when in-view

window.addEventListener("scroll", function (event) {
  const lottie = document.querySelector(".maps-lottie");

  if (!lottie) return;
  if (lottie.classList.contains("played")) return;
  if (lottie.getBoundingClientRect().top - window.innerHeight / 3 < 0) {
    lottie.play();
    lottie.classList.add("played");
  }
});

// Typewrite animation
var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  let wrapper = this.el.querySelector(".wrap");

  if (!wrapper) {
    wrapper = document.createElement("span");
    wrapper.classList.add("wrap");
    wrapper.setAttribute("aria-hidden", true);
    this.el.appendChild(wrapper);
  }

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  wrapper.innerHTML = this.txt;

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName("typewrite");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-type");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML =
    ".typewrite > .wrap { border-right: 3px solid #FFED00; padding-right: 5px;}";
  document.body.appendChild(css);
};

/**
	|--------------------------------------------------
	| Tablist to URL search params
	|--------------------------------------------------
	*/

function tablistToUrl() {
  document.querySelectorAll(".tablist-to-url").forEach((tablist) => {
    if (!tablist.id) return;
    const tabs = tablist.querySelectorAll(".tablist-link");
    const url = new URL(window.location);
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        if (!tab.id) return;
        url.search = "";
        url.searchParams.set(tablist.id, tab.id);
        window.history.replaceState({}, "", url);
      });
    });
  });
}
tablistToUrl();

// JavaScript para alternar o estado do menu
const sidebar = document.getElementById("sidebar");
const sidebarUser = document.getElementById("sidebar-user");
const collapseButtons = document.querySelectorAll("#collapseButton");
const collapseButtonUser = document.querySelectorAll(".user-avatar-button");

collapseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    // Lógica apenas para dispositivos móveis
    if (window.innerWidth <= 991) {
      if (!sidebar.classList.contains("collapsed")) {
        sidebarUser.classList.add("collapsed"); // Fecha o sidebar-user
      }
    }
  });
});

collapseButtonUser.forEach((button) => {
  button.addEventListener("click", () => {
    sidebarUser.classList.toggle("collapsed");

    // Lógica apenas para dispositivos móveis
    if (window.innerWidth <= 991) {
      if (!sidebarUser.classList.contains("collapsed")) {
        sidebar.classList.add("collapsed"); // Fecha o sidebar
      }
    }
  });
});


// Seleciona todos os elementos com submenu
const submenuParents = document.querySelectorAll(".sidebar .has-submenu");

submenuParents.forEach((parent) => {
  parent.addEventListener("click", () => {
    const submenu = parent.querySelector(".sidebar .submenu"); // Seleciona o submenu dentro do pai

    // Alterna o estado do submenu
    submenu.classList.toggle("open");
    parent.classList.toggle("open"); // Adiciona uma classe ao pai para indicar o estado (opcional)
  });
});

const links = document.querySelectorAll(".buttons-container a");
if (links.length > 0) {
  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Evita navegação padrão

      // Remove a classe de todos os links
      links.forEach((l) => l.classList.remove("active"));

      // Adiciona a classe ao link clicado
      this.classList.add("active");
    });
  });
}

// gsap.registerPlugin(ScrollTrigger);
// const latestNews = document.querySelector(".card-latest-news-content");
// if (latestNews) {
//   gsap.from(".card-latest-news-content", {
//     opacity: 0,
//     duration: 1.5,
//     stagger: 0.5,
//     ease: "power2.out",
//     y: 50,
//     scrollTrigger: {
//       trigger: ".card-latest-news-content",
//       start: "top 80%",
//       end: "bottom 10%",
//       toggleActions: "restart none none none",
//       markers: false,
//     },
//   });
// }

const bannerHomepage = document.querySelector(".banner");
if (bannerHomepage) {
  function updateImageMargin() {
    const container = document.querySelector(
      ".banner.d-lg-block.d-none .container .offset-lg-1.col-lg-6"
    );
    const image = document.querySelector(".bg-banner-img img");

    if (container && image) {
      const containerRect = container.getBoundingClientRect();
      const rightMargin = window.innerWidth - containerRect.right;

      image.style.right = rightMargin / 2 + "px";
    }
  }
  window.addEventListener("load", updateImageMargin);
  window.addEventListener("resize", updateImageMargin);
}

let ondemandToolsItems = document.querySelectorAll(".ondemandToolsSlider .swiper-slide");
let ondemandToolsTotalSlider = ondemandToolsItems.length;
const ondemandToolsSlider = new Swiper(".ondemandToolsSlider", {
  loop: false,
  slidesPerView: 2,
  spaceBetween: 15,
  speed: 1000,
  draggable: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "progressbar",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 30,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
  },
  on: {
    init: function () {
      let fragment = document.querySelector(
        ".ondemandToolsSlider .swiper-scrollbar .swiper-pagination__current"
      );
      let current = this.realIndex + 1;
      if (current > ondemandToolsTotalSlider) current = 1;
      let idx = current < 10 ? "0" + current : current;
      let tdx = ondemandToolsTotalSlider < 10 ? "0" + ondemandToolsTotalSlider : ondemandToolsTotalSlider;
      fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
    },
  },
});
ondemandToolsSlider.on("slideChange", function () {
  let fragment = document.querySelector(
    ".ondemandToolsSlider .swiper-scrollbar .swiper-pagination__current"
  );
  let current = ondemandToolsSlider.realIndex + 1;
  if (current > ondemandToolsTotalSlider) current = 1;
  let idx = current < 10 ? "0" + current : current;
  let tdx = ondemandToolsTotalSlider < 10 ? "0" + ondemandToolsTotalSlider : ondemandToolsTotalSlider;
  fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
});


let aiProjectsItems = document.querySelectorAll(".aiProjectsSlider .swiper-slide");
let aiProjectsTotalSlider = aiProjectsItems.length;
const aiProjectsSlider = new Swiper(".aiProjectsSlider", {
  loop: false,
  slidesPerView: 2,
  spaceBetween: 15,
  speed: 1000,
  draggable: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "progressbar",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 30,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
  },
  on: {
    init: function () {
      let fragment = document.querySelector(
        ".aiProjectsSlider .swiper-scrollbar .swiper-pagination__current"
      );
      let current = this.realIndex + 1;
      if (current > aiProjectsTotalSlider) current = 1;
      let idx = current < 10 ? "0" + current : current;
      let tdx = aiProjectsTotalSlider < 10 ? "0" + aiProjectsTotalSlider : aiProjectsTotalSlider;
      fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
    },
  },
});
aiProjectsSlider.on("slideChange", function () {
  let fragment = document.querySelector(
    ".aiProjectsSlider .swiper-scrollbar .swiper-pagination__current"
  );
  let current = aiProjectsSlider.realIndex + 1;
  if (current > aiProjectsTotalSlider) current = 1;
  let idx = current < 10 ? "0" + current : current;
  let tdx = aiProjectsTotalSlider < 10 ? "0" + aiProjectsTotalSlider : aiProjectsTotalSlider;
  fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
});


let roboTrainingItems = document.querySelectorAll(".roboTrainingSlider .swiper-slide");
let roboTrainingTotalSlider = roboTrainingItems.length;
const roboTrainingSlider = new Swiper(".roboTrainingSlider", {
  loop: false,
  slidesPerView: 2,
  spaceBetween: 15,
  speed: 1000,
  draggable: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "progressbar",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 30,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
  },
  on: {
    init: function () {
      let fragment = document.querySelector(
        ".roboTrainingSlider .swiper-scrollbar .swiper-pagination__current"
      );
      let current = this.realIndex + 1;
      if (current > roboTrainingTotalSlider) current = 1;
      let idx = current < 10 ? "0" + current : current;
      let tdx = roboTrainingTotalSlider < 10 ? "0" + roboTrainingTotalSlider : roboTrainingTotalSlider;
      fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
    },
  },
});
roboTrainingSlider.on("slideChange", function () {
  let fragment = document.querySelector(
    ".roboTrainingSlider .swiper-scrollbar .swiper-pagination__current"
  );
  let current = roboTrainingSlider.realIndex + 1;
  if (current > roboTrainingTotalSlider) current = 1;
  let idx = current < 10 ? "0" + current : current;
  let tdx = roboTrainingTotalSlider < 10 ? "0" + roboTrainingTotalSlider : roboTrainingTotalSlider;
  fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
});


let newProgramsItems = document.querySelectorAll(".newProgramsSlider .swiper-slide");
let newProgramsTotalSlider = newProgramsItems.length;
const newProgramsSlider = new Swiper(".newProgramsSlider", {
  loop: false,
  slidesPerView: 2,
  spaceBetween: 15,
  speed: 1000,
  draggable: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "progressbar",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 30,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
  },
  on: {
    init: function () {
      let fragment = document.querySelector(
        ".newProgramsSlider .swiper-scrollbar .swiper-pagination__current"
      );
      let current = this.realIndex + 1;
      if (current > newProgramsTotalSlider) current = 1;
      let idx = current < 10 ? "0" + current : current;
      let tdx = newProgramsTotalSlider < 10 ? "0" + newProgramsTotalSlider : newProgramsTotalSlider;
      fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
    },
  },
});
newProgramsSlider.on("slideChange", function () {
  let fragment = document.querySelector(
    ".newProgramsSlider .swiper-scrollbar .swiper-pagination__current"
  );
  let current = newProgramsSlider.realIndex + 1;
  if (current > newProgramsTotalSlider) current = 1;
  let idx = current < 10 ? "0" + current : current;
  let tdx = newProgramsTotalSlider < 10 ? "0" + newProgramsTotalSlider : newProgramsTotalSlider;
  fragment.innerHTML = `<span>${idx}</span><span>${tdx}</span>`;
});


// SLIDER PRESS CORNER
function updatePaginationPosition() {
  const activeSlide = document.querySelector(
    ".swiper-slide-active .swiper-slide-content"
  );
  const pagination = document.querySelector(".swiper-pagination-bullets");
  if (window.innerWidth <= 992) {
    if (activeSlide && pagination) {
      const contentHeight = activeSlide.offsetHeight;

      pagination.style.top = contentHeight - 15 + "px";
    }
  }else if( window.innerWidth <= 400 ){
    if (activeSlide && pagination) {
      const contentHeight = activeSlide.offsetHeight;

      pagination.style.top = contentHeight + "px";
    }
  }
}

window.addEventListener("resize", updatePaginationPosition);
window.addEventListener('load', updatePaginationPosition);
