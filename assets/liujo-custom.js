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
  initLiuJoSearchDrawer();
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

// 10. REAL-TIME PREDICTIVE SEARCH DRAWER (MATCHING SS1 & SS2)
function initLiuJoSearchDrawer() {
  const triggers = document.querySelectorAll('[data-liujo-search-trigger]');
  const drawer = document.querySelector('[data-liujo-search-drawer]');
  const backdrop = document.querySelector('[data-liujo-search-backdrop]');
  if (!drawer || !backdrop) return;

  const input = drawer.querySelector('[data-liujo-search-input]');
  const clearBtn = drawer.querySelector('[data-liujo-search-clear]');
  const clearDivider = drawer.querySelector('[data-liujo-search-clear-divider]');
  const closeBtn = drawer.querySelector('[data-liujo-search-close]');
  const beforeState = drawer.querySelector('[data-liujo-search-before]');
  const afterState = drawer.querySelector('[data-liujo-search-after]');
  const productsContainer = drawer.querySelector('[data-liujo-search-products]');
  const queriesContainer = drawer.querySelector('[data-liujo-search-queries-list]');
  const loadingSpinner = drawer.querySelector('[data-liujo-search-loading]');
  const emptyState = drawer.querySelector('[data-liujo-search-empty]');
  const seeAllLink = drawer.querySelector('[data-liujo-see-all]');
  const searchUrl = drawer.dataset.searchUrl || '/search';
  const predictiveUrl = drawer.dataset.predictiveUrl || '/search/suggest';

  let debounceTimer = null;
  let activeAbortController = null;

  // Open Drawer
  function openSearch() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.classList.add('has-search-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (input) input.focus();
    }, 150);
  }

  // Close Drawer
  function closeSearch() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('has-search-open');
    document.body.style.overflow = '';
    if (drawer) drawer.scrollTop = 0;
  }

  // Toggle Search Drawer with Search Trigger
  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (drawer.classList.contains('is-open')) {
        closeSearch();
      } else {
        openSearch();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSearch();
    });
  }

  backdrop.addEventListener('click', closeSearch);

  // AUTO-CLOSE SEARCH DRAWER ON HEADER MENU INTERACTION (CLICK & MOUSEENTER)
  const headerRootMenu = document.querySelector('.liujo-header__rootmenu');
  if (headerRootMenu) {
    headerRootMenu.addEventListener('click', () => {
      if (drawer.classList.contains('is-open')) {
        closeSearch();
      }
    });
    headerRootMenu.addEventListener('mouseenter', () => {
      if (drawer.classList.contains('is-open')) {
        closeSearch();
      }
    });
  }

  const headerNavItems = document.querySelectorAll('.liujo-header__nav-item, .liujo-header__nav-link');
  headerNavItems.forEach(item => {
    item.addEventListener('click', () => {
      if (drawer.classList.contains('is-open')) {
        closeSearch();
      }
    });
    item.addEventListener('mouseenter', () => {
      if (drawer.classList.contains('is-open')) {
        closeSearch();
      }
    });
  });

  // Also auto-close if user clicks Header Logo or other items in Header (outside search trigger and drawer)
  const headerContainer = document.querySelector('.liujo-header');
  if (headerContainer) {
    headerContainer.addEventListener('click', (e) => {
      if (e.target.closest('[data-liujo-search-trigger]') || e.target.closest('.liujo-search-drawer')) {
        return;
      }
      if (drawer.classList.contains('is-open')) {
        closeSearch();
      }
    });
  }

  // Auto-close on outside click anywhere on document
  document.addEventListener('click', (e) => {
    if (!drawer.classList.contains('is-open')) return;
    if (e.target.closest('[data-liujo-search-drawer]') || e.target.closest('[data-liujo-search-trigger]')) {
      return;
    }
    closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeSearch();
    }
  });

  const firstTab = drawer.querySelector('[data-search-tab]');
  let currentGender = firstTab ? (firstTab.dataset.searchTab || 'women') : 'women';
  let currentGenderName = firstTab ? (firstTab.dataset.searchTabName || currentGender) : currentGender;

  // Synchronized Category Tab Switcher (State 1 & State 2)
  const tabBtns = drawer.querySelectorAll('[data-search-tab]');
  const afterTabBtns = drawer.querySelectorAll('[data-search-after-tab]');
  const panels = drawer.querySelectorAll('[data-search-panel]');

  function setGender(gender, genderName) {
    currentGender = gender;
    currentGenderName = genderName || gender;

    // Sync State 1 Tabs
    tabBtns.forEach(t => {
      if (t.dataset.searchTab === gender) t.classList.add('is-active');
      else t.classList.remove('is-active');
    });

    // Sync State 2 Tabs
    afterTabBtns.forEach(t => {
      if (t.dataset.searchAfterTab === gender) t.classList.add('is-active');
      else t.classList.remove('is-active');
    });

    // Sync State 1 Panels
    panels.forEach(p => {
      if (p.dataset.searchPanel === gender) {
        p.style.display = 'block';
        p.classList.add('is-active');
      } else {
        p.style.display = 'none';
        p.classList.remove('is-active');
      }
    });

    // When in State 2 with text in input, re-run predictive search for this tab immediately!
    const query = input ? input.value.trim() : '';
    if (query.length > 0) {
      showAfterState(query, currentGender, currentGenderName);
    }
  }

  // Category Tabs in State 1 (BEFORE SEARCH)
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      setGender(tab.dataset.searchTab, tab.dataset.searchTabName);
    });
  });

  // Category Tabs in State 2 (AFTER SEARCH)
  afterTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      setGender(tab.dataset.searchAfterTab, tab.dataset.searchTabName);
    });
  });

  // Suggestion buttons in State 1 (Delegated click handling - SUGGESTIONS & NEW IN)
  if (beforeState) {
    beforeState.addEventListener('click', (e) => {
      const btn = e.target.closest('.liujo-search-suggestion-btn, [data-query], a, button');
      if (!btn) return;
      e.preventDefault();
      const query = (btn.dataset.query || btn.textContent).trim();
      if (query && input) {
        input.value = query;
        if (clearBtn) clearBtn.style.display = 'inline-flex';
        if (clearDivider) clearDivider.style.display = 'inline-block';
        showAfterState(query, currentGender, currentGenderName);
      }
    });
  }

  // Clickable suggestions in State 2 (SUGGESTIONS FOR YOU)
  if (queriesContainer) {
    queriesContainer.addEventListener('click', (e) => {
      const item = e.target.closest('a, button, [data-query]');
      if (!item) return;
      e.preventDefault();
      const term = (item.getAttribute('data-query') || item.textContent).trim();
      if (term && input) {
        input.value = term;
        if (clearBtn) clearBtn.style.display = 'inline-flex';
        if (clearDivider) clearDivider.style.display = 'inline-block';
        showAfterState(term, currentGender, currentGenderName);
      }
    });
  }

  // Clear "X" Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.focus();
        showBeforeState();
      }
    });
  }

  // Handle Input Changes (Real-Time Predictive Search)
  if (input) {
    input.addEventListener('input', () => {
      const query = input.value.trim();

      if (query.length > 0) {
        if (clearBtn) clearBtn.style.display = 'inline-flex';
        if (clearDivider) clearDivider.style.display = 'inline-block';
        showAfterState(query);
      } else {
        showBeforeState();
      }
    });
  }

  function showBeforeState() {
    if (clearBtn) clearBtn.style.display = 'none';
    if (clearDivider) clearDivider.style.display = 'none';
    if (beforeState) beforeState.style.display = 'block';
    if (afterState) afterState.style.display = 'none';
    if (activeAbortController) activeAbortController.abort();
  }

  function showAfterState(query, gender = currentGender, genderName = currentGenderName) {
    if (beforeState) beforeState.style.display = 'none';
    if (afterState) afterState.style.display = 'block';
    if (seeAllLink) {
      let seeAllQuery = query;
      const gTerm = (genderName || gender || '').toLowerCase();
      if (gTerm && gTerm !== 'all' && !query.toLowerCase().includes(gTerm)) {
        seeAllQuery = `${query} ${gTerm}`;
      }
      seeAllLink.href = `${searchUrl}?q=${encodeURIComponent(seeAllQuery)}`;
    }

    // Debounce AJAX fetch (180ms)
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchPredictiveResults(query, gender, genderName);
    }, 180);
  }

  // Helper to generate search query candidates for guaranteed product matches
  function generateSearchCandidates(rawQuery, gender, genderName) {
    const candidates = [];
    const q = (rawQuery || '').trim();
    if (!q) return candidates;

    const gTerm = (genderName || gender || '').toLowerCase();

    // 1. Exact query as typed/clicked
    candidates.push(q);

    // 2. Targeted with gender keyword (if not already present and specific)
    if (gTerm && gTerm !== 'all' && !q.toLowerCase().includes(gTerm)) {
      candidates.push(`${q} ${gTerm}`);
    }

    // 3. Cleaned query without possessives 's / ' (e.g. "Women's Hobo Bags" -> "Women Hobo Bags")
    const cleanNoApos = q.replace(/['’]s\b/gi, '').replace(/['’]/g, '').trim();
    if (cleanNoApos && !candidates.includes(cleanNoApos)) {
      candidates.push(cleanNoApos);
    }

    // 4. Core fashion noun / category fallback keywords
    const lower = q.toLowerCase();
    if (lower.includes('bag')) {
      if (!candidates.includes('bag')) candidates.push('bag');
      if (!candidates.includes('handbag')) candidates.push('handbag');
    }
    if (lower.includes('jean') || lower.includes('denim')) {
      if (!candidates.includes('jeans')) candidates.push('jeans');
      if (!candidates.includes('denim')) candidates.push('denim');
    }
    if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('boot') || lower.includes('sandal')) {
      if (!candidates.includes('sneakers')) candidates.push('sneakers');
      if (!candidates.includes('shoes')) candidates.push('shoes');
    }
    if (lower.includes('dress')) {
      if (!candidates.includes('dress')) candidates.push('dress');
    }
    if (lower.includes('jacket') || lower.includes('coat')) {
      if (!candidates.includes('jacket')) candidates.push('jacket');
      if (!candidates.includes('coat')) candidates.push('coat');
    }
    if (lower.includes('shirt') || lower.includes('top') || lower.includes('blouse')) {
      if (!candidates.includes('top')) candidates.push('top');
      if (!candidates.includes('shirt')) candidates.push('shirt');
    }

    // 5. Significant word in query (e.g. "Hobo Bags" -> "Hobo", "Bags")
    const words = cleanNoApos.split(/\s+/).filter(w => {
      const wLow = w.toLowerCase();
      return !['women', 'womens', 'men', 'mens', 'kid', 'kids', 'the', 'and', 'for', 'in', 'new', 'arrivals'].includes(wLow);
    });
    words.forEach(w => {
      if (w.length >= 3 && !candidates.includes(w)) {
        candidates.push(w);
      }
    });

    return candidates;
  }

  // Helper to generate dynamic, high-fashion suggestions (Matching SS2 exact format)
  function getDynamicSuggestionsForQuery(query, gender, genderName) {
    const qLower = (query || '').toLowerCase();
    const gTitle = (genderName || (gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Women'));
    const gPrefix = gTitle.toLowerCase() === 'all' ? "Women's" : `${gTitle}'s`;

    if (qLower.includes('bag') || qLower.includes('handbag') || qLower.includes('tote')) {
      return [
        `${gPrefix} Hobo Bags`,
        `${gPrefix} Belt bags`,
        `${gPrefix} Shopping Bags`,
        `${gPrefix} Shoulder Bags`,
        `${gPrefix} Crossbody Bags`
      ];
    }

    if (qLower.includes('jean') || qLower.includes('denim')) {
      return [
        `${gPrefix} Flare Jeans`,
        `${gPrefix} Skinny Jeans`,
        `${gPrefix} Straight Jeans`,
        `${gPrefix} Wide Leg Jeans`,
        `${gPrefix} High Waist Jeans`
      ];
    }

    if (qLower.includes('shoe') || qLower.includes('sneaker') || qLower.includes('boot') || qLower.includes('sandal')) {
      return [
        `${gPrefix} Platform Sneakers`,
        `${gPrefix} Running Sneakers`,
        `${gPrefix} Leather Sneakers`,
        `${gPrefix} Ankle Boots`,
        `${gPrefix} Heeled Sandals`
      ];
    }

    if (qLower.includes('dress')) {
      return [
        `${gPrefix} Short Dresses`,
        `${gPrefix} Midi Dresses`,
        `${gPrefix} Long Dresses`,
        `${gPrefix} Party Dresses`,
        `${gPrefix} Floral Dresses`
      ];
    }

    if (qLower.includes('jacket') || qLower.includes('coat')) {
      return [
        `${gPrefix} Biker Jackets`,
        `${gPrefix} Down Jackets`,
        `${gPrefix} Trench Coats`,
        `${gPrefix} Blazer Jackets`,
        `${gPrefix} Denim Jackets`
      ];
    }

    if (qLower.includes('new') || qLower.includes('arrival')) {
      return [
        `${gPrefix} New Arrivals Clothing`,
        `${gPrefix} New In Bags`,
        `${gPrefix} New In Shoes`,
        `${gPrefix} New In Accessories`,
        `${gPrefix} Latest Collection`
      ];
    }

    const cleanTerm = query.trim();
    return [
      `${gPrefix} ${cleanTerm}`,
      `${cleanTerm} Collection`,
      `${cleanTerm} Best Sellers`,
      `${cleanTerm} New In`,
      `${cleanTerm} Accessories`
    ];
  }

  // Multi-tier predictive search with candidate fallback
  function fetchPredictiveResults(query, gender = currentGender, genderName = currentGenderName) {
    if (activeAbortController) activeAbortController.abort();
    activeAbortController = new AbortController();

    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';
    if (productsContainer) productsContainer.innerHTML = '';

    const candidates = generateSearchCandidates(query, gender, genderName);

    function tryCandidate(index) {
      if (index >= candidates.length) {
        // Fallback to HTML predictive section
        fetchSectionFallback(query, () => {
          // If HTML section returned nothing, fallback to store products catalog
          fetchCatalogFallback(query, gender, genderName);
        });
        return;
      }

      const qTerm = candidates[index];
      const endpoint = `${predictiveUrl}.json?q=${encodeURIComponent(qTerm)}&resources[type]=product,query,collection&resources[limit]=10`;

      fetch(endpoint, { signal: activeAbortController.signal })
        .then(res => {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(data => {
          const prods = data?.resources?.results?.products || [];
          if (prods.length > 0) {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            renderResults(data, query, gender, genderName);
          } else {
            tryCandidate(index + 1);
          }
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          tryCandidate(index + 1);
        });
    }

    tryCandidate(0);
  }

  function fetchSectionFallback(query, onEmptyFallback) {
    fetch(`${predictiveUrl}?q=${encodeURIComponent(query)}&section_id=predictive-search`, {
      signal: activeAbortController.signal
    })
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const items = doc.querySelectorAll('#predictive-search-results-products-list .predictive-search__list-item');
        if (items.length > 0) {
          if (loadingSpinner) loadingSpinner.style.display = 'none';
          let cardsHtml = '';
          items.forEach((item, index) => {
            if (index >= 10) return;
            const link = item.querySelector('a');
            const img = item.querySelector('img');
            const heading = item.querySelector('.predictive-search__item-heading');
            if (link && heading) {
              cardsHtml += `
                <a href="${link.href}" class="liujo-search-card">
                  <div class="liujo-search-card__media">
                    ${img ? `<img src="${img.src}" alt="${img.alt || heading.textContent.trim()}" loading="lazy">` : ''}
                  </div>
                  <span class="liujo-search-card__title">${heading.textContent.trim()}</span>
                </a>
              `;
            }
          });
          if (productsContainer) productsContainer.innerHTML = cardsHtml;
        } else {
          if (typeof onEmptyFallback === 'function') {
            onEmptyFallback();
          } else {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
          }
        }
      })
      .catch(() => {
        if (typeof onEmptyFallback === 'function') {
          onEmptyFallback();
        } else {
          if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
      });
  }

  // Final fallback to store products catalog
  function fetchCatalogFallback(query, gender, genderName) {
    fetch('/products.json?limit=10', { signal: activeAbortController.signal })
      .then(r => r.json())
      .then(resData => {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        const rawProducts = resData.products || [];
        if (rawProducts.length > 0) {
          const adaptedProducts = rawProducts.map(p => ({
            title: p.title,
            url: `/products/${p.handle}`,
            image: (p.images && p.images[0]) ? p.images[0].src : ''
          }));
          renderResults({ resources: { results: { products: adaptedProducts, queries: [], collections: [] } } }, query, gender, genderName);
        } else {
          if (emptyState) emptyState.style.display = 'block';
        }
      })
      .catch(() => {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
      });
  }

  function renderResults(data, query, gender = currentGender, genderName = currentGenderName) {
    const products = data?.resources?.results?.products || [];
    const queries = data?.resources?.results?.queries || [];
    const collections = data?.resources?.results?.collections || [];

    // Render Queries / Suggestions in Sidebar (Matching SS2 exactly)
    if (queriesContainer) {
      let suggestionsHtml = '';
      const addedQueries = new Set();

      // 1. Direct predictive queries from Shopify
      if (queries.length > 0) {
        queries.forEach(q => {
          const text = (q.text || '').trim();
          if (text && !addedQueries.has(text.toLowerCase())) {
            addedQueries.add(text.toLowerCase());
            suggestionsHtml += `<li><a href="#" data-query="${text}">${text}</a></li>`;
          }
        });
      }

      // 2. Dynamic high-fashion suggestions matching SS2 (e.g. Women's Hobo Bags, etc.)
      const contextualSugs = getDynamicSuggestionsForQuery(query, gender, genderName);
      contextualSugs.forEach(text => {
        if (!addedQueries.has(text.toLowerCase()) && addedQueries.size < 5) {
          addedQueries.add(text.toLowerCase());
          suggestionsHtml += `<li><a href="#" data-query="${text}">${text}</a></li>`;
        }
      });

      // 3. Fallback to collections
      if (collections.length > 0 && addedQueries.size < 5) {
        collections.forEach(col => {
          const title = (col.title || '').trim();
          if (title && !addedQueries.has(title.toLowerCase())) {
            addedQueries.add(title.toLowerCase());
            suggestionsHtml += `<li><a href="#" data-query="${title}">${title}</a></li>`;
          }
        });
      }

      // 4. Fallback to active panel menu buttons
      if (addedQueries.size < 5) {
        const activePanel = drawer.querySelector(`[data-search-panel="${gender}"]`) || drawer.querySelector('[data-search-panel].is-active');
        if (activePanel) {
          const menuBtns = activePanel.querySelectorAll('.liujo-search-suggestion-btn');
          menuBtns.forEach(btn => {
            const term = (btn.dataset.query || btn.textContent).trim();
            if (term && !addedQueries.has(term.toLowerCase()) && addedQueries.size < 5) {
              addedQueries.add(term.toLowerCase());
              suggestionsHtml += `<li><a href="#" data-query="${term}">${term}</a></li>`;
            }
          });
        }
      }

      if (addedQueries.size === 0) {
        suggestionsHtml += `<li><a href="#" data-query="${query}">${query}</a></li>`;
      }

      queriesContainer.innerHTML = suggestionsHtml;
    }

    // Render Products Grid (5-column luxury cards matching SS2)
    if (products.length > 0) {
      if (emptyState) emptyState.style.display = 'none';
      let cardsHtml = '';
      products.slice(0, 10).forEach(product => {
        const imgUrl = product.image || product.featured_image?.url || product.featured_image || (product.images && product.images[0] ? (product.images[0].src || product.images[0]) : '') || '';
        const title = product.title || '';
        const url = product.url || `/products/${product.handle || ''}`;
        cardsHtml += `
          <a href="${url}" class="liujo-search-card">
            <div class="liujo-search-card__media">
              ${imgUrl ? `<img src="${imgUrl}" alt="${title}" loading="lazy">` : ''}
            </div>
            <span class="liujo-search-card__title">${title}</span>
          </a>
        `;
      });
      if (productsContainer) productsContainer.innerHTML = cardsHtml;
    } else {
      if (emptyState) emptyState.style.display = 'block';
    }
  }
}
