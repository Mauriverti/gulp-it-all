import { sayHello } from './greet-module/greet';


function showHello(element: string, name: string) {
  setTimeout(() => {
    const e = document.getElementById(element);
    e.innerHTML = sayHello(name);
    console.log('val', e);
  }, 2000);
}

showHello('teste', 'uhul');