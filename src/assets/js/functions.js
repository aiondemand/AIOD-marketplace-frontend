"use strict";

import { Modal } from "bootstrap";
// import AOS from "aos";
//import "aos/dist/aos.css";
import "jquery-validation";
window.jQuery = $;
window.$ = $;

//AOS.init(); 
/**
|--------------------------------------------------
| Helper (JS closest polyfill)
|--------------------------------------------------
*/
if (window.Element && !Element.prototype.closest) {
   Element.prototype.closest = function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
         i,
         el = this;
      do {
         i = matches.length;
         while (--i >= 0 && matches.item(i) !== el) { }
      } while (i < 0 && (el = el.parentElement));
      return el;
   };
}

/**
|--------------------------------------------------
| Validate Forms Functions
|--------------------------------------------------
*/
//  General Form Validation Function
export const validateFormsGeneral = (form) => {
   $(form).validate();
   return $(form).valid();
};

window.validateFormsGeneral = validateFormsGeneral;

export const recaptchaData = function (token) {
   if (token) {
      $(".g-recaptcha").each(function () {
         var object = $(this);
         object.parents("form").submit();
      });
   }

   return;
};

window.recaptchaData = recaptchaData;

// Jquery Validation Form (docs: https://jqueryvalidation.org)
export const validateForm = (formClass) => {
   const form = $(formClass);
   form.each(function (e) {
      let thisForm = $(this);
      thisForm.attr("novalidate", "true");

      $(this).submit(function (event) {
         // Adds the loading state to button
         // const button = event.originalEvent.submitter.classList.contains("main-btn-submit")
         const validate = $(this).find(".validate-inputs");
         const btn = $(this).find("[type=submit]:focus").hasClass("main-btn-submit");
         let mainBtn = $(this).find(".open-rgpd") || $(this).find(".main-btn-submit");
         mainBtn.addClass("loading");
         mainBtn.attr("disabled", true);

         const expertiseInput = $(this).find("#expertise-keywords");

         if (expertiseInput.length) {
            let expertiseError = $(this).find("#expertise-keywords-error");

            // Se a label de erro não existir, criá-la e adicionar abaixo do input
            if (expertiseError.length === 0) {
               expertiseError = $("<label>", {
                  id: "expertise-keywords-error",
                  class: "error",
                  for: "expertise-keywords",
                  css: { color: "red", display: "none", fontSize: "14px" }
               });
               expertiseInput.after(expertiseError); // Adiciona a label após o input
            }

            let keywords = expertiseInput.val().split(",").map(k => k.trim()).filter(k => k !== "");
            if (keywords.length > 5) {
               event.preventDefault();
               expertiseError.text("Please enter a maximum of 5 keywords, separated by commas.");
               expertiseError.show(); // Exibe a mensagem de erro
               mainBtn.removeClass("loading").removeAttr("disabled");
               return;
            } else {
               expertiseError.text("").hide(); // Limpa e esconde a mensagem de erro se for válido
            }
         }


         console.log(validate);

         // If form is perfectly filled and allowed to submit
         if (validateFormsGeneral($(this))) {
            if (btn) {
               this.parentElement.querySelector(".rgpd").classList.add("rgpd--open");
            }

            if (validate) {
               this.parentElement.querySelector(".rgpd").classList.add("rgpd--open");
            }

            closeRGPD(".reject-rgpd");

            // prevents submit
            event.preventDefault();
         } else {
            // prevents submit if has errors
            event.preventDefault();
            closeRGPD(".reject-rgpd");

            mainBtn.removeClass("loading");
            mainBtn.removeAttr("disabled");
         }
      });
   });
};

export const listenerKeyUpForm = (listenerClassForm) => {
   document.addEventListener("keyup", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var activeForm = document.activeElement.closest(listenerClassForm);

      if (e.keyCode === 13 && activeForm) {
         if (activeForm.querySelector(".rgpd").classList.contains("rgpd--open")) {
            activeForm.querySelector(".open-rgpd").click();
         }
      }
   });
};

/**
|--------------------------------------------------
| RGPD
|--------------------------------------------------
*/
// Listener RGPD
export const listenerRGPD = (rgpdClass) => {
   const rgpdBoxes = document.querySelectorAll(rgpdClass);
   document.querySelector("body").addEventListener("click", function (e) {
      // close when clicked outside RGPD
      for (var _i = 0; _i < rgpdBoxes.length; _i++) {
         if (!rgpdBoxes[_i].contains(e.target) && rgpdBoxes[_i].className == "rgpd rgpd--open") {
            rgpdBoxes[_i].classList.remove("rgpd--open");
         }
      }
   });
};

