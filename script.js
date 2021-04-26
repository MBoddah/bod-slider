'use strict'

function slider( {
    selectors,   // Object of selectors Required: slide, container
    slidesList,  // Array of slide objects. Required properties: imgPath, alt.
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

    const bodSelectors = prepareSelectors(selectors);           // Creates a selectors object. Declares standard classes to unspecified
    class sliderItem {                                          // Creates a slider object. Expects objects of img path (required), alt (required) and text
        constructor( {imgSrc, alt, text}) {
            this.imgSrc = imgSrc;
            this.alt = alt;
            this.text = text;
            this.parent = document.querySelector(bodSelectors.innerSelector);
            this.itemClass = bodSelectors.slidesSelector.slice(1);
        }

        render() {
            const item = document.createElement('div');
            item.classList.add(this.itemClass);
            if(this.text) {
                item.innerHTML = `
                <img src=${this.imgSrc} alt=${this.alt}>
                <div class="slider__overlay">
                    <div class="slider__text">${this.text}</div>
                </div>
            `} else {
                item.innerHTML = `
                <img src=${this.imgSrc} alt=${this.alt}>
            `}

            this.parent.append(item);
        }
    }
    
    slidesList.forEach(slide => {
        new sliderItem(slide).render();
    });

    const slider = document.querySelector(bodSelectors.sliderSelector),
        slides = document.querySelectorAll(bodSelectors.slidesSelector),
        slidesWrapper = document.querySelector(bodSelectors.wrapperSelector) || createSliderElement(slider, bodSelectors.wrapperSelector),
        slidesInner = document.querySelector(bodSelectors.innerSelector) || createSliderElement(slidesWrapper, bodSelectors.innerSelector),
        arrowPrev = document.querySelector(bodSelectors.prevArrowSelector) || createSliderElement(slidesWrapper, bodSelectors.prevArrowSelector),
        arrowNext = document.querySelector(bodSelectors.nextArrowSelector) || createSliderElement(slidesWrapper , bodSelectors.nextArrowSelector);

    slidesInner.style.width = slides.length * 100 + '%';
    slidesInner.style.display = 'flex';
    slidesInner.style.transition = '.5s all';
    slidesWrapper.style.overflow = 'hidden';

    renderArrows(leftArrowImg, rightArrowImg, arrowPrev, arrowNext);

    function createSliderElement(parentElement, elementClass) {
        const newElement = document.createElement('div');
        newElement.classList.add(elementClass.slice(1));
        parentElement.append(newElement);
        return newElement;
    }

    function prepareSelectors(selectors) {
        return {
            sliderSelector: selectors.container,
            slidesSelector: selectors.slide,
            wrapperSelector: selectors.wrapper || '.slider__wrapper',
            innerSelector: selectors.inner || '.slider__inner',
            prevArrowSelector: selectors.arrowPrev || '.slider__prev',
            nextArrowSelector: selectors.arrowNext || '.slider__next'
        }
    }

    function renderArrows(leftUrl, rightUrl, leftContainer, rightContainer) {
        const left = document.createElement('img'),
        right = document.createElement('img');

        left.src = leftUrl;
        right.src = rightUrl;
        leftContainer.append(left);
        rightContainer.append(right);
    }
}

const selectors = {
    slide: '.slider__slide',
    container: '.slider',
    wrapper: '.slider__wrapper',
    inner: '.slider__inner'
};

const slidesList = [
    {imgSrc:'img/slider/pepper.jpg', alt: 'pepper'},
    {imgSrc:'img/slider/food-12.jpg', alt: 'food'},
    {imgSrc:'img/slider/olive-oil.jpg', alt: 'oil', text: 'Пилот 1'},
    {imgSrc:'img/slider/paprika.jpg', alt: 'paprika'}
]

slider({
    selectors, 
    slidesList,
    leftArrowImg: 'icons/left.svg',
    rightArrowImg: 'icons/right.svg'
});