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
    })
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
  /**
   * Блок плавно появляется из прозрачного.
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   */
  function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
  }

  function resetFadeIn(element) {
      element.classList.remove('show');
      element.style.transitionDuration = null;
  }

  function fadeOut(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('show');
    element.classList.add('hide');
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
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
  }

  /**
   * Функция, увеличивающая/уменьшающая элемент
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
   */
  function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
  }

  function moveAndHide(element, duration) {
    const moveDuration = duration * 2/ 5;
    const fadeDuration = duration * 3/ 5;
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

  return {
    fadeIn, fadeOut, move, scale, moveAndHide, showAndHide, heartBeating
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