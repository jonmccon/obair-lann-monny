/**
 * View Transition API support for project stack navigation
 * Provides smooth transitions when navigating from stack previews to project pages
 */

(function() {
  'use strict';

  // Check if View Transition API is supported
  const supportsViewTransitions = 'startViewTransition' in document;

  if (!supportsViewTransitions) {
    console.log('View Transitions API not supported in this browser');
    return;
  }

  /**
   * Handle navigation with view transition
   */
  function handleProjectNavigation(event) {
    const link = event.target.closest('[data-project-link]');
    
    if (!link) return;

    // Don't intercept if:
    // - Opening in new tab (cmd/ctrl + click)
    // - Middle mouse button
    // - Modified click
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const url = link.href;
    
    // Only handle same-origin links
    if (!url || url.startsWith('mailto:') || new URL(url).origin !== location.origin) {
      return;
    }

    event.preventDefault();

    // Start the view transition
    const transition = document.startViewTransition(async () => {
      // Fetch and update the page
      await updatePage(url);
    });

    // Optional: Add custom animations or handle completion
    transition.finished.then(() => {
      console.log('View transition completed');
    }).catch((error) => {
      console.error('View transition failed:', error);
    });
  }

  /**
   * Fetch new page content and update DOM
   */
  async function updatePage(url) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const newDocument = parser.parseFromString(html, 'text/html');

      // Update the page title
      document.title = newDocument.title;

      // Update the main content
      const oldMain = document.querySelector('main');
      const newMain = newDocument.querySelector('main');
      
      if (oldMain && newMain) {
        oldMain.replaceWith(newMain);
      }

      // Update browser history
      history.pushState({}, '', url);

      // Reinitialize any scripts that need to run on the new page
      initializeNewPageScripts();

    } catch (error) {
      console.error('Failed to update page:', error);
      // Fall back to regular navigation
      window.location.href = url;
    }
  }

  /**
   * Reinitialize scripts for new page content
   */
  function initializeNewPageScripts() {
    // Reinitialize lightbox if it exists
    if (window.initLightbox) {
      window.initLightbox();
    }

    // Reinitialize stacked papers if on a stacked layout page
    const stackedPapers = document.querySelector('.stacked-papers');
    if (stackedPapers) {
      // Dispatch custom event for stacked papers to reinitialize
      const event = new CustomEvent('stackedReload', {
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Handle browser back/forward navigation
   */
  function handlePopState(event) {
    if (!supportsViewTransitions) {
      return;
    }

    const transition = document.startViewTransition(async () => {
      await updatePage(location.href);
    });
  }

  // Add event listeners
  document.addEventListener('click', handleProjectNavigation);
  window.addEventListener('popstate', handlePopState);

  console.log('View Transitions enabled for project navigation');

})();
