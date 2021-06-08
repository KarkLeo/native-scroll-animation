# native-scroll-animation
Function for create animation with scroll

Demo: https://karkleo.github.io/native-scroll-animation/

Usage example
```
        scrollAnim ({
            animationClass: 'anim',
            animationClassStart: 'animStart',
            reverse: true,

            elements: [
                '.track'
            ],

            offsetTop: 250,
            offsetBottom: 250,
            trigger: true,

            callback: (element) => {
                element.classList.remove('animTopIn', 'animTopOut', 'animBottomIn', 'animBottomOut');
                element.classList.add('animTopIn')
            },
            callbackFromTopIn: (element) => {
                element.classList.remove('animTopIn', 'animTopOut', 'animBottomIn', 'animBottomOut');
                element.classList.add('animTopIn')
            },
            callbackFromBottomIn: (element) => {
                element.classList.remove('animTopIn', 'animTopOut', 'animBottomIn', 'animBottomOut');
                element.classList.add('animBottomIn')
            },
            callbackToTopOut: (element) => {
                element.classList.remove('animTopIn', 'animTopOut', 'animBottomIn', 'animBottomOut');
                element.classList.add('animTopOut')
            },
            callbackToBottomOut: (element) => {
                element.classList.remove('animTopIn', 'animTopOut', 'animBottomIn', 'animBottomOut');
                element.classList.add('animBottomOut')
            }
        });
```
The сode is not compressed. You can compress yourself.
