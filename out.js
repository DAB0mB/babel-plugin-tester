"use strict";

//import axios from 'axios';
function a() {
  console.group("a");
  console.log('a1');
  console.log('a2');
  console.log('a3');
  console.groupEnd();
}

function b() {
  console.group("b");
  console.log('b1');
  console.log('b2');
  console.log('b3');
  console.groupEnd();
}
a();
b();
