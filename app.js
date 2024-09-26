// Firebase Configuração
const firebaseConfig = {
  apiKey: "AIzaSyD6DivFOSwMY7nSwJusPMPCYwfUCzXWKXw",
  authDomain: "marketlocal-b6ffd.firebaseapp.com",
  projectId: "marketlocal-b6ffd",
  storageBucket: "marketlocal-b6ffd.appspot.com",
  messagingSenderId: "645582157673",
  appId: "1:645582157673:web:8e7363d3bf7fcbb309eff8",
  measurementId: "G-G764C9LQ2M"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Referências do DOM
const productForm = document.getElementById('product-form');
const productsList = document.getElementById('products-list');

// Cadastrar Produto
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const sellerName = document.getElementById('seller-name').value;
  const sellerWhatsApp = document.getElementById('seller-whatsapp').value;
  const productName = document.getElementById('product-name').value;
  const productDescription = document.getElementById('product-description').value;
  const productImage = document.getElementById('product-image').files[0];

  try {
    // Salvar a imagem no Firebase Storage
    const storageRef = storage.ref('products/' + productImage.name);
    await storageRef.put(productImage);
    const imageUrl = await storageRef.getDownloadURL();

    // Salvar os dados no Firestore
    await db.collection('products').add({
      sellerName,
      sellerWhatsApp,
      productName,
      productDescription,
      imageUrl
    });

    alert('Produto cadastrado com sucesso!');
    productForm.reset();
    loadProducts(); // Recarregar a lista de produtos
  } catch (error) {
    console.error('Erro ao cadastrar o produto:', error);
  }
});

// Carregar produtos do Firestore
async function loadProducts() {
  productsList.innerHTML = ''; // Limpa a lista antes de carregar

  try {
    const querySnapshot = await db.collection('products').get();

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      productsList.innerHTML += `
        <div class="product">
          <img src="${product.imageUrl}" alt="${product.productName}">
          <h3>${product.productName}</h3>
          <p>${product.productDescription}</p>
          <a class="buy-btn" href="https://wa.me/${product.sellerWhatsApp}?text=Olá,%20gostaria%20de%20comprar%20o%20produto%20${product.productName}!" target="_blank">
            Fazer a compra
          </a>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

// Carregar produtos ao iniciar
loadProducts();
