let req = indexedDB.open("jiroDV", 1);

req.onupgradeneeded = event => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains("heroes")) {
        db.createObjectStore("heroes", { 
            keyPath: "id"
         });
    }
};

req.onsuccess = event => {
    let db = event.target.result;

    // Datos actualizados (asegúrate de que el 'id' coincida con el que quieres cambiar)
    let heroesModificados = [
        { id: 1, nombre: "Superman", mensaje: "¡Actualizado: Ahora tengo visión de rayos X!" },
        { id: 2, nombre: "Ironman", poder: "¡Actualizado: Nueva armadura Mark 85!" }
    ];

    // Iniciamos la transacción en modo 'readwrite'
    let transaction = db.transaction("heroes", "readwrite");

    transaction.onerror = event => {
        console.error("Error en la transacción de actualización", event);
    };

    transaction.oncomplete = event => {
        console.log("Todos los registros han sido actualizados con éxito");
    };

    let heroesStore = transaction.objectStore("heroes");

    for (let heroe of heroesModificados) {
        // .put() busca por la llave primaria (id) y reemplaza el objeto completo
        let request = heroesStore.put(heroe);

        request.onsuccess = event => {
            console.log(`Héroe con ID ${heroe.id} modificado correctamente`);
        };

        request.onerror = event => {
            console.error("Error al modificar el héroe", event);
        };
    }
};    
 


 


req.onerror = e =>{
    console.log("Error en la transaccion", e);
}





