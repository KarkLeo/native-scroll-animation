function scrollAnim (params) {

    //==== Class name reg mask

    let classNameReg = /^([A-Z,a-z,\-,_])+([A-Z,a-z,\-,_,0-9])+$/m;

    //==== Input data

    let
        animationClass = typeof params.animationClass === 'string' && classNameReg.test(params.animationClass) ? params.animationClass : 'anim',
        animationClassStart = typeof params.animationClassStart === 'string' && classNameReg.test(params.animationClassStart) ? params.animationClassStart : 'animStart',
        reverse = typeof params.reverse === 'boolean' ? params.reverse : false,

        elements = Array.isArray(params.elements) ? params.elements : null,

        groups = Array.isArray(params.groups) ? params.groups : null,
        animationType = params.animationType === 'transition' || params.animationType === 'animation' ? params.animationType : 'transition',
        delayLimit = typeof params.delayLimit === 'number' && params.delayLimit > 0 ? params.delayLimit : 150,

        offsetTop = typeof params.offsetTop === 'number' ? params.offsetTop : 0,
        offsetBottom = typeof params.offsetBottom === 'number' ? params.offsetBottom : 0,
        trigger = typeof params.trigger === 'boolean' ? params.trigger : false,

        callback = typeof  params.callback === 'function' ? params.callback : null,
        callbackFromTopIn = typeof  params.callbackFromTopIn === 'function' ? params.callbackFromTopIn : null,
        callbackFromBottomIn = typeof  params.callbackFromBottomIn === 'function' ? params.callbackFromBottomIn : null,
        callbackToTopOut = typeof  params.callbackToTopOut === 'function' ? params.callbackToTopOut : null,
        callbackToBottomOut = typeof  params.callbackToBottomOut === 'function' ? params.callbackToBottomOut : null;

    //==== Internal data

    let arrayElem = [];

    //==== Functions

    //Add specialty animation class
    let addAnimationClass = () => {
        if (elements !== null) {
            document
                .querySelectorAll(String(elements))
                .forEach((element) => {
                    element.dataset.scrollVisibleStatus = 'false'
                    element.classList.add(animationClass)
                    arrayElem.push(element)
                })
        } else {
            document
                .querySelectorAll(`.${animationClass}`)
                .forEach((element) => {
                    element.dataset.scrollVisibleStatus = 'false'
                    arrayElem.push(element)
                })
        }
    };

    //Setting the animation status
    let addAnimationDelay = () => {
        if (groups !== null) {
            document
                .querySelectorAll(String(groups))
                .forEach((item) => {
                    let delay = 0;
                    item
                        .querySelectorAll(`.${animationClass}`)
                        .forEach((element, i) => {
                            element.style.cssText = `${animationType}-delay: ${i !== 0 ? delayLimit * (1 - 1 / (i + 1)) : 0}ms;`
                        })
                });
        }
    };

    //Add animation delay for group
    let setVisibleStatus = (element) => {
      let
          coords = {
            top: element.offsetTop - window.pageYOffset,
            bottom: element.offsetTop - window.pageYOffset + element.offsetHeight
          },
          windowHeight = document.documentElement.clientHeight,

          visibleStatus = element.dataset.scrollVisibleStatus === 'true',
          visibleOnScreen =
              (coords.top > offsetTop && coords.top < windowHeight - offsetBottom)
              || (coords.bottom > offsetTop && coords.bottom < windowHeight - offsetBottom)
              || (coords.top < offsetTop && coords.bottom > offsetTop),
          direction = coords.top <= windowHeight - coords.bottom;

      if ( visibleOnScreen && !visibleStatus) {
          element.dataset.scrollVisibleStatus = 'true';
          element.classList.add(animationClassStart);
          if (callback !== null) callback (element);

          if (direction) { if (callbackFromTopIn !== null) callbackFromTopIn (element) }
          else { if (callbackFromBottomIn !== null) callbackFromBottomIn (element) }
      }

      if ( !visibleOnScreen && visibleStatus && reverse) {
          element.dataset.scrollVisibleStatus = 'false';
          element.classList.remove(animationClassStart);

          if (direction) { if (callbackToTopOut !== null) callbackToTopOut (element) }
          else { if (callbackToBottomOut !== null) callbackToBottomOut (element) }
      }
    };

    // Checking all elements
    let listenElement = () => {
        arrayElem.forEach((element) => {
            setVisibleStatus(element)
        })
    };

    // Creating triggers
    if (trigger) {
        let triggerStyle = `
            position: fixed;
            left: 0;
            z-index: 99999;
            width: 100%;
            box-sizing: border-box;
            opacity: .75;
            pointer-events: none;
            filter: drop-shadow(0 1px 0 #fff);
        `;

        if(offsetTop > 0) {
            let offsetTopTrigger = document.createElement('div');
            offsetTopTrigger.style.cssText = `
                ${triggerStyle} 
                top: 0;
                border-bottom: 1px dashed red;
                height: ${offsetTop}px;
                transform-origin: 0 100%;
            `;
            document.body.append(offsetTopTrigger)
        }
        if(offsetBottom > 0) {
            let offsetBottomTrigger = document.createElement('div');
            offsetBottomTrigger.style.cssText = `
                ${triggerStyle}  
                bottom: 0;                                                            
                border-top: 1px dashed red;
                height: ${offsetBottom}px;
            `;
            document.body.append(offsetBottomTrigger)
        }
    }

    //Synchronous start
    let promiseAnimation = new Promise((resolve, reject) => {
        addAnimationClass();
        resolve();
    });
    promiseAnimation
        .then(() => addAnimationDelay())
        .then(() => {
            window.addEventListener('scroll', listenElement);
            listenElement();
        })
}