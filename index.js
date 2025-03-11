addListeners();

function addListeners() {
  document.getElementById('fadeInPlay')
    .addEventListener('click', function () {
      const block = document.getElementById('fadeInBlock');
      fadeIn(block, 5000);
    });

  document.getElementById('movePlay')
    .addEventListener('click', function () {
      const block = document.getElementById('moveBlock');
      move(block, 1000, {x: 100, y: 10});
    });

  document.getElementById('scalePlay')
    .addEventListener('click', function () {
      const block = document.getElementById('scaleBlock');
      scale(block, 1000, 1.25);
    });

  document.getElementById('moveAndHidePlay')
    .addEventListener('click', function () {
      const block = document.getElementById('moveAndHideBlock');
      moveAndHideAnimation = moveAndHide(block, 5000);
    });

  document.getElementById('moveAndHideReset')
    .addEventListener('click', function () {
      if (moveAndHideAnimation && moveAndHideAnimation.reset)
        moveAndHideAnimation.reset();
    })

  document.getElementById('showAndHidePlay')
    .addEventListener('click', function () {
      const block = document.getElementById('showAndHideBlock');
      showAndHide(block, 5000);
    });

  document.getElementById('heartBeatingPlay')
    .addEventListener('click', function () {
      const block = document.getElementById('heartBeatingBlock');
      heartBeatingAnimation = heartBeating(block);
    });

  document.getElementById('heartBeatingStop')
    .addEventListener('click', function () {
      if (heartBeatingAnimation) {
        heartBeatingAnimation.stop();
      }
    });

  document.getElementById('customAnimationPlay')
    .addEventListener('click', function () {
      const element = document.getElementById('customAnimationBlock');
      const customAnimation = animaster()
        .addMove(200, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1);
      customAnimation.play(element);
    });
}

function getTransform(translation, ratio) {
  const result = [];
  if (translation) {
    result.push(`translate(${translation.x}px,${translation.y}px)`);
  }
  if (ratio) {
    result.push(`scale(${ratio})`);
  }
  return result.join(' ');
}

function animaster() {
  let _steps = []

  /**
   * Блок плавно появляется из прозрачного.
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   */
  function fadeIn(element, duration) {
    return animaster().addFadeIn(duration).play(element);
  }

  function resetFadeIn(element) {
    element.classList.remove('show');
    element.style.transitionDuration = null;
  }

  function fadeOut(element, duration) {
    return animaster().addFadeOut(duration).play(element);
  }

  function resetFadeOut(element) {
    element.classList.remove('hide');
    element.style.transitionDuration = null;
  }

  function resetMoveAndScale(element) {
    element.style.transitionDuration = null;
    element.style.transform = null;
  }

  /**
   * Функция, передвигающая элемент
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   * @param translation — объект с полями x и y, обозначающими смещение блока
   */
  function move(element, duration, translation) {
    return animaster().addMove(duration, translation).play(element);
  }

  /**
   * Функция, увеличивающая/уменьшающая элемент
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
   */
  function scale(element, duration, ratio) {
    return animaster().addScale(duration, ratio).play(element);
  }

  function moveAndHide(element, duration) {
    const moveDuration = duration * 2 / 5;
    const fadeDuration = duration * 3 / 5;
    move(element, moveDuration, {x: 100, y: 20});
    const fadeTimeout = setTimeout(() => {
      fadeOut(element, fadeDuration);
    }, moveDuration)

    return {
      reset() {
        clearTimeout(fadeTimeout);
        resetMoveAndScale(element);
        resetFadeOut(element);
      }
    }
  }

  function showAndHide(element, duration) {
    element.classList.remove('show');
    const partDuration = duration / 3;
    fadeIn(element, partDuration);
    setTimeout(() => {
      fadeOut(element, partDuration);
    }, partDuration * 2);
  }

  function heartBeating(element) {
    scale(element, 500, 1.4);
    setTimeout(() => {
      scale(element, 500, 1);
    }, 500);

    const int = setInterval(() => {
      scale(element, 500, 1.4);
      setTimeout(() => {
        scale(element, 500, 1);
      }, 500);
    }, 1000);

    return {stop: () => clearInterval(int)}
  }

  function addMove(duration, translation) {
    _steps.push({
      type: 'move',
      duration,
      translation
    });
    return this;
  }

  function addScale(duration, ratio) {
    _steps.push({
      type: 'scale',
      duration,
      ratio
    });
    return this;
  }

  function addFadeIn(duration) {
    _steps.push({
      type: 'fadeIn',
      duration
    });
    return this;
  }


  function addFadeOut(duration) {
    _steps.push({
      type: 'fadeOut',
      duration
    });
    return this;
  }

  function addDelay(duration) {
    _steps.push({
      type: 'delay',
      duration
    });
    return this;
  }

  function play(element) {
    let delay = 0;
    const timeouts = [];
    const initState = {
      classList: [...element.classList],
      transform: element.style.transform,
      transitionDuration: element.style.transitionDuration
    };
    let timeout = null;

    for (const step of this._steps) {
      switch (step.type) {
        case 'move':
          timeout = setTimeout(() => {
            element.style.transitionDuration = `${step.duration}ms`;
            element.style.transform = getTransform(step.translation, null);
          }, delay);
          break;
        case 'fadeIn':
          timeout = setTimeout(() => {
            element.style.transitionDuration = `${step.duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
          }, delay);
          break;
        case 'fadeOut':
          timeout = setTimeout(() => {
            element.style.transitionDuration = `${step.duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
          }, delay);
          break;
        case 'scale':
          timeout = setTimeout(() => {
            element.style.transitionDuration = `${step.duration}ms`;
            element.style.transform = getTransform(null, step.ratio);
          }, delay);
          break;
      }
      timeouts.push(timeout);
      delay += step.duration;
    }
    return {
      stop() {
        timeouts.forEach(clearTimeout);
      },
      reset() {
        this.stop();
        element.classList = initState.classList;
        element.style.transform = initState.transform;
        element.style.transitionDuration = initState.transitionDuration;
      }
    };
  }

  function buildHandler() {
    return function () {
      this.animInstance = this.animInstance || animaster();
      return this.animInstance._steps.length ? this.animInstance.play(this) : null;
    }.bind(this);
  }

  return {
    _steps,
    fadeIn,
    fadeOut,
    move,
    scale,
    moveAndHide,
    showAndHide,
    heartBeating,
    addMove,
    play,
    addScale,
    addFadeOut,
    addFadeIn,
    buildHandler
  };
}

const anim = animaster();
const fadeIn = anim.fadeIn;
const fadeOut = anim.fadeOut;
const move = anim.move;
const scale = anim.scale;
const moveAndHide = anim.moveAndHide;
const showAndHide = anim.showAndHide;
const heartBeating = anim.heartBeating;

let heartBeatingAnimation;
let moveAndHideAnimation;
