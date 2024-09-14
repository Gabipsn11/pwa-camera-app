// frontend/js/app.js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const upload = document.getElementById('upload');
const context = canvas.getContext('2d');
const submitButton = document.getElementById('submit');
const gallery = document.getElementById('gallery');

// Acessar a câmera do dispositivo
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play(); // Iniciar o vídeo automaticamente
    })
    .catch(err => {
        console.error('Erro ao acessar a câmera:', err);
        alert('Não foi possível acessar a câmera.');
    });

// Capturar imagem da câmera ao clicar no botão "Capturar Foto"
snap.addEventListener('click', () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// Carregar imagem da galeria ao selecionar arquivo
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Postar imagem no backend
submitButton.addEventListener('click', () => {
    canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'canvas_image.png');
        
        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.imageUrl) {
                alert('Imagem postada com sucesso!');
                loadImages(); // Atualiza a galeria após postar
            } else {
                alert('Erro ao postar imagem.');
            }
        })
        .catch(err => {
            console.error('Erro ao postar imagem:', err);
        });
    });
});

// Carregar imagens da galeria do backend
function loadImages() {
    fetch('http://localhost:5000/images')
        .then(response => response.json())
        .then(images => {
            gallery.innerHTML = ''; // Limpa a galeria antes de carregar as imagens
            images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.classList.add('gallery-image');
                gallery.appendChild(img);
            });
        })
        .catch(err => {
            console.error('Erro ao carregar imagens:', err);
        });
}

// Carrega as imagens ao abrir a página
loadImages();