// Open and Accept RGPD
export const openRGPD = (openClass) => {
   const submitForms = document.querySelectorAll(openClass);

   for (var i = 0; i < submitForms.length; i++) {
      const element = submitForms[i];
      element.addEventListener("click", function (e) {
         this.parentElement.querySelector(".rgpd").classList.add("rgpd--open");
         e.preventDefault();
         e.stopPropagation();
         return false;
      });
   }
};

// Reject RGPD's
export const closeRGPD = (closeClass) => {
   var rejectRgpd = document.querySelectorAll(closeClass);

   for (var i = 0; i < rejectRgpd.length; i++) {
      rejectRgpd[i].closest(".rgpd").classList.remove("rgpd--open");
      rejectRgpd[i].addEventListener("click", function (e) {
         this.closest(".rgpd").classList.remove("rgpd--open");
         e.preventDefault();
         return false;
      });
   }
};

/**
|--------------------------------------------------
| Cookies functions
|--------------------------------------------------
*/
const cookiesPrefix = "loba_";

export const createCookie = (value, days) => {
	// If value is an array of cookies from inputs loop and refresh
	// otherwise just refresh the cookie by its name
	if(NodeList.prototype.isPrototypeOf(value)){
		value.forEach((cookie) => {
			const cookieValue = cookiesPrefix + cookie.value;
			refreshCokkie(cookieValue);
		});
	}else{
		refreshCokkie(value);
	}

	function refreshCokkie(cookieValue) {
		let expires;
		if (days) {
			let date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = "; expires=" + date.toGMTString();
		} else {
			expires = "";
		}

		document.cookie = cookieValue + "=" + true + expires + "; path=/";
	}
};

export const readCookie = (name) => {
	let nameEQ = name + "="
	let cookies = document.cookie.split(";")
	let readCookie = false
	cookies.forEach((cookie) => {
		while (cookie.startsWith(" ")) {
			cookie = cookie.substring(1, cookie.length)
		}
		if (cookie.startsWith(nameEQ)) {
			readCookie = true
		}
	})
	return readCookie
};

export const readCookiePermissions = (cookiesRadios) => {
	cookiesRadios.forEach((cookieRadio) => {
		if(readCookie(cookiesPrefix + cookieRadio.value)){
			const scripts = document.querySelectorAll('script[type="text/plain"][data-assigned-cookie="'+cookieRadio.value+'"]')
			scripts.forEach(script => {
				const newScript = script.cloneNode(true);
				newScript.removeAttribute('type');
				script.parentNode.replaceChild(newScript, script);
			})
			const embeds = document.querySelectorAll('.embed--no-consent[data-assigned-cookie="'+cookieRadio.value+'"]')
			embeds.forEach(embed => {
				embed.classList.remove('embed--no-consent')
				const iframe = embed.querySelector('iframe')
				if(!iframe) return;
				iframe.src = iframe.dataset.src
			})
		}
	});
};

export const eraseCookies = () => {
	let cookies = document.cookie.split(";");
	cookies.forEach((cookie) => {
		let cookieName = cookie.replace(' ','').split("=")[0];
		createCookie(cookieName, -1);
	});
};

