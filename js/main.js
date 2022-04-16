//Example fetch using pokemonapi.co
document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  const choice = document.querySelector('input').value
  const url = 'https://world.openfoodfacts.org/api/v0/product/'+choice

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        let packagingMaterial = document.querySelector('#packaging')
        let immediateFail = false;

        document.querySelector('#product').innerText = data.product.brands + ' ' + data.product.product_name;
        packagingMaterial.innerText = data.product.packaging_tags[0].slice(3);
        document.querySelector('#nutriScore').innerText = data.product.nutrition_grade_fr.toUpperCase();
        document.querySelector('#novaScore').innerText = data.product.nova_group;
        document.querySelector('img').src = data.product.image_front_small_url;
        document.querySelector('#ingredients').innerHTML = data.product.ingredients_text_en;

        data.product.labels.split(', ').includes('Vegan') ? immediateFail = false : immediateFail = true; 
        data.product.packagings.includes('plastic') ? immediateFail = true : immediateFail = false;
        // checkPackaging(data.product.packaging_tags.includes('plastic'));
        checkNutriScore(data.product.nutrition_grade_fr.toUpperCase());
        checkNovaScore(data.product.nova_group);

        immediateFail = true ? document.querySelector('#result').innerText = 'Not for you.' : document.querySelector('#result').innerText = 'CONSUME!!';
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

// function checkPackaging(a) {
//   if (a = 'plastic') {
//       document.querySelector('#packaging').style.color = 'red';
//       immediateFail = true;
//   }
// }

function checkNutriScore(b) {
  switch (b) {
    case 'A':
      document.querySelector('#nutriSCore').style.color = 'green';
      break;
    case 'B':
      document.querySelector('#nutriScore').style.color = 'lightgreen';
      break;
    case 'C':
      document.querySelector('#nutriScore').style.color = 'yellow';
      break;
    case 'D':
      document.querySelector('#nutriScore').style.color = 'orange';
      break;
    case 'E':
      document.querySelector('#nutriScore').style.color = 'red';
      break;
  }
}

function checkNovaScore(c) {
  switch (c) {
    case 1:
      document.querySelector('#novaScore').style.color = 'green';
      break;
    case 2:
      document.querySelector('#novaScore').style.color = 'yellow';
      break;
    case 3:
      document.querySelector('#novaScore').style.color = 'orange';
      break;
    case 4:
      document.querySelector('#novaScore').style.color = 'red';
      break;
  }
}