function initGraduationVideo() {
    const poster = document.getElementById("grad-video-poster");
    const container = document.getElementById("grad-video-container");
    
    if (!poster || !container) return;
    
    // Check if iframe already exists (e.g. from a previous open)
    if (container.querySelector("iframe")) return;

    // Hover effect is handled in CSS, but click injects iframe
    poster.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.className = "w-100 h-100 position-absolute top-0 left-0";
        iframe.src = "https://www.youtube-nocookie.com/embed/r8zxcXHgXfw?rel=0&autoplay=1";
        iframe.title = "YouTube video player";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        
        container.appendChild(iframe);
        poster.style.display = "none";
    });
}

function resetGraduationVideo() {
    const container = document.getElementById("grad-video-container");
    const poster = document.getElementById("grad-video-poster");
    if (container && poster) {
        const iframe = container.querySelector("iframe");
        if (iframe) {
            iframe.remove();
        }
        poster.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const modalEl = document.getElementById("grad-project-modal");
    if (!modalEl) return;
    
    let originalUrl = window.location.pathname + window.location.search;
    let isModalRoute = false;

    // Listeners for Bootstrap modal
    modalEl.addEventListener("show.bs.modal", () => {
        // Update URL
        originalUrl = window.location.pathname + window.location.search;
        window.history.pushState({ modal: true }, "", "/projects/graduation-project");
        isModalRoute = true;
        
        // Init video logic
        initGraduationVideo();
    });

    modalEl.addEventListener("hidden.bs.modal", () => {
        // Destroy iframe to stop audio
        resetGraduationVideo();
        
        // Restore URL if we were the ones who changed it
        if (isModalRoute) {
            window.history.pushState({}, "", originalUrl);
            isModalRoute = false;
        }
    });

    // Handle browser back button closing the modal
    window.addEventListener("popstate", (e) => {
        if (isModalRoute && window.location.pathname !== "/projects/graduation-project") {
            // User pressed back, close modal
            isModalRoute = false;
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) {
                bsModal.hide();
            }
        }
    });
});
