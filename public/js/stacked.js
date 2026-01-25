/**
 * Stacked Papers Navigation JavaScript
 * Handles navigation, keyboard shortcuts, and paper state management
 */

(function() {
  'use strict';

  // State management
  let currentIndex = 0;
  let flippedPapers = new Set();
  let papers = [];
  let totalPapers = 0;

  // DOM elements
  let prevButton, nextButton, resetButton;
  let currentPositionElement, totalPapersElement;

  /**
   * Initialize the stacked papers functionality
   */
  function init() {
    // Get all papers
    papers = Array.from(document.querySelectorAll('.paper'));
    totalPapers = papers.length;

    if (totalPapers === 0) {
      console.warn('No papers found in stacked layout');
      return;
    }

    // Get control elements
    prevButton = document.getElementById('prev-button');
    nextButton = document.getElementById('next-button');
    resetButton = document.getElementById('reset-button');
    currentPositionElement = document.getElementById('current-position');
    totalPapersElement = document.getElementById('total-papers');

    // Set initial state
    updateView();

    // Add event listeners
    addEventListeners();

    console.log(`Stacked papers initialized with ${totalPapers} papers`);
  }

  /**
   * Add all event listeners
   */
  function addEventListeners() {
    // Navigation button listeners
    if (prevButton) {
      prevButton.addEventListener('click', () => navigate(-1));
    }
    if (nextButton) {
      nextButton.addEventListener('click', () => navigate(1));
    }
    if (resetButton) {
      resetButton.addEventListener('click', reset);
    }

    // Flip button listeners on each paper
    papers.forEach((paper, index) => {
      const flipButton = paper.querySelector('.flip-button');
      if (flipButton) {
        flipButton.addEventListener('click', () => flipPaper(index));
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   */
  function handleKeyboardNavigation(event) {
    // Only handle if not in an input field
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable) {
      return;
    }

    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        navigate(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        navigate(1);
        break;
      case 'Home':
        event.preventDefault();
        reset();
        break;
    }
  }

  /**
   * Navigate to next or previous paper
   * @param {number} direction - 1 for next, -1 for previous
   */
  function navigate(direction) {
    const newIndex = currentIndex + direction;

    // Check bounds
    if (newIndex < 0 || newIndex >= totalPapers) {
      return;
    }

    currentIndex = newIndex;
    updateView();
  }

  /**
   * Flip the current paper aside
   * @param {number} index - Index of paper to flip
   */
  function flipPaper(index) {
    if (index !== currentIndex) {
      return;
    }

    // Mark paper as flipped
    flippedPapers.add(index);

    // Move to next paper if available
    if (currentIndex < totalPapers - 1) {
      currentIndex++;
      updateView();
    } else {
      // No more papers, just update the view
      updateView();
    }
  }

  /**
   * Reset to the first paper
   */
  function reset() {
    currentIndex = 0;
    flippedPapers.clear();
    updateView();

    // Announce to screen readers
    announceToScreenReader('Reset to first paper');
  }

  /**
   * Update the view based on current state
   */
  function updateView() {
    papers.forEach((paper, index) => {
      // Remove all state classes
      paper.classList.remove('active', 'stacked', 'flipped', 'hidden');
      
      // Remove tabindex from all papers first
      paper.removeAttribute('tabindex');

      if (flippedPapers.has(index)) {
        // Paper has been flipped aside
        paper.classList.add('flipped');
      } else if (index === currentIndex) {
        // Current active paper
        paper.classList.add('active');
        
        // Set focus on the active paper for accessibility
        paper.setAttribute('tabindex', '0');
      } else if (index < currentIndex) {
        // Papers before current (already viewed)
        paper.classList.add('hidden');
      } else {
        // Papers after current (stacked behind)
        paper.classList.add('stacked');
      }
    });

    // Update position indicator
    updatePositionIndicator();

    // Update button states
    updateButtonStates();
  }

  /**
   * Update the position indicator
   */
  function updatePositionIndicator() {
    if (currentPositionElement) {
      currentPositionElement.textContent = currentIndex + 1;
    }
    if (totalPapersElement) {
      totalPapersElement.textContent = totalPapers;
    }
  }

  /**
   * Update button enabled/disabled states
   */
  function updateButtonStates() {
    // Previous button
    if (prevButton) {
      if (currentIndex === 0) {
        prevButton.disabled = true;
        prevButton.setAttribute('aria-disabled', 'true');
      } else {
        prevButton.disabled = false;
        prevButton.setAttribute('aria-disabled', 'false');
      }
    }

    // Next button
    if (nextButton) {
      if (currentIndex >= totalPapers - 1) {
        nextButton.disabled = true;
        nextButton.setAttribute('aria-disabled', 'true');
      } else {
        nextButton.disabled = false;
        nextButton.setAttribute('aria-disabled', 'false');
      }
    }

    // Reset button is always enabled if papers exist
    if (resetButton) {
      resetButton.disabled = false;
      resetButton.setAttribute('aria-disabled', 'false');
    }
  }

  /**
   * Announce message to screen readers
   * @param {string} message
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.remove();
      }
    }, 1000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
