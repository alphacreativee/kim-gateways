"use strict";
$ = jQuery;

$(document).ready(function(){
    header();
    createFilter();
})

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

function header(){
  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    onUpdate: (self) => {
        self.direction === 1 ? $('header').addClass('header--scroll') : '';
        self.progress === 0 ? $('header').removeClass('header--scroll') : '';
    },
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
            duration: 0.25,
          });
        },
      });
    });
  });
}
