// Se incrementa versión a 2 para ejecutar onupgradeneeded y aplicar el índice en instalaciones previas.
let req = indexedDB.open("heroDB", 1);

req.onupgradeneeded = event => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains("heroes")) {
        // Punto 1: llave primaria para el object store Heroes usando keyPath: "id"
        db.createObjectStore("heroes", { 
            keyPath: "id"
         });
    }

    // Punto 2: crear índice en el object store Heroes.
    // Nota: se obtiene la referencia al store tanto si ya existía como si se acaba de crear.
    let heroesStoreUpgrade = event.target.transaction.objectStore("heroes");
    if (!heroesStoreUpgrade.indexNames.contains("nombre_idx")) {
        heroesStoreUpgrade.createIndex("nombre_idx", "nombre", { unique: false });
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

    // Punto 3: leer registros del object store Heroes y mostrarlos en consola (getAll).
    // Se ejecuta al completar la transacción de escritura para asegurar datos actualizados.
    transaction.oncomplete = () => {
        console.log("Todos los registros han sido actualizados con éxito");
        let readTx = db.transaction("heroes", "readonly");
        let readStore = readTx.objectStore("heroes");
        let getAllRequest = readStore.getAll();

        getAllRequest.onsuccess = e => {
            console.log("Punto 3 - Registros de Heroes con getAll():", e.target.result);
        };

        getAllRequest.onerror = e => {
            console.error("Error al leer registros con getAll()", e);
        };

        // Punto 4: recorrer registros con cursor y mostrarlos en consola.
        let cursorRequest = readStore.openCursor();
        cursorRequest.onsuccess = e => {
            let cursor = e.target.result;
            if (cursor) {
                console.log("Punto 4 - Registro con cursor:", cursor.value);
                cursor.continue();
            } else {
                console.log("Punto 4 - Fin del recorrido con cursor");
            }
        };

        cursorRequest.onerror = e => {
            console.error("Error al leer registros con cursor", e);
        };
    };
};    


req.onerror = e =>{
    console.log("Error en la transaccion", e);
}