export const initCookiesListener = function(cookiesWrapperSelector, changeCookiesSelector) {
	const cookiesWrapper = document.querySelector(cookiesWrapperSelector),
		changeCookies = document.querySelectorAll(changeCookiesSelector),
		cookiesRadios = document.querySelectorAll('input[name=cookie-radio]'),
		acceptCookiesBtn = document.querySelector('.cookies__accept'),
		denyCookiesBtn = document.querySelector('.cookies__deny'),
		submitCookiesPreferencesBtn = document.querySelector('.cookies__submit'),
		cookiesDescription = document.querySelector('.cookies__description'),
		cookiesSettings = document.querySelector('.cookies__settings'),
		cookiesSettingsLink = document.querySelector('.cookies__settings-link'),
		cookiesCancel = document.querySelector('.cookies__cancel');
	
	if (!cookiesWrapper) {
		console.log('Cookies Box is missing!')
		return;
	};
	
	let cookiesModal;
	if (cookiesWrapper.classList.contains('modal')) {
		cookiesModal = new Modal(cookiesWrapper, {
			backdrop: 'static', // Impede o fechamento quando clicado fora do modal
			keyboard: false // Impede o fechamento quando a tecla ESC é pressionada
		});
	} else {
		cookiesModal = new Offcanvas(cookiesWrapper);
	}

	window.dataLayer = window.dataLayer || [];
	function gtag() {dataLayer.push(arguments);}
	window.gtag = gtag;

	if(localStorage.getItem('consentMode') === null){
		gtag('consent', 'default', {
			'ad_storage': 'denied',
			'analytics_storage': 'denied',
			'personalization_storage': 'denied',
			'functionality_storage': 'denied',
			'security_storage': 'denied',
		})
	}else{
		gtag('consent', 'default', JSON.parse(localStorage.getItem('consentMode')));
	}

	// Show Cookies if not accepted already
	if (!readCookie(cookiesPrefix + "required")) {
		eraseCookies();
		cookiesModal.show();
		document.body.style.overflow = "";
		document.body.style.paddingRight = "";
	} else {
		readCookiePermissions(cookiesRadios);
	}

	changeCookies.forEach((button) => {
		button.addEventListener("click", function (e) {
			e.preventDefault();
			eraseCookies();
			cookiesModal.show();
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		});
	})

	if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener("click", function (e) {
          e.preventDefault();
          const cookieVal = document.querySelectorAll('input[name=cookie-radio]');
          submitPreferences(cookieVal);
      });
   }

	// Deny all Cookies (except required)
	if (denyCookiesBtn) {
      denyCookiesBtn.addEventListener("click", function (e) {
          e.preventDefault();
          const cookieVal = document.querySelectorAll('#cookie-required');
          submitPreferences(cookieVal);
      });
   }
  
	// Submit preferences
	if (submitCookiesPreferencesBtn) {
      submitCookiesPreferencesBtn.addEventListener("click", function (e) {
          e.preventDefault();
          const cookieVal = document.querySelectorAll('input[name=cookie-radio]:checked');
          submitPreferences(cookieVal);
      });
   }

	function submitPreferences(cookieVal) {
		createCookie(cookieVal, 365 * 10);
		readCookiePermissions(cookiesRadios);
		cookiesModal.hide();
		setConsent();
	}

	// open and close cookies preferences
	if (cookiesSettingsLink) {
      cookiesSettingsLink.addEventListener("click", function (e) {
          e.preventDefault();
          cookiesDescription.classList.toggle('d-none');
          cookiesSettings.classList.toggle('d-none');
      });
   }
  
	if (cookiesCancel) {
      cookiesCancel.addEventListener("click", function (e) {
          e.preventDefault();
          cookiesDescription.classList.toggle('d-none');
          cookiesSettings.classList.toggle('d-none');
      });
   }
  



};

export const setConsent = () => {
	const consentMode = {
		'ad_storage': readCookie(cookiesPrefix + "ad") ? 'granted' : 'denied',
		'analytics_storage': readCookie(cookiesPrefix + "analytics") ? 'granted' : 'denied',
		'personalization_storage': readCookie(cookiesPrefix + "personalization") ? 'granted' : 'denied',
		'functionality_storage': readCookie(cookiesPrefix + "functionality") ? 'granted' : 'denied',
		'security_storage': readCookie(cookiesPrefix + "security") ? 'granted' : 'denied',
	}
	gtag('consent', 'update', consentMode);
	localStorage.setItem('consentMode', JSON.stringify(consentMode));
}

/**
|--------------------------------------------------
| Custom Functions
|--------------------------------------------------
*/
// Custom Select Combo Box
export const customSelect = (selectClass) => {
   var x, i, j, selElmnt, a, b, c;
   // look for any elements with the class "custom-select":
   x = document.querySelectorAll(selectClass);
   let valueAttr = null;

   for (i = 0; i < x.length; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      valueAttr = selElmnt.options[selElmnt.selectedIndex].value;

      // disable dropdown on mobile to use native instead
      if (checkIfMobile() == true) {
         selElmnt.classList.add("custom-select__mobile");
      }

      // for each element, create a new DIV that will act as the selected item:
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");

      // add value of option selected 'data-atribute' inside a new DIV -> FILIPE
      a.setAttribute("data-value", valueAttr);

      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].insertBefore(a, selElmnt);

      // for each element, create a new DIV that will contain the option list:
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");

      for (j = 0; j < selElmnt.length; j++) {
         // for each option in the original select element,
         // create a new DIV that will act as an option item:
         c = document.createElement("DIV");
         c.innerHTML = selElmnt.options[j].innerHTML;

         c.addEventListener("click", function (e) {
            // when an item is clicked, update the original select box,
            // and the selected item:
            var i, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;

            for (i = 0; i < s.length; i++) {
               //new -> FILIPE
               h.setAttribute("data-value", s.options[i].value);
               if (s.options[i].innerHTML == this.innerHTML) {
                  s.selectedIndex = i;
                  h.innerHTML = this.innerHTML;
                  break;
               }
            }
            h.click();
         });

         b.appendChild(c);
      }

      selElmnt.addEventListener("change", function () {
         //console.log(this.parentNode.querySelector('.select-selected'));
         this.parentNode.querySelector(".select-selected").innerHTML = this.options[this.selectedIndex].text;
      });

      x[i].insertBefore(b, selElmnt);

      a.addEventListener("click", function (e) {
         // when the select box is clicked, close any other select boxes,
         // and open/close the current select box:
         e.stopPropagation();
         closeAllSelect(this);
         this.nextSibling.classList.toggle("select-hide");
         this.classList.toggle("select-arrow-active");
      });
   }

   function closeAllSelect(elmnt) {
      // a function that will close all select boxes in the document,
      // except the current select box:
      var x,
         y,
         i,
         arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");

      for (i = 0; i < y.length; i++) {
         if (elmnt == y[i]) {
            arrNo.push(i);
         } else {
            y[i].classList.remove("select-arrow-active");
         }
      }

      for (i = 0; i < x.length; i++) {
         if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
         }
      }
   }

   // if the user clicks anywhere outside the select box,
   // then close all select boxes:
   document.addEventListener("click", closeAllSelect);
};

