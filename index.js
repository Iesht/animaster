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
    return animaster()
      .addMove(moveDuration, { x: 100, y: 20 })
      .addFadeOut(fadeDuration)
      .play(element);
  }

  function showAndHide(element, duration) {
    const partDuration = duration / 3;
    return animaster()
      .addFadeIn(partDuration)
      .addDelay(partDuration)
      .addFadeOut(partDuration)
      .play(element);
  }

  function heartBeating(element) {
    return animaster()
      .addScale(500, 1.4)
      .addScale(500, 1)
      .play(element, true);
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

  function play(element, cycled = false) {
    let totalDelay = 0;
    const timeouts = [];
    const initState = {
      classList: [...element.classList],
      transform: element.style.transform,
      transitionDuration: element.style.transitionDuration
    };

    function runAnimation() {
      let delay = 0;
      for (const step of _steps) {
        let timeout;
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
          case 'delay':
            timeout = setTimeout(() => {}, delay);
            break;
        }
        timeouts.push(timeout);
        delay += step.duration;
      }
      return delay;
    }

    totalDelay = runAnimation();

    let cycleTimeout;
    if (cycled) {
      cycleTimeout = setTimeout(function cycle() {
        runAnimation();
        cycleTimeout = setTimeout(cycle, totalDelay);
        timeouts.push(cycleTimeout);
      }, totalDelay);
    }

    return {
      stop() {
        timeouts.forEach(clearTimeout);
      },
      reset() {
        this.stop();
        element.classList = initState.classList.join(' ');
        element.style.transform = initState.transform;
        element.style.transitionDuration = initState.transitionDuration;
      }
    };
  }

  function buildHandler(cycled = false) {
    const animInstance = this;
    return function () {
      return animInstance._steps.length ? animInstance.play(this, cycled) : null;
    };
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
    addDelay,
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
