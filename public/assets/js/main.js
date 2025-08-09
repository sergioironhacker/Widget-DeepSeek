const textarea = document.querySelector(".widget__textarea");
const postsContainer = document.querySelector(".widget__posts");
const btnIA = document.querySelector(".widget__button--ia");
const postsBox = document.querySelector(".widget__posts");


btnIA.addEventListener("click", async () => {
    btnIA.disabled = true;
    btnIA.textContent = "⏳ Generando...";

    // Limpiar posts anteriores
    postsContainer.innerHTML = "";

    try {
        const userInput = textarea.value.trim() || "pádel, tenis, comida";

        // Simulación llamada API
        const response = await fetch("/api/generate-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userPreferences: userInput }),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
            // Mostrar posts en contenedor, no tocar textarea
            postsContainer.innerHTML = data.posts
                .map(post => `<p class="widget__post">${post}</p>`)
                .join("");
            // Limpiar textarea
            textarea.value = "";
        } else {
            postsContainer.innerHTML = '<p class="widget__post">No se generó la publicación</p>';
        }
    } catch (error) {
        console.error(error);
        postsContainer.innerHTML = '<p class="widget__post">Error al generar la publicación</p>';
    } finally {
        btnIA.disabled = false;
        btnIA.textContent = "⭐ Generar con IA";
    }
});



document.querySelector(".widget__button--public").addEventListener("click", () => {
    const postText = textarea.value.trim();

    if(postText.length > 0) {
        const postArticle = document.createElement("article");
        postArticle.classList.add("widget__post");
        postArticle.textContent = postText;

        postsBox.appendChild(postArticle); // Añadido al final (debajo)
        textarea.value = "";
    }
});