// Custom Input File
export const customFileInput = (customFileClass) => {
   var selects = document.querySelectorAll(customFileClass);

   for (var i = 0; i < selects.length; i++) {
      var item = selects[i];

      item.addEventListener("change", function () {
         if (this.files.length > 1) {
            // multiple files selected
            var inputStr = this.getAttribute("data-selected").replace("%s", this.files.length);
         } else if (this.files.length == 1) {
            // one file selected
            var inputStr = this.files[0].name;
         } else {
            // empty
            var inputStr = this.getAttribute("data-label");
         }

         // write to label mask
         this.previousElementSibling.innerHTML = inputStr;
      });
   }
};

// Alerts EveryWhere
export const alertsEveryWhere = () => {
   alert("Opcional - Função exemplo a ser chamada depois de formulário validado.");
};

// Check is mobile
export const checkIfMobile = () => {
   if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
         navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
         navigator.userAgent.substr(0, 4)
      )
   ) {
      return true;
   } else {
      return false;
   }
};

//  Generic Ajax Load More function
export const loadMore = (triggerBtn, target, totalItemsLoaded, dataType, dataUrl, dataMethod) => {
   triggerBtn.classList.add("loading");

   $.ajax({
      method: dataMethod,
      url: URL + dataUrl,
      data: { total: totalItemsLoaded, type: dataType },
      dataType: "html",
      success: function (data) {
         if (data && data !== null) {
            // append items to target div
            document.querySelector("#" + target).innerHTML += data;
            // remove loading spinner from button
            triggerBtn.classList.remove("loading");
         } else {
            document.querySelector(".view-more").innerHTML = "";
         }
      },
      error: function () {
         alert("Error");
         triggerBtn.classList.remove("loading");
      },
   });
};


// Header change appearence
export const controlScrollMenu = () => {
   window.scrollY > 1 ? document.getElementById("header").classList.add("appearence-changed") : document.getElementById("header").classList.remove("appearence-changed")
}


//  open/close menu mobile
export const openMenuMobile = () => {
   const openMenuMobileButtons = document.querySelectorAll(".open-mobile-menu"); // Alterado para classe
   const header = document.querySelector("header");
   const mainMenu = document.querySelector(".header-items"); // Alterado para classe

   openMenuMobileButtons.forEach((button) => {
      button.addEventListener("click", function () {
         if (header.classList.contains("mobile-opened")) {
            header.classList.remove("mobile-opened");
            setTimeout(() => {
               mainMenu.removeAttribute("style");
            }, 100);
         } else {
            header.classList.add("mobile-opened");
            mainMenu.style.visibility = "visible";
         }
      });
   });
};

//  open/close submenu mobile
export const openCloseSubmenuMobile = () => {
   let openTrigger = document.querySelectorAll(".menu-link-mobile.has-submenu");
   if (window.innerWidth <= 991) {
      //  mobile
      openTrigger.forEach((btn) => {
         btn.addEventListener("click", (e) => {
            if (btn.closest(".menu").classList.contains("selected")) {
               btn.closest(".menu").classList.remove("selected");
               e.preventDefault();
               return;
            }
            if (document.querySelector(".menu.selected")) {
               document.querySelector(".menu.selected").classList.remove("selected");
            }
            btn.closest(".menu").classList.add("selected");
            e.preventDefault();
         });
      });
   }
}

//  toggle modals function
export const toggleModal = (modalId) => {
   let modalContainer = document.getElementById(modalId);
   let bodyElem = document.querySelector("body");

  
   if (modalContainer.getAttribute("data-status") != "opened") {

      modalContainer.setAttribute("data-status", "opened");

      //  add class to body to disable Y scroll
      bodyElem.classList.add("in-modal");
      if(modalId == "welcome-popup"){
         setCookie("modalDisplay", true, 1);
      }

   } else {

      //	remove class 'opened' to modal container to hide it
      modalContainer.setAttribute("data-status", "closed");

      //  remove class to body to enable Y scroll
      bodyElem.classList.remove("in-modal");
      if(modalId == "welcome-popup"){
         setCookie("modalDisplay", false, 1);
      }

   }

}

