import { sayHello } from './greet-module/greet';


function showHello(element: string, name: string) {
  setTimeout(() => {
    const e = document.getElementById(element);
    e.innerHTML = sayHello(name);
    console.log('val', e);
    request();
  }, 2000);
}

function request() {
  var xhttp = new XMLHttpRequest();

  xhttp.open('GET', '/api/request/test');
  xhttp.send();
  xhttp.onreadystatechange = () => {
    const e = document.getElementById('test');
    e.innerHTML = sayHello(xhttp.responseText);
  };
}

showHello('test', 'uhul');