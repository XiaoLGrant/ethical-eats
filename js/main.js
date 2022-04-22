//these fringe cases aren't working, maybe has something to do with identifying when properties aren't available in the API's object?
// ex tomato paste with no data 070552602038
// ex ketchup with no data 868563000338
// annies vegan worcestershire sauce  0092325000063 

//Other test cases
// can of artichokes 7613269357803 
// Uncle Sam's wheat berry flakes  0041653456783 
// coca cola  5449000000996 
// progresso beef soup  0041196914030 
// marukan rice vinegar  0070641064129 


document.querySelector('button').addEventListener('click', getFetch)

function getFetch(){
  let barcode = document.querySelector('#barcode').value
  
  //Add this if want to limit search to certain country barcodes (e.g. US barcodes must be 12 digits)
  /*if (barcode.length !== 12) {
    alert('Please ensure the barcode is 12 characters.')
    return;
  } */

  // Will prepend zeroes to the barcode, added while testing Trader Joe's barcodes
  // if (barcode.length !== 8) {
  //   let prependZeroesToBarcode = barcode.split('')
  //   for (let i = barcode.length; i < 8; i++) {
  //     prependZeroesToBarcode.unshift(0);
  //   }
  //   choice = prependZeroesToBarcode.join('');
  // }

  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if (data.status === 1) {
          const Product = new productInfo(data.product);
          Product.showProductName();
          Product.showProductInfo();
          Product.listIngredients();
          Product.listPackaging();

        } else if (data.status === 0) {
          alert(`Product ${barcode} not found.`)
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class productInfo {
  constructor(productData) {
    this.brand = ('brands_tags' in productData) ? productData.brands_tags : 'No data available.';
    this.productItem = productData.product_name;
    this.ingredients = productData.ingredients; //('ingredients' in productData) ? productData.ingredients : 'No data available.'
    this.image = productData.image_url;
    this.packaging = productData.packagings;
    this.nutriscore = ('nutriscore_grade' in productData) ? productData.nutriscore_grade : 'No data available.';
    this.novaScore = ('nova_group' in productData) ? productData.nova_group : 'No data available.';
  }

  showProductName() {
    let name = ''

    if (this.brand !== 'No data available.') {
      let brands = this.brand.join(', ')
      name += brands + ': ' + this.productItem
    } else {
      name += 'Brand data unavailable: ' + this.productItem
    }

    document.querySelector('#product-name').innerText = name;
  }

  showProductInfo() {
    if (!(this.image == null)) {
      document.querySelector('img').src = this.image;
      document.querySelector('#product-image').alt = 'A picture of ' + this.productItem + ' from ' + this.brand.join(', ')
      document.querySelector('#no-image').innerText = ''
    } else { // use  0070641064129  to test if working, seems to be ok for image
      document.querySelector('#no-image').innerText = 'No image available.'
      document.querySelector('img').src = '';
      document.querySelector('#product-image').alt = ''
    };
    
    document.querySelector('#nutriScore').innerText = this.nutriscore[0].toUpperCase() + this.nutriscore.slice(1);
    document.querySelector('#novaScore').innerText = this.novaScore;   
  };

  listIngredients() {
    let ings = document.querySelector('#ingredient-list')

    //clear ingredients table if there is existing data in it
    let i = 0
    while (i < ings.rows.length) {
      ings.deleteRow(i);
    }
    
    //add ingredients to the ingredients table
    if (!(this.ingredients == null)) {
      for (let key in this.ingredients) {
        let newRow = ings.insertRow(-1)
        let newIngCell = newRow.insertCell(0)
        let newVeganCell = newRow.insertCell(1)
        let ingredientItem = this.ingredients[key].id
        
        let findPrefix = ingredientItem.indexOf('en:')
        if (findPrefix !== -1) {
          ingredientItem = ingredientItem.slice(findPrefix + 3)
        }

        let newIngText = document.createTextNode(ingredientItem)
        let checkVegan = this.ingredients[key].vegan ? this.ingredients[key].vegan : 'unknown'
        let newVeganText = document.createTextNode(checkVegan)

        newIngCell.appendChild(newIngText)
        newVeganCell.appendChild(newVeganText)

        //Add styling to ingredients table depending on if data is not vegan or unknown
        if (checkVegan === 'no') {
          newVeganCell.classList.add('not-vegan')
          newIngCell.classList.add('not-vegan')
        } else if (checkVegan === 'unknown' || checkVegan === 'maybe') {
          newVeganCell.classList.add('maybe-vegan')
          newIngCell.classList.add('maybe-vegan')
        }
      }
    } //else {   //attempt to add case for if API doesn't have ingredients data
        //document.querySelector('#no-ingredients-data').innerText = 'No data ingredients available.'
     //}
  }

  listPackaging() {
    let packagingItems = this.packaging
    let packagingList = '<ul>'

    if (this.packaging.length !== 0) {
      for (let key in packagingItems) {
        let packagingItem = this.packaging[key].material
        let findPrefix = packagingItem.indexOf('en:')
        if (findPrefix !== -1) {
          packagingItem = packagingItem.slice(findPrefix + 3)
        }
        console.log(packagingItem)
        packagingList += '<li>' + packagingItem + '</li>'
      }
      packagingList += '</ul>'
      
    } else if (this.packaging.length === 0){
      packagingList = '<p>' + 'No packaging data available.' + '</p>'
    }

    document.querySelector('#packaging-list').innerHTML = packagingList;
  };
}

//Show or hide learn more dropdowns. This is not OOP and probably not the best way to incorporate this feature.
document.querySelector('#learn-about-Nutri-Score').addEventListener('click', showNutriScoreInfo)
function showNutriScoreInfo() {
  document.querySelector('#Nutri-Score-about').classList.toggle('hidden')
}

document.querySelector('#learn-about-NOVA-Score').addEventListener('click', showNOVAScoreInfo)
function showNOVAScoreInfo() {
  document.querySelector('#NOVA-Group-about').classList.toggle('hidden')
}


/*function checkNutriScore(b) {
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
}*/


/*previously in fetch(url)

          let packagingMaterial = document.querySelector('#packaging')
          let immediateFail = false;

          document.querySelector('#product').innerText = product.name;
          //data.product.brands + ' ' + data.product.product_name;
          packagingMaterial.innerText = product.packaging;
          //data.product.packagings[0];
          //.packaging_tags[0].slice(3);
          document.querySelector('#nutriScore').innerText = product.nutriscore.toUpperCase()
          //data.product.nutrition_grade_fr.toUpperCase();
          document.querySelector('#novaScore').innerText = product.novaScore
          //data.product.nova_group;
          document.querySelector('img').src = product.image
          //data.product.image_front_small_url;
          document.querySelector('#ingredients').innerHTML = product.ingredients
          //data.product.ingredients;
          //.ingredients_text_en;

          data.product.labels.split(', ').includes('Vegan') ? immediateFail = false : immediateFail = true; 
          data.product.packagings.includes('plastic') ? immediateFail = true : immediateFail = false;
          // checkPackaging(data.product.packaging_tags.includes('plastic'));
          checkNutriScore(data.product.nutrition_grade_fr.toUpperCase());
          checkNovaScore(data.product.nova_group);

          immediateFail = true ? document.querySelector('#result').innerText = 'Not for you.' : document.querySelector('#result').innerText = 'CONSUME!!';
*/