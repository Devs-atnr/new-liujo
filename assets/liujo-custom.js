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
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (input) input.focus();
    }, 150);
  }

  // Close Drawer
  function closeSearch() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeSearch();
    });
  }

  backdrop.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeSearch();
    }
  });

  let currentGender = 'women';

  // Synchronized Gender Tab Switcher (State 1 & State 2)
  const tabBtns = drawer.querySelectorAll('[data-search-tab]');
  const afterTabBtns = drawer.querySelectorAll('[data-search-after-tab]');
  const panels = drawer.querySelectorAll('[data-search-panel]');

  function setGender(gender) {
    currentGender = gender;

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
      showAfterState(query, currentGender);
    }
  }

  // Category Tabs in State 1 (BEFORE SEARCH)
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      setGender(tab.dataset.searchTab);
    });
  });

  // Category Tabs in State 2 (AFTER SEARCH) - Now fully interactive and re-queries!
  afterTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      setGender(tab.dataset.searchAfterTab);
    });
  });

  // Suggestion buttons in State 1 (Clicking automatically searches)
  const suggestionBtns = drawer.querySelectorAll('.liujo-search-suggestion-btn');
  suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query || btn.textContent.trim();
      if (input) {
        input.value = query;
        showAfterState(query, currentGender);
      }
    });
  });

  // Clickable suggestions in State 2 (SUGGESTIONS FOR YOU)
  if (queriesContainer) {
    queriesContainer.addEventListener('click', (e) => {
      const item = e.target.closest('[data-query]');
      if (!item) return;
      e.preventDefault();
      const term = item.getAttribute('data-query');
      if (term && input) {
        input.value = term;
        showAfterState(term, currentGender);
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

  function showAfterState(query, gender = currentGender) {
    if (beforeState) beforeState.style.display = 'none';
    if (afterState) afterState.style.display = 'block';
    if (seeAllLink) {
      let seeAllQuery = query;
      if (gender === 'men' && !query.toLowerCase().includes('men')) seeAllQuery = `${query} men`;
      else if (gender === 'kids' && !query.toLowerCase().includes('kid')) seeAllQuery = `${query} kids`;
      seeAllLink.href = `${searchUrl}?q=${encodeURIComponent(seeAllQuery)}`;
    }

    // Debounce AJAX fetch (200ms)
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchPredictiveResults(query, gender);
    }, 200);
  }

  function fetchPredictiveResults(query, gender = currentGender) {
    if (activeAbortController) activeAbortController.abort();
    activeAbortController = new AbortController();

    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';
    if (productsContainer) productsContainer.innerHTML = '';

    // Targeted query based on active category tab
    let targetQuery = query;
    if (gender === 'men' && !query.toLowerCase().includes('men') && !query.toLowerCase().includes('uomo')) {
      targetQuery = `${query} men`;
    } else if (gender === 'kids' && !query.toLowerCase().includes('kid') && !query.toLowerCase().includes('child') && !query.toLowerCase().includes('baby')) {
      targetQuery = `${query} kids`;
    }

    const endpoint = `${predictiveUrl}.json?q=${encodeURIComponent(targetQuery)}&resources[type]=product,query,collection&resources[limit]=10`;

    fetch(endpoint, { signal: activeAbortController.signal })
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        const prods = data?.resources?.results?.products || [];
        // Fallback to base query if category-specific returned 0
        if (prods.length === 0 && targetQuery !== query) {
          fetch(`${predictiveUrl}.json?q=${encodeURIComponent(query)}&resources[type]=product,query,collection&resources[limit]=10`, { signal: activeAbortController.signal })
            .then(r => r.json())
            .then(fallbackData => {
              if (loadingSpinner) loadingSpinner.style.display = 'none';
              renderResults(fallbackData, query, gender);
            })
            .catch(() => {
              if (loadingSpinner) loadingSpinner.style.display = 'none';
              renderResults(data, query, gender);
            });
        } else {
          if (loadingSpinner) loadingSpinner.style.display = 'none';
          renderResults(data, query, gender);
        }
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        fetchSectionFallback(targetQuery, gender);
      });
  }

  function fetchSectionFallback(query) {
    fetch(`${predictiveUrl}?q=${encodeURIComponent(query)}&section_id=predictive-search`, {
      signal: activeAbortController.signal
    })
      .then(res => res.text())
      .then(html => {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const items = doc.querySelectorAll('#predictive-search-results-products-list .predictive-search__list-item');
        if (items.length > 0) {
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
          if (emptyState) emptyState.style.display = 'block';
        }
      })
      .catch(() => {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
      });
  }

  function renderResults(data, query, gender = currentGender) {
    const products = data?.resources?.results?.products || [];
    const queries = data?.resources?.results?.queries || [];
    const collections = data?.resources?.results?.collections || [];

    // Render Queries / Suggestions in Sidebar
    if (queriesContainer) {
      let suggestionsHtml = '';
      if (queries.length > 0) {
        queries.forEach(q => {
          suggestionsHtml += `<li><a href="#" data-query="${q.text}">${q.text}</a></li>`;
        });
      } else if (collections.length > 0) {
        collections.forEach(col => {
          suggestionsHtml += `<li><a href="${col.url}">${col.title}</a></li>`;
        });
      } else {
        const prefix = gender === 'men' ? "Men's " : (gender === 'kids' ? "Kids " : "Women's ");
        suggestionsHtml += `
          <li><a href="#" data-query="${query}">${query}</a></li>
          <li><a href="#" data-query="${prefix}${query}">${prefix}${query}</a></li>
          <li><a href="#" data-query="${query} new in">${query} new in</a></li>
        `;
      }
      queriesContainer.innerHTML = suggestionsHtml;
    }

    // Render Products Grid (5-column luxury cards matching SS2)
    if (products.length > 0) {
      if (emptyState) emptyState.style.display = 'none';
      let cardsHtml = '';
      products.slice(0, 10).forEach(product => {
        const imgUrl = product.image || product.featured_image?.url || '';
        cardsHtml += `
          <a href="${product.url}" class="liujo-search-card">
            <div class="liujo-search-card__media">
              ${imgUrl ? `<img src="${imgUrl}" alt="${product.title}" loading="lazy">` : ''}
            </div>
            <span class="liujo-search-card__title">${product.title}</span>
          </a>
        `;
      });
      if (productsContainer) productsContainer.innerHTML = cardsHtml;
    } else {
      if (emptyState) emptyState.style.display = 'block';
    }
  }
}
