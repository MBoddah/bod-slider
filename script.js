'use strict'

function slider( {
    selectors,
    activateLoop,
    actuvateAutoTurning,
    activateLinks,
    minimizedWidth,
    minimizedHealth,
    maximizedWidth,
    maximizedHeight,
    turningInterval,
    loadSpinnerImg,
    leftArrowImg,
    rightArrowImg,
    dotsPosition,
    arrowPosition,
    dotsOverlay,
    arrowsOverlay,
    overlayOpacity}) {

        const bodSelectors = prepareSelectors(selectors);
        
        const slider = document.querySelector(bodSelectors.sliderSelector),
            slides = document.querySelectorAll(bodSelectors.slidesSelector),
            slidesWrapper = document.querySelector(bodSelectors.wrapperSelector) || createSliderElement(slider, bodSelectors.wrapperSelector),
            slidesInner = document.querySelector(bodSelectors.innerSelector) || createSliderElement(slidesWrapper, bodSelectors.innerSelector),
            arrowPrev = document.querySelector(bodSelectors.prevArrowSelector) || createSliderElement(slidesInner, bodSelectors.prevArrowSelector),
            arrowNext = document.querySelector(bodSelectors.nextArrowSelector) || createSliderElement(slidesInner, bodSelectors.nextArrowSelector);

        slidesInner.style.width = slides.length * 100 + '%';
        slidesInner.style.display = 'flex';
        slidesInner.style.transition = '.5s all';

        slidesWrapper.style.overflow = 'hidden';
            

    function createSliderElement(parentElement, elementClass) {
        const newElement = document.createElement('div');
        newElement.classList.add(elementClass);
        parentElement.append(newElement);
    }

    function prepareSelectors(selectors) {
        return {
            sliderSelector: selectors.container,
            slidesSelector: selectors.slide,
            wrapperSelector: selectors.wrapper || '.offer__slider-wrapper-def',
            innerSelector: selectors.inner || '.offer__slider-inner-def',
            prevArrowSelector: selectors.arrowPrev || '.offer__slider-prev-def',
            nextArrowSelector: selectors.arrowNext || '.offer__slider-prev-def'
        }
    }

}

const selectors = {
    slide: '.offer__slide',
    container: '.offer__slider',
    arrowNext: '.offer__slider-next',
    arrowPrev: '.offer__slider-prev',
    wrapper: '.offer__slider-wrapper',
    inner: '.offer__slider-inner'
};

slider({selectors});