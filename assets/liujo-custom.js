/**
 * LIU JO INTERACTIVE CONTROLLER
 * Supports video play/pause/mute, horizontal drag carousel, mobile tabs/drawer, footer accordions & wishlist
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiuJoVideoControls();
  initLiuJoCarousels();
  initLiuJoMobileDrawer();
  initLiuJoFooterAccordions();
  initLiuJoWishlist();
  initLiuJoAnnouncementBar();
  initLiuJoSizeGuideModal();
  initLiuJoGridToggler();
  initLiuJoMobileStickyCart();
});

// 1. VIDEO CONTROLS
function initLiuJoVideoControls() {
  const videoContainers = document.querySelectorAll('[data-liujo-video-container]');
  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const playBtn = container.querySelector('[data-video-play-btn]');
    const muteBtn = container.querySelector('[data-video-mute-btn]');

    if (!video) return;

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (video.paused) {
          video.play();
          playBtn.setAttribute('data-playing', 'true');
          updateVideoIcons(playBtn, true);
        } else {
          video.pause();
          playBtn.setAttribute('data-playing', 'false');
          updateVideoIcons(playBtn, false);
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.setAttribute('data-muted', video.muted ? 'true' : 'false');
        updateMuteIcons(muteBtn, video.muted);
      });
    }
  });

  function updateVideoIcons(btn, isPlaying) {
    const playIcon = btn.querySelector('.icon-play');
    const pauseIcon = btn.querySelector('.icon-pause');
    if (playIcon && pauseIcon) {
      playIcon.style.display = isPlaying ? 'none' : 'block';
      pauseIcon.style.display = isPlaying ? 'block' : 'none';
    }
  }

  function updateMuteIcons(btn, isMuted) {
    const muteIcon = btn.querySelector('.icon-mute');
    const soundIcon = btn.querySelector('.icon-sound');
    if (muteIcon && soundIcon) {
      muteIcon.style.display = isMuted ? 'block' : 'none';
      soundIcon.style.display = isMuted ? 'none' : 'block';
    }
  }
}

// 2. HORIZONTAL DRAGGABLE & BUTTON CONTROLLED CAROUSELS
function initLiuJoCarousels() {
  const carouselSections = document.querySelectorAll('[data-liujo-carousel]');
  carouselSections.forEach(section => {
    const track = section.querySelector('[data-carousel-track]');
    const prevBtn = section.querySelector('[data-carousel-prev]');
    const nextBtn = section.querySelector('[data-carousel-next]');

    if (!track) return;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const itemWidth = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300;
        track.scrollBy({ left: -itemWidth * 2, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const itemWidth = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300;
        track.scrollBy({ left: itemWidth * 2, behavior: 'smooth' });
      });
    }

    // Touch & Mouse Drag to Scroll
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  });
}

// 3. MOBILE DRAWER NAVIGATION & TABS
function initLiuJoMobileDrawer() {
  const openBtn = document.querySelector('[data-liujo-drawer-open]');
  const closeBtn = document.querySelector('[data-liujo-drawer-close]');
  const overlay = document.querySelector('[data-liujo-drawer-overlay]');
  const drawer = document.querySelector('[data-liujo-drawer]');
  const tabBtns = document.querySelectorAll('[data-liujo-tab-btn]');
  const tabPanels = document.querySelectorAll('[data-liujo-tab-panel]');
  const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');

  function openDrawer() {
    if (drawer) drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Tab switching (Women / Men / Kids)
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-target-tab');

      tabBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      tabPanels.forEach(panel => {
        if (panel.getAttribute('data-tab-id') === targetTab) {
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  // Collapsible Accordions inside Mobile Drawer
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = trigger.closest('.liujo-mob-nav-item');
      if (!parentItem) return;

      const isOpen = parentItem.classList.contains('is-open');
      // Optional: close other accordions in the same panel
      const siblingItems = parentItem.parentElement.querySelectorAll('.liujo-mob-nav-item');
      siblingItems.forEach(item => {
        if (item !== parentItem) item.classList.remove('is-open');
      });

      if (isOpen) {
        parentItem.classList.remove('is-open');
      } else {
        parentItem.classList.add('is-open');
      }
    });
  });
}

// 4. FOOTER ACCORDIONS (MOBILE COLLAPSIBLE)
function initLiuJoFooterAccordions() {
  const headings = document.querySelectorAll('.liujo-footer-heading');
  headings.forEach(heading => {
    heading.addEventListener('click', () => {
      if (window.innerWidth >= 992) return;
      const links = heading.nextElementSibling;
      if (!links) return;

      const isOpen = heading.classList.contains('is-open');
      headings.forEach(h => {
        h.classList.remove('is-open');
        if (h.nextElementSibling) h.nextElementSibling.classList.remove('is-open');
      });

      if (!isOpen) {
        heading.classList.add('is-open');
        links.classList.add('is-open');
      }
    });
  });
}

// 5. WISHLIST TOGGLE & LOCAL STORAGE
function initLiuJoWishlist() {
  const wishlistTriggers = document.querySelectorAll('[data-liujo-wishlist]');
  const wishlistCountBadge = document.querySelector('[data-wishlist-count]');

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('liujo_wishlist') || '[]');
    } catch (e) {
      return [];
    }
  }

  function setWishlist(items) {
    try {
      localStorage.setItem('liujo_wishlist', JSON.stringify(items));
      if (wishlistCountBadge) {
        wishlistCountBadge.textContent = items.length;
        wishlistCountBadge.style.display = items.length > 0 ? 'inline-block' : 'none';
      }
    } catch (e) {}
  }

  function updateBtnUI(btn, isInList) {
    if (isInList) {
      btn.classList.add('is-active');
      const textSpan = btn.querySelector('.liujo-wishlist-btn-text');
      if (textSpan) textSpan.textContent = 'In Wishlist';
    } else {
      btn.classList.remove('is-active');
      const textSpan = btn.querySelector('.liujo-wishlist-btn-text');
      if (textSpan) textSpan.textContent = 'Add to Wishlist';
    }
  }

  const currentWishlist = getWishlist();
  if (wishlistCountBadge) {
    wishlistCountBadge.textContent = currentWishlist.length;
    wishlistCountBadge.style.display = currentWishlist.length > 0 ? 'inline-block' : 'none';
  }

  wishlistTriggers.forEach(btn => {
    const productId = btn.getAttribute('data-product-id');
    const isIn = currentWishlist.includes(productId);
    updateBtnUI(btn, isIn);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let list = getWishlist();
      if (list.includes(productId)) {
        list = list.filter(id => id !== productId);
        updateBtnUI(btn, false);
      } else {
        list.push(productId);
        updateBtnUI(btn, true);
      }
      setWishlist(list);
    });
  });
}

// 6. ANNOUNCEMENT BAR TICKER
function initLiuJoAnnouncementBar() {
  const slides = document.querySelectorAll('.liujo-announcement-slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].style.display = 'block';
  }, 4500);
}

// 7. SIZE GUIDE MODAL
function initLiuJoSizeGuideModal() {
  const modal = document.getElementById('LiuJoSizeGuideModal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('[data-size-modal-open]');
  const closeTriggers = document.querySelectorAll('[data-size-modal-close]');

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  closeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  });
}

// 8. PLP GRID COLUMN TOGGLER
function initLiuJoGridToggler() {
  const togglers = document.querySelectorAll('[data-liujo-grid-toggler]');
  const grid = document.getElementById('product-grid');
  if (!grid || !togglers.length) return;

  const savedDesktopCols = sessionStorage.getItem('liujo_grid_cols_desktop') || '4';
  const savedMobileCols = sessionStorage.getItem('liujo_grid_cols_mobile') || '2';

  if (savedDesktopCols === '2') {
    grid.classList.add('grid--compact');
    updateActiveButtons('2', false);
  }
  if (savedMobileCols === '1') {
    grid.classList.add('grid--mobile-compact');
    updateActiveButtons('1', true);
  }

  togglers.forEach(container => {
    const buttons = container.querySelectorAll('.liujo-grid-toggle-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cols = btn.getAttribute('data-grid-cols');
        const isMobile = window.innerWidth < 990;

        if (isMobile) {
          if (cols === '1') {
            grid.classList.add('grid--mobile-compact');
            sessionStorage.setItem('liujo_grid_cols_mobile', '1');
          } else {
            grid.classList.remove('grid--mobile-compact');
            sessionStorage.setItem('liujo_grid_cols_mobile', '2');
          }
          updateActiveButtons(cols, true);
        } else {
          if (cols === '2') {
            grid.classList.add('grid--compact');
            sessionStorage.setItem('liujo_grid_cols_desktop', '2');
          } else {
            grid.classList.remove('grid--compact');
            sessionStorage.setItem('liujo_grid_cols_desktop', '4');
          }
          updateActiveButtons(cols, false);
        }
      });
    });
  });

  function updateActiveButtons(cols, isMobile) {
    togglers.forEach(container => {
      const buttons = container.querySelectorAll('.liujo-grid-toggle-btn');
      buttons.forEach(b => {
        const bCols = b.getAttribute('data-grid-cols');
        const bIsMobile = b.classList.contains('large-up-hide');
        if (bIsMobile === isMobile) {
          if (bCols === cols) {
            b.classList.add('is-active');
          } else {
            b.classList.remove('is-active');
          }
        }
      });
    });
  }
}

// 9. MOBILE STICKY BUY BAR
function initLiuJoMobileStickyCart() {
  const stickyBar = document.querySelector('[data-liujo-sticky-cart]');
  if (!stickyBar) return;

  const mainSubmitBtn = document.querySelector('.product-form__submit');
  const stickySubmitBtn = stickyBar.querySelector('[data-liujo-sticky-submit]');

  window.addEventListener('scroll', () => {
    if (window.innerWidth >= 990) {
      stickyBar.classList.remove('is-visible');
      return;
    }

    if (mainSubmitBtn) {
      const rect = mainSubmitBtn.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }
    } else if (window.scrollY > 450) {
      stickyBar.classList.add('is-visible');
    } else {
      stickyBar.classList.remove('is-visible');
    }
  }, { passive: true });

  if (stickySubmitBtn && mainSubmitBtn) {
    stickySubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mainSubmitBtn.click();
    });
  }
}
