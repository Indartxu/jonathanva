document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('get-id');
  const iCategoryInput = document.getElementById('iCategoryInput');
  const messageSpan = document.getElementById('message');

  button.addEventListener('click', async () => {
    console.log("Botón pulsado para obtener inditex.iCategoryId...");

    try {
      // 1. Obtenemos la pestaña activa
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // 2. Inyectamos el script en el 'MAIN' world para compartir el mismo contexto que la web
      const injection = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: 'MAIN', // <--- Esta línea es clave
        func: () => {
          console.log("Leyendo window.inditex?.iCategoryId (MAIN world):", window.inditex?.iCategoryId);
          return window.inditex && window.inditex.iCategoryId 
            ? window.inditex.iCategoryId 
            : null;
        }
      });

      // 3. Recogemos el resultado y lo mostramos
      const result = injection[0].result;
      console.log("Resultado de la inyección:", result);

      if (result) {
        iCategoryInput.value = result;
        messageSpan.textContent = `Valor obtenido correctamente: ${result}`;
      } else {
        iCategoryInput.value = "";
        messageSpan.textContent = "No se encontró inditex.iCategoryId o no está disponible en esta página.";
      }

    } catch (error) {
      console.error("Error:", error);
      iCategoryInput.value = "";
      messageSpan.textContent = "Error: " + error.message;
    }
  });
});