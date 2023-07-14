export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('my-database', 1);

    request.onerror = () => {
      reject(new Error('Erro ao abrir o banco de dados'));
    };

    request.onsuccess = () => {
      const db = request.result as IDBDatabase;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
      const objectStore = db.createObjectStore('my-object-store', {
        keyPath: 'id',
        autoIncrement: true
      });

      // Defina índices adicionais, se necessário
      // objectStore.createIndex('indexName', 'propertyName', { unique: false });
    };
  });
}

export function addObject(db: IDBDatabase, object: any): Promise<number> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('my-object-store', 'readwrite');
    const objectStore = transaction.objectStore('my-object-store');

    const request = objectStore.add(object);
    request.onsuccess = () => {
      const objectId = request.result as number;
      resolve(objectId);
    };

    request.onerror = () => {
      reject(new Error('Erro ao adicionar objeto no IndexedDB'));
    };
  });
}

export function getAllObjects(db: IDBDatabase): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('my-object-store', 'readonly');
    const objectStore = transaction.objectStore('my-object-store');

    const request = objectStore.getAll();
    request.onsuccess = () => {
      const objects = request.result as any[];
      resolve(objects);
    };

    request.onerror = () => {
      reject(new Error('Erro ao obter objetos do IndexedDB'));
    };
  });
}

// Outras funções para atualizar, excluir objetos, etc.
