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

const classNames = ['st0', 'st1', 'st2', 'st3', 'st4'];
const ids = ['project-left-1', 'project-right-1', 'project-left-2', 'project-right-2'];
let sets = [[]];
const dampeners = [0.01, 0.015, 0.01, 0.02, 0.01];   

document.onreadystatechange = function () {
  
  if (document.readyState == 'interactive') { 
    
    let count = 0;
    
    for (let id of ids){
      for (let className of classNames) {
        if(sets[count] !== undefined ) {
          sets[count].push(document.getElementById(id).getElementsByClassName(className));
        } else {
          sets.push([]);
          sets[count].push(document.getElementById(id).getElementsByClassName(className))
        }
      }
      count++;
    }

    const smoothMove$ = animationFrame$
      .withLatestFrom(move$, (tick, move) => move)
      .scan(lerp);

    smoothMove$.subscribe(pos => {

      for (let set of sets) {
        for (let [index, value] of set.entries() ) {
          for (let triangle of value) {
            let x = pos.x * (index == 4 ? -dampeners[index] : dampeners[index]);
            let y = pos.y * (index == 4 ? -dampeners[index] : dampeners[index]);
            const rotX = (pos.y / clientHeight * -50) + 25;
            const rotY = (pos.x / clientWidth * 50) - 25;
            triangle.setAttribute('transform', `translate(${x}, ${y})`);
          }
        } 
      }
    });
  }
}
