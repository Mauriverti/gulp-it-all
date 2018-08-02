import { sayHello } from './greet-module/greet';

setTimeout(() => {
  let val: HTMLElement = document.getElementById('teste');
  console.log('val', val);
}, 2000);

function showHello(element: string, name: string) {
  const e = document.getElementById(element);
  e.innerHTML = sayHello(name);
}

showHello('teste', 'uhul');