document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("education-slider-track");
    const toggleBtn = document.getElementById("slider-toggle-btn");
    const dots = document.querySelectorAll(".slider-dots .dot");
    const images = document.querySelectorAll(".image-holder img");
    const firstImage = images.length > 0 ? images[0] : null;
    const secondImage = images.length > 1 ? images[1] : null;

    if (!track) return;

    // Find panels and build a map of target -> index
    const panels = Array.from(track.querySelectorAll(".slide-panel"));
    if (panels.length === 0) return;

    const targetMap = {};
    panels.forEach((panel, index) => {
        const slideName = panel.getAttribute("data-slide");
        if (slideName) targetMap[slideName] = index;
    });

    // We assume MSc is present if targetMap["msc"] exists
    const hasMsc = "msc" in targetMap;

    // BSc images
    const bscImage1 = "/images/education/cairo-university-1.webp";
    const bscImage2 = "/images/education/cairo-university-2.webp";
    // MSc images (preloaded)
    const mscImage1 = "/images/education/ucalgary-logo.webp";
    const mscImage2 = "/images/education/ucalgary-campus.webp";
    if (hasMsc) {
        const preload1 = new Image(); preload1.src = mscImage1;
        const preload2 = new Image(); preload2.src = mscImage2;
    }

    let currentTarget = hasMsc ? "msc" : "bsc";

    function updateSlider(target) {
        if (!(target in targetMap)) return;

        currentTarget = target;
        const targetIndex = targetMap[target];
        track.style.transform = `translateX(-${targetIndex * 100}%)`;

        // Update hover behavior (MSc gets hover-color)
        const imageHolder = document.querySelector(".image-holder");
        if (imageHolder) {
            if (currentTarget === "msc") {
                imageHolder.classList.add("hover-color");
            } else {
                imageHolder.classList.remove("hover-color");
            }
        }

        // Update dots
        dots.forEach(dot => {
            if (dot.getAttribute("data-target") === currentTarget) {
                dot.classList.add("active");
                dot.setAttribute("aria-current", "true");
            } else {
                dot.classList.remove("active");
                dot.removeAttribute("aria-current");
            }
        });

        // Update toggle button
        if (toggleBtn && hasMsc) {
            if (currentTarget === "msc") {
                toggleBtn.setAttribute("data-target", "bsc");
                toggleBtn.innerText = "BSc →";
            } else {
                toggleBtn.setAttribute("data-target", "msc");
                toggleBtn.innerText = "← MSc";
            }
        }

        // Helper to smoothly update an image
        const updateImage = (imgEl, newSrc) => {
            if (!imgEl) return;
            if (!imgEl.src.includes(newSrc)) {
                const wrapper = imgEl.parentElement;
                if (getComputedStyle(wrapper).position === 'static') {
                    wrapper.style.position = 'relative';
                }
                const clone = imgEl.cloneNode();
                clone.style.position = 'absolute';
                clone.style.top = '0';
                clone.style.left = '0';
                clone.style.width = '100%';
                clone.style.height = '100%';
                clone.style.objectFit = 'cover';
                clone.style.transition = 'opacity 0.4s ease';
                clone.style.zIndex = '1';
                clone.style.filter = 'grayscale(100%)';

                wrapper.appendChild(clone);
                imgEl.src = newSrc;

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        clone.style.opacity = '0';
                        setTimeout(() => clone.remove(), 400);
                    });
                });
            }
        };

        const targetSrc1 = currentTarget === "bsc" ? bscImage1 : mscImage1;
        const targetSrc2 = currentTarget === "bsc" ? bscImage2 : mscImage2;
        updateImage(firstImage, targetSrc1);
        updateImage(secondImage, targetSrc2);
    }

    if (toggleBtn && hasMsc) {
        toggleBtn.addEventListener("click", () => {
            const target = toggleBtn.getAttribute("data-target");
            updateSlider(target);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const target = dot.getAttribute("data-target");
            if (target) updateSlider(target);
        });
    });
});
