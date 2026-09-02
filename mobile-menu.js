document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuClose = document.getElementById("mobile-menu-close");

    if (!menuToggle || !mobileMenu) {
        console.error("Mobile menu elements not found.");
        return;
    }

    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.add("active");
        document.body.classList.add("menu-open");
    });

    if (menuClose) {
        menuClose.addEventListener("click", function () {
            mobileMenu.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    }

    // Close menu when a link is clicked
    const menuLinks = mobileMenu.querySelectorAll("a");

    menuLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            mobileMenu.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    });

});
