// ==UserScript==
// @name         YouTube Non-Stop playing
// @version      1.0.0
// @description  Allows you play youtube infininetely
// @author       Syleront
// @run-at       document-start
// @match        *://www.youtube.com/*
// @grant        none
// @copyright    2020, Syleront
// @license      MIT
// ==/UserScript==

(() => {
  // creating mutation observer
  // that listing for all elements in DOM
  new MutationObserver((mutations) => {
    // list mutations
    mutations.forEach((mutation) => {
      // list added nodes in current mutation
      mutation.addedNodes.forEach((node) => {
        // check is node a pop-up container
        if (node.classList && node.classList.contains("ytd-popup-container") && node.tagName === "PAPER-DIALOG") {
          // get a video element from page
          const video = document.querySelector("video");
          // checking if it exist, because maybe it's not a video page?
          if (video !== null) {
            // creating new observer in pop-up window
            // that listening for attributes in element
            // because buttons appends in page after the pop-up box
            new MutationObserver((mutations) => {
              // list mutations
              mutations.forEach((mutation) => {
                // checking attribute
                if (mutation.attributeName === "aria-hidden") {
                  // checking if aria-hidden exist in target
                  // if it's true, that means that box doesn't shows to user
                  // and doesn't have required buttons
                  const isHidden = mutation.target.getAttribute("aria-hidden") !== null;
                  if (isHidden === false) {
                    // if not hidden, then getting buttons list in pop-up window
                    const buttons = node.querySelectorAll("yt-confirm-dialog-renderer > #main > .buttons > yt-button-renderer > a");
                    // check if only one button in list
                    // because it may conflicts with other
                    // pop-up boxes (e.g. unsubscribe box)
                    if (buttons.length === 1) {
                      // if that only one, then clicking on button
                      buttons[0].click();
                      // and resume the video again
                      video.play();
                      // it just works!
                    }
                  }
                }
              });
            }).observe(node, {
              attributes: true
            });
          }
        }
      });
    });
  }).observe(document, {
    childList: true,
    subtree: true
  });
})();
