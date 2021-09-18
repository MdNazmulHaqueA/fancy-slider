const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images
const showImages = images => {
   // toggleSpinner();
   //Added feature to handle not found image and UI minimalism
   gallery.innerHTML = '';
   if (images.length !== 0) {
      imagesArea.style.display = 'block';
      document.getElementById('not-found-images').classList.add('d-none');
      // show gallery title
      galleryHeader.style.display = 'flex';
      images.forEach(image => {
         let div = document.createElement('div');
         div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
         div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
         gallery.appendChild(div);
      });
      toggleSpinner();
   } else {
      toggleSpinner();
      document.getElementById('not-found-images').classList.remove('d-none');
   }
};

const getImages = query => {
   toggleSpinner();
   fetch(
      `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
   )
      .then(response => response.json())
      .then(data => showImages(data.hits)) //Fixed typo error here hitS ==> hits
      .catch(err => console.log(err));
};

let slideIndex = 0;

const selectItem = (event, img) => {
   let element = event.target;
   element.classList.toggle('added'); //image select toggler style

   let item = sliders.indexOf(img);
   if (item === -1) {
      sliders.push(img);
   } else {
      sliders.splice(item, 1); // on unselect it's removed from the sliders array
   }
};

var timer;
const createSlider = () => {
   // check slider image length
   if (sliders.length < 2) {
      alert('Select at least 2 image.');
      return;
   }
   // crate slider previous next area
   sliderContainer.innerHTML = '';
   const prevNext = document.createElement('div');
   prevNext.className =
      'prev-next d-flex w-100 justify-content-between align-items-center';
   prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

   sliderContainer.appendChild(prevNext);
   document.querySelector('.main').style.display = 'block';
   // hide image aria
   imagesArea.style.display = 'none';

   //handled duration input and negative input values
   let duration = Number(document.getElementById('duration').value);
   if (duration < 0) {
      alert('Negative timing is not possible');
      sliderContainer.style.display = 'none';
   } else if (!duration) {
      duration = 1000;
   }

   //  const duration = document.getElementById('duration').value || 1000;
   //fixed typo of duration in the html file: doration ==> duration

   sliders.forEach(slide => {
      let item = document.createElement('div');
      item.className = 'slider-item';
      item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
      sliderContainer.appendChild(item);
   });
   changeSlide(0);
   timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
   }, duration);
};

// change slider index
const changeItem = index => {
   changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = index => {
   const items = document.querySelectorAll('.slider-item');
   if (index < 0) {
      slideIndex = items.length - 1;
      index = slideIndex;
   }

   if (index >= items.length) {
      index = 0;
      slideIndex = 0;
   }

   items.forEach(item => {
      item.style.display = 'none';
   });

   items[index].style.display = 'block';
};

searchBtn.addEventListener('click', function () {
   document.querySelector('.main').style.display = 'none';
   clearInterval(timer);
   const search = document.getElementById('search');
   //handled empty search
   const searchTerm = search.value.trim();
   if (searchTerm) {
      getImages(searchTerm);
   } else {
      alert('Please write the image type in the box');
   }
   sliders.length = 0;
});

sliderBtn.addEventListener('click', function () {
   createSlider();
});

//key press search functionality - hiding existing UI while pressing key for search and on Enter key pressed
document.getElementById('search').addEventListener('keyup', event => {
   event.preventDefault();

   //empty section image while pressing keys on search box
   imagesArea.style.display = 'none';
   //empty section main while pressing keys on search box
   document.querySelector('.main').style.display = 'none';

   if (event.code === 'Enter') {
      searchBtn.click();
   }
});

//Toggle spinner function
const toggleSpinner = () => {
   const spinner = document.getElementById('spinner-loading');
   spinner.classList.toggle('d-none');
};
