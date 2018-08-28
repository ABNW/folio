document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    let triangles0 = document.getElementsByClassName('st0');
    let triangles1 = document.getElementsByClassName('st1');
    let triangles2 = document.getElementsByClassName('st2');
    let triangles3 = document.getElementsByClassName('st3');
    let triangles4 = document.getElementsByClassName('st4');

    let set = [triangles0, triangles1, triangles2, triangles3, triangles4];
    let dampeners = [0.01, 0.015, 0.01, 0.02, 0.01];

    const smoothMove$ = animationFrame$
      .withLatestFrom(move$, (tick, move) => move)
      .scan(lerp);

    smoothMove$.subscribe(pos => {

      for (let [index, value] of set.entries()) {
        for (let triangle of value) {
          // let x = pos.x * (index % 2 ? dampeners[index] : -dampeners[index]);
          // let y = pos.y * (index % 2 ? dampeners[index] : -dampeners[index]);
          let x = pos.x * (index == 4 ? dampeners[index] : -dampeners[index]);
          let y = pos.y * (index == 4 ? dampeners[index] : -dampeners[index]);
          triangle.setAttribute('transform', `translate(${x}, ${y})`);
        }
      }
    });
  }
}

// function moveTriangles(e, set, dampener) {
//     let dampen = dampener || 0.01;
//     let x = e.clientX * dampen;
//     let y = e.clientY * dampen;
//     for(var thing of set) {
//         thing.setAttribute('transform', `translate(${x}, ${y})`);
//     }
// }

const docElm = document.documentElement;
const {
  clientWidth,
  clientHeight
} = docElm;

// Stream of all mousemove events
const mouseMove$ = Rx.Observable
  .fromEvent(docElm, 'mousemove')
  .map(event => ({
    x: event.clientX,
    y: event.clientY
  }));

// Stream of all touchmove events
const touchMove$ = Rx.Observable
  .fromEvent(docElm, 'touchmove')
  .map(event => ({
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }));

// Combination of mousemove and touchmove streams
const move$ = Rx.Observable
  .merge(mouseMove$, touchMove$);

// Stream of requestAnimationFrame ticks
const animationFrame$ = Rx.Observable
  .interval(0, Rx.Scheduler.animationFrame);

function lerp(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const rate = 0.05;

  return {
    x: start.x + dx * rate,
    y: start.y + dy * rate,
  };
}

// Mouse/touch moves linearly interpolated
// on every animation frame

// Apply values to styles
// smoothMove$.subscribe(pos => {
//     const rotX = (pos.y / clientHeight * -50) + 25;
//     const rotY = (pos.x / clientWidth * 50) - 25;

//     cardElm.style.cssText = `
//         transform: rotateX(${rotX}deg) rotateY(${rotY}deg);
//     `;
// });
