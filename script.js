'use strict'

function slider( {
    selectors,   // Object of selectors Required: slide, container.
    slidesList,  // Array of slide objects. Required properties: imgPath, alt.
    startSlideIndex,  // Index of start slide. Default: 1.
    activateNavigationDots, // Expects true for creating navigation dots.
    activateAutoTurning,  // Expexts true for activating autoturning. Works while arrow havent touched.
    turningInterval,  // Auto turn timeout. Default: 10000.
    activateSlidesMoving, // Expects true for auto scrolling elongated imgs and scoping others.
    autoScrollSpeed, // Expects auto img scroll speed. Recomended speed: 1-5. Default: 2.
    autoScopeSpeed, //
    leftArrowImg,
    rightArrowImg}) {

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
    
    slidesList.forEach(slide => {           // Creates slides from array of slides and renders it
        new sliderItem(slide).render();
    });

    const slider = document.querySelector(bodSelectors.sliderSelector),         // Inits slider
        slides = document.querySelectorAll(bodSelectors.slidesSelector),
        slidesWrapper = document.querySelector(bodSelectors.wrapperSelector) || createSliderElement(slider, bodSelectors.wrapperSelector),
        sliderInner = document.querySelector(bodSelectors.innerSelector) || createSliderElement(slidesWrapper, bodSelectors.innerSelector),
        arrowPrev = document.querySelector(bodSelectors.prevArrowSelector) || createSliderElement(slidesWrapper, bodSelectors.prevArrowSelector),
        arrowNext = document.querySelector(bodSelectors.nextArrowSelector) || createSliderElement(slidesWrapper , bodSelectors.nextArrowSelector);

    sliderInner.style.width = slides.length * 100 + '%';        
    sliderInner.style.display = 'flex';
    sliderInner.style.transition = '.5s all';
    slidesWrapper.style.overflow = 'hidden';

    let currentSlide = startSlideIndex - 1 || 0;
    const width = window.getComputedStyle(slidesWrapper).width,
        indicators = [];
    let offset = width.replace(/\D/g, '')*currentSlide;
    let timerTurn;

    renderArrows(leftArrowImg, rightArrowImg, arrowPrev, arrowNext);

    if (activateNavigationDots) {
        if (activateNavigationDots === true) {                  // Inits selected options
            createDots(slides, indicators, slider);
        } else {
            warnAboutUnexpectedValue('activateNavigationDots');
        }
    }

    if (activateSlidesMoving) {
        if (activateSlidesMoving === true) {
            document.querySelectorAll('.slider__slide img').forEach( slide => {
                slide.onload = function () {
                    if (slide.offsetHeight > slide.parentNode.offsetHeight * 1.5) {
                        scrollImg(slide, autoScrollSpeed || 2)
                    } else {
                        slide.style.height = '100%';
                        scopeImg(slide, autoScopeSpeed || 2)
                    }
                }
            })
        } else {
            warnAboutUnexpectedValue('activateSlidesMoving');
        }
    }

    if (activateAutoTurning) {
        if (activateAutoTurning === true) {
            const time = turningInterval || 10000;
            timerTurn = setInterval( () => {
                [currentSlide, offset] = showSlide(slides, ++currentSlide, offset, width , sliderInner, indicators)
            }, time);
        } else {
            warnAboutUnexpectedValue('actiateAutoTurning')
        }
    }
    
    [currentSlide, offset] = showSlide(slides, currentSlide, offset, width , sliderInner, indicators)      // Shows start slide

    arrowPrev.addEventListener('click', () =>{                                                             // Activates slider controls
        [currentSlide, offset] = showSlide(slides, --currentSlide, offset, width , sliderInner, indicators)
        if (activateAutoTurning === true) {
            clearInterval(timerTurn);
        }
    })

    arrowNext.addEventListener('click', () =>{
        [currentSlide, offset] = showSlide(slides, ++currentSlide, offset, width , sliderInner, indicators)
        if (activateAutoTurning === true) {
            clearInterval(timerTurn);
        }
    })

    
    indicators.forEach( (dot) => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            [currentSlide, offset] = showSlide(slides, slideTo - 1, offset, width , sliderInner, indicators)
        })
    })

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

    function createDots(slides, indicators, slider) {
        const dots = document.createElement('ol');

        dots.classList.add('slider__indicators');
        slider.append(dots);

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i + 1);
            dot.classList.add('slider__dot');

            if ( i == 0) {
                dot.style.opacity = 1;
            }

            dots.append(dot);
            indicators.push(dot);
        }
    }

    function showSlide(slides, slideIndex, offset, width, sliderInner, indicators) {

        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } 

        if (slideIndex == slides.length) {
            slideIndex = 0;
        }

        offset = width.replace(/\D/g, '')*slideIndex;
        sliderInner.style.transform = `translateX(-${offset}px)`;

        if(indicators.length > 0) {
            indicators.forEach( (dot) => dot.style.opacity = '.5');
            indicators[slideIndex].style.opacity = 1;
        }

        return [slideIndex, offset];
    }

    function scrollImg(img, speed) {
        let offset = 0;
        const rollup = setInterval( () => {
            img.style.transform = `translateY(${(-offset)}px)`;
            offset = offset + 0.2;

            if (offset > (img.offsetHeight - img.parentNode.offsetHeight)) clearInterval(rollup)
        }, 100/speed);
    }

    function scopeImg(img, speed) {
        img.style.transform = 'scale(1.2)';
        img.style.transition = `all ${60/speed}s`;
    }

    function warnAboutUnexpectedValue(value) {
        console.warn(`Wrong property of ${value}`)
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
    {imgSrc:'img/slider/food-12.png', alt: 'food'},
    {imgSrc:'img/slider/olive-oil.jpg', alt: 'oil', text: 'Пилот 1'},
    {imgSrc:'img/slider/paprika.jpg', alt: 'paprika'}
]

slider({
    selectors, 
    slidesList,
    leftArrowImg: 'icons/arrow-left.png',
    rightArrowImg: 'icons/arrow-right.png',
    startSlideIndex: 2,
    activateNavigationDots: true,
    activateAutoTurning: true,
    turningInterval: 2000,
    activateSlidesMoving: true,
    autoScrollSpeed: 2,
    autoScopeSpeed: 2
});