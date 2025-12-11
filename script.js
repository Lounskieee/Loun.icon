// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBShC2hmWsU2xV5AG2HDpYUSnZHC64C9vM",
  authDomain: "ratings-7d5fe.firebaseapp.com",
  databaseURL: "https://ratings-7d5fe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ratings-7d5fe",
  storageBucket: "ratings-7d5fe.appspot.com",
  messagingSenderId: "906736193900",
  appId: "1:906736193900:web:9a064e1959cb7f27a96349",
  measurementId: "G-PEYZN82DZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const ratingsRef = ref(database, 'ratings');

// DOM elements
const avgDisplay = document.getElementById('avgDisplay');
const countDisplay = document.getElementById('countDisplay');
const starsFront = document.getElementById('starsFront');
const buttons = document.querySelectorAll('.rate-control button');
const cntEls = [
  null,
  document.getElementById('cnt1'),
  document.getElementById('cnt2'),
  document.getElementById('cnt3'),
  document.getElementById('cnt4'),
  document.getElementById('cnt5')
];
const fillEls = [
  null,
  document.getElementById('fill1'),
  document.getElementById('fill2'),
  document.getElementById('fill3'),
  document.getElementById('fill4'),
  document.getElementById('fill5')
];

let currentAvg = 0; // Stores live average

// Add rating to Firebase
function addRating(value) {
  push(ratingsRef, { value: value, timestamp: Date.now() });
}

// Update UI with live data
function updateUI(snapshot) {
  const ratings = [];
  snapshot.forEach(child => {
    const val = Number(child.val().value);
    if(val >= 1 && val <= 5) ratings.push(val);
  });

  const counts = {1:0,2:0,3:0,4:0,5:0};
  ratings.forEach(r => counts[r]++);

  const total = ratings.length;
  const avg = total ? ratings.reduce((a,b)=>a+b,0)/total : 0;
  currentAvg = avg;

  avgDisplay.textContent = avg.toFixed(1);
  countDisplay.textContent = total + (total === 1 ? ' rating' : ' ratings');
  starsFront.style.width = (avg/5*100)+'%';

  for(let i=1;i<=5;i++){
    cntEls[i].textContent = counts[i];
    fillEls[i].style.width = total ? (counts[i]/total*100)+'%' : '0%';
  }
}

// Listen for real-time updates
onValue(ratingsRef, updateUI);

// Button interactions
buttons.forEach(btn => {
  const value = Number(btn.dataset.value);

  btn.addEventListener('mouseenter', () => {
    starsFront.style.width = (value/5*100)+'%';
  });

  btn.addEventListener('mouseleave', () => {
    starsFront.style.width = (currentAvg/5*100)+'%';
  });

  btn.addEventListener('click', () => {
    if(localStorage.getItem('hasRated') === 'true'){
      alert('You already rated!');
      return;
    }
    addRating(value);
    localStorage.setItem('hasRated','true');
    alert('Thanks for your rating!');
  });
});
