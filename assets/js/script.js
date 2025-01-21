"use strict";
$ = jQuery;

$(document).ready(function () {
  header();
  createFilter();
  swiperBanner();
  contactForm();
  counterOnScroll();
  coreValue();
});

gsap.registerPlugin(ScrollTrigger);
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

function swiperBanner() {
  if ($(".banner-hero").length) {
    var interleaveOffset = 0.9;

    var swiperBanner = new Swiper(".swiper-banner", {
      loop: true,
      speed: 1500,
      grabCursor: true,
      watchSlidesProgress: true,
      mousewheelControl: true,
      keyboardControl: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: true
      },
      on: {
        progress: function (swiper) {
          swiper.slides.forEach(function (slide) {
            var slideProgress = slide.progress || 0;
            var innerOffset = swiper.width * interleaveOffset;
            var innerTranslate = slideProgress * innerOffset;
            // Kiểm tra nếu innerTranslate không phải là NaN
            if (!isNaN(innerTranslate)) {
              var slideInner = slide.querySelector(".slide-banner");
              if (slideInner) {
                slideInner.style.transform =
                  "translate3d(" + innerTranslate + "px, 0, 0)";
              }
            }
          });
        },
        touchStart: function (swiper) {
          swiper.slides.forEach(function (slide) {
            slide.style.transition = "";
          });
        },
        setTransition: function (swiper, speed) {
          var easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
          swiper.slides.forEach(function (slide) {
            slide.style.transition = speed + "ms " + easing;
            var slideInner = slide.querySelector(".slide-banner");
            if (slideInner) {
              slideInner.style.transition = speed + "ms " + easing;
            }
          });
        }
      }
    });
  }
}

function header() {
  if (!$(".banner-hero").length) return;

  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    onUpdate: (self) => {
      self.direction === 1 ? $("header").addClass("header--scroll") : "";
      self.progress === 0 ? $("header").removeClass("header--scroll") : "";
    }
  });
}

function createFilter() {
  $(".blogs-list__filter").each(function () {
    const $filterSection = $(this);
    const $resultContainer = $filterSection.siblings(".blogs-list__result");
    console.log($resultContainer);

    $filterSection.find(".filter-button[data-type]").on("click", function () {
      const $this = $(this);
      const filterType = $this.data("type");
      console.log("Filter Type:", filterType);
      $this.addClass("active").siblings().removeClass("active");
      gsap.to($resultContainer, {
        autoAlpha: 0,
        duration: 0.25,
        onComplete: () => {
          if (filterType === "all") {
            $resultContainer.find(".blogs-list__item[data-filter]").show();
          } else {
            $resultContainer.find(".blogs-list__item").hide();
            $resultContainer
              .find(`.blogs-list__item[data-filter='${filterType}']`)
              .show();
          }

          gsap.to($resultContainer, {
            autoAlpha: 1,
            duration: 0.25
          });
        }
      });
    });
  });
}

function contactForm() {
  if ($(".contact-form").length < 1) return;

  const input = document.querySelector("#phone");
  window.intlTelInput(input, {
    initialCountry: "vn",
    separateDialCode: true,
    loadUtils: () => import("/intl-tel-input/js/utils.js?1733756310855") // for formatting/placeholders etc
  });
}

function counterOnScroll() {
  if ($(".count-number").length < 1) return;

  $(".number").each(function () {
    const $stat = $(this);
    const patt = /(\D+)?(\d+(\.\d+)?)(\D+)?/;
    const time = 0;
    let result = patt.exec($stat.text());
    let fresh = true;
    let ticks;

    if (!result) return;

    result.shift();
    result = result.filter((res) => res != null);

    $stat.empty();

    result.forEach((res) => {
      if (isNaN(res)) {
        $stat.append(`<span>${res}</span>`);
      } else {
        for (let i = 0; i < res.length; i++) {
          $stat.append(`
            <span data-value="${res[i]}">
              <span>&nbsp;</span>
              ${Array(parseInt(res[i]) + 1)
                .join(0)
                .split(0)
                .map((x, j) => `<span>${j}</span>`)
                .join("")}
            </span>
          `);
        }
      }
    });

    ticks = $stat.find("span[data-value]");

    const activate = () => {
      const top = $stat[0].getBoundingClientRect().top;
      const offset = $(window).height() * 0.9;

      setTimeout(() => {
        fresh = false;
      }, time);

      if (top < offset) {
        setTimeout(
          () => {
            ticks.each(function () {
              const dist = parseInt($(this).attr("data-value")) + 1;
              $(this).css("transform", `translateY(-${dist * 100}%)`);
            });
          },
          fresh ? time : 0
        );
        $(window).off("scroll", activate);
      }
    };

    $(window).on("scroll", activate);
    activate();
  });
}

function coreValue() {
  if ($(".core-value").length < 1) return;

  gsap.registerPlugin(ScrollTrigger);

  const panels = gsap.utils.toArray(".panel");
  const images = gsap.utils.toArray("#left img");

  gsap.set(panels, {
    yPercent: (i) => (i ? 100 : 0)
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".core-value",
      start: "-140px top",
      end: () => "+=" + 100 * panels.length + "%",
      pin: true,
      scrub: 1,
      markers: false
    }
  });

  panels.forEach((panel, index) => {
    if (index) {
      tl.to(
        panel,
        {
          yPercent: 0,
          ease: "none",
          onStart: () => {
            images.forEach((img, imgIndex) => {
              img.classList.toggle("active", imgIndex === index);
            });
          },
          onReverseComplete: () => {
            images.forEach((img, imgIndex) => {
              img.classList.toggle("active", imgIndex === index - 1);
            });
          }
        },
        "+=0.25"
      );
    }
  });
}
