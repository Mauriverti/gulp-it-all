import { sayHello } from './greet-module/greet';


export function showHello(element: string, name: string) {
  setTimeout(() => {
    const e = document.getElementById(element);
    e.innerHTML = sayHello(name);
    console.log('val', e);
    request();
  }, 2000);
}

export function request() {
  var xhttp = new XMLHttpRequest();

  xhttp.open('GET', '/api/rules');
  xhttp.send();
  xhttp.onreadystatechange = () => {
    const e = document.getElementById('test');
    e.innerHTML = sayHello(xhttp.responseText);
  };
}

export function sum(a: number, b: number): number {
  return a+b;
}

showHello('test', 'uhul');